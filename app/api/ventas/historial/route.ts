import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "veterinario") {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get("fecha");
    const limite = parseInt(searchParams.get("limite") || "50");

    // Construir filtros
    const whereClause: any = {};

    if (fecha) {
      const fechaInicio = new Date(fecha);
      fechaInicio.setHours(0, 0, 0, 0);
      const fechaFin = new Date(fecha);
      fechaFin.setHours(23, 59, 59, 999);

      whereClause.fecha = {
        gte: fechaInicio,
        lte: fechaFin,
      };
    }

    // Obtener ventas con sus relaciones
    const ventas = await prisma.venta_Producto.findMany({
      where: whereClause,
      include: {
        Producto: {
          select: {
            id_producto: true,
            nombre: true,
            precio: true,
            categoria: true,
          },
        },
        Pago: {
          select: {
            id_pago: true,
            fecha: true,
            monto: true,
            metodo: true,
            estado: true,
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },
      take: limite,
    });

    // Agrupar ventas por pago (transacción)
  const ventasAgrupadas = ventas.reduce((acc: any, venta: any) => {
      const idPago = venta.id_pago;
      if (!idPago) return acc;

      if (!acc[idPago]) {
        acc[idPago] = {
          id_pago: idPago,
          fecha: venta.Pago?.fecha,
          monto_total: venta.Pago?.monto,
          metodo_pago: venta.Pago?.metodo,
          estado: venta.Pago?.estado,
          productos: [],
        };
      }

      acc[idPago].productos.push({
        id_venta: venta.id_venta,
        id_producto: venta.id_producto,
        nombre_producto: venta.Producto.nombre,
        categoria: venta.Producto.categoria,
        cantidad: venta.cantidad,
        precio_unitario: venta.Producto.precio,
        subtotal: venta.subtotal,
      });

      return acc;
    }, {});

    const resultado = Object.values(ventasAgrupadas);

    // Calcular estadísticas
    const totalVentas = resultado.length;
    const totalMonto = resultado.reduce(
      (sum: number, v: any) => sum + Number(v.monto_total || 0),
      0
    );
    const totalProductos = ventas.reduce(
      (sum, v) => sum + (v.cantidad || 0),
      0
    );

    return NextResponse.json({
      ventas: resultado,
      estadisticas: {
        total_transacciones: totalVentas,
        total_productos_vendidos: totalProductos,
        monto_total: totalMonto,
      },
    });
  } catch (error: any) {
    console.error("❌ Error al obtener historial de ventas:", error);
    return NextResponse.json(
      { error: error.message || "Error al obtener historial" },
      { status: 500 }
    );
  }
}
