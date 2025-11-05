import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Solo veterinarios pueden registrar ventas
    if (session.user.role !== "veterinario") {
      return NextResponse.json(
        { error: "No tienes permisos para registrar ventas" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { productos, metodo_pago } = body;

    // Validar que se envíen productos
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return NextResponse.json(
        { error: "Debes incluir al menos un producto" },
        { status: 400 }
      );
    }

    // Validar método de pago
    if (
      !metodo_pago ||
      !["efectivo", "tarjeta", "transferencia"].includes(metodo_pago)
    ) {
      return NextResponse.json(
        { error: "Método de pago inválido" },
        { status: 400 }
      );
    }

    // Usar transacción para garantizar atomicidad
    const resultado = await prisma.$transaction(async (tx: any) => {
      // 1. Validar stock y obtener datos de productos
      const productosValidados = [];
      let montoTotal = 0;

      for (const item of productos) {
        const { id_producto, cantidad } = item;

        if (!id_producto || !cantidad || cantidad <= 0) {
          throw new Error("Datos de producto inválidos");
        }

        const producto = await tx.producto.findUnique({
          where: { id_producto },
        });

        if (!producto) {
          throw new Error(`Producto con ID ${id_producto} no encontrado`);
        }

        if (!producto.activo) {
          throw new Error(
            `El producto "${producto.nombre}" no está disponible`
          );
        }

        const stockDisponible = producto.cantidad_disponible || 0;
        if (stockDisponible < cantidad) {
          throw new Error(
            `Stock insuficiente para "${producto.nombre}". Disponible: ${stockDisponible}, solicitado: ${cantidad}`
          );
        }

        const subtotal = Number(producto.precio) * cantidad;
        montoTotal += subtotal;

        productosValidados.push({
          id_producto,
          nombre: producto.nombre,
          cantidad,
          precio: producto.precio,
          subtotal,
        });
      }

      // 2. Crear el registro de pago
      const pago = await tx.pago.create({
        data: {
          fecha: new Date(),
          monto: montoTotal,
          metodo: metodo_pago,
          estado: "pagado",
        },
      });

      // 3. Crear registros de Venta_Producto y actualizar inventario
      const ventasCreadas = [];
      for (const item of productosValidados) {
        // Crear venta
        const venta = await tx.venta_Producto.create({
          data: {
            id_producto: item.id_producto,
            id_pago: pago.id_pago,
            fecha: new Date(),
            cantidad: item.cantidad,
            subtotal: item.subtotal,
          },
        });

        // Reducir inventario
        await tx.producto.update({
          where: { id_producto: item.id_producto },
          data: {
            cantidad_disponible: {
              decrement: item.cantidad,
            },
          },
        });

        ventasCreadas.push({
          ...venta,
          nombre_producto: item.nombre,
        });
      }

      // 4. Registrar en caja si está abierta
      const cajaAbierta = await tx.caja.findFirst({
        where: {
          fecha_cierre: null,
        },
        orderBy: {
          fecha_apertura: "desc",
        },
      });

      let movimientoCaja = null;
      if (cajaAbierta) {
        // ✅ Asociar el pago a la caja abierta
        await tx.pago.update({
          where: { id_pago: pago.id_pago },
          data: { id_caja: cajaAbierta.id_caja },
        });

        // Crear un movimiento por cada producto vendido
        for (const item of productosValidados) {
          await tx.caja_Movimiento.create({
            data: {
              id_caja: cajaAbierta.id_caja,
              fecha: new Date(),
              concepto: `Venta: ${item.cantidad}x ${item.nombre}`,
              monto: item.subtotal,
              tipo: "Ingreso",
            },
          });
        }

        movimientoCaja = { creado: true }; // Indicador de que se crearon movimientos
      }

      return {
        pago,
        ventas: ventasCreadas,
        movimientoCaja,
        sinCaja: !cajaAbierta,
        montoTotal,
      };
    });

    return NextResponse.json({
      success: true,
      message: resultado.sinCaja
        ? "Venta registrada exitosamente. Será asociada a la caja cuando se abra."
        : "Venta registrada y asociada a caja abierta",
      data: {
        id_pago: resultado.pago.id_pago,
        monto_total: resultado.montoTotal,
        productos: resultado.ventas.length,
        metodo_pago,
        fecha: resultado.pago.fecha,
        movimientos_creados: resultado.movimientoCaja ? true : false,
        sin_caja: resultado.sinCaja,
      },
    });
  } catch (error: any) {
    console.error("❌ Error al registrar venta:", error);
    return NextResponse.json(
      { error: error.message || "Error al registrar la venta" },
      { status: 500 }
    );
  }
}
