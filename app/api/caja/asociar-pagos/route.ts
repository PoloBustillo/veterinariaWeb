import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST - Asociar pagos pendientes a la caja actual
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "veterinario") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Solo administradores pueden asociar pagos
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: "No tienes permisos para realizar esta acción" },
        { status: 403 }
      );
    }

    // Buscar caja abierta
    const cajaAbierta = await prisma.caja.findFirst({
      where: {
        fecha_cierre: null,
      },
    });

    if (!cajaAbierta) {
      return NextResponse.json(
        { error: "No hay caja abierta" },
        { status: 400 }
      );
    }

    // Obtener pagos pendientes de hoy que NO estén asociados a ninguna caja
    const pagosPendientes = await prisma.pago.findMany({
      where: {
        estado: "pagado",
        id_caja: null, // Solo pagos que no han sido asociados a ninguna caja
        fecha: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      include: {
        Consulta: {
          include: {
            Mascota: {
              include: {
                Relacion_Dueno_Mascota: {
                  include: {
                    Dueno: true,
                  },
                },
              },
            },
            Consulta_Servicio: {
              include: {
                Servicio: true,
              },
            },
            Consulta_Insumo: {
              include: {
                Insumo: true,
              },
            },
          },
        },
        Venta_Producto: {
          include: {
            Producto: true,
          },
        },
      },
    });

    if (pagosPendientes.length === 0) {
      return NextResponse.json({
        message: "No hay pagos pendientes de asociar",
        pagosAsociados: 0,
        movimientosCreados: 0,
        totalMonto: 0,
      });
    }

    // Crear movimientos de caja para cada pago pendiente
    let totalMovimientosCreados = 0;

  await prisma.$transaction(async (tx: any) => {
      for (const pago of pagosPendientes) {
        // Si es pago de consulta con detalles
        if (pago.id_consulta && pago.Consulta) {
          // Crear un movimiento por cada servicio
          if (pago.Consulta.Consulta_Servicio) {
            for (const cs of pago.Consulta.Consulta_Servicio) {
              await tx.caja_Movimiento.create({
                data: {
                  id_caja: cajaAbierta.id_caja,
                  fecha: pago.fecha || new Date(),
                  concepto: `Consulta #${pago.id_consulta} - Servicio: ${cs.Servicio.nombre} (Asociado)`,
                  monto: cs.subtotal,
                  tipo: "Ingreso",
                },
              });
              totalMovimientosCreados++;
            }
          }

          // Crear un movimiento por cada insumo
          if (pago.Consulta.Consulta_Insumo) {
            for (const ci of pago.Consulta.Consulta_Insumo) {
              const montoInsumo =
                (Number(ci.Insumo.costo_unitario) || 0) * ci.cantidad;
              await tx.caja_Movimiento.create({
                data: {
                  id_caja: cajaAbierta.id_caja,
                  fecha: pago.fecha || new Date(),
                  concepto: `Consulta #${pago.id_consulta} - Insumo: ${ci.Insumo.nombre} (${ci.cantidad}) (Asociado)`,
                  monto: montoInsumo,
                  tipo: "Ingreso",
                },
              });
              totalMovimientosCreados++;
            }
          }
        }
        // Si es venta de productos
        else if (pago.Venta_Producto && pago.Venta_Producto.length > 0) {
          for (const vp of pago.Venta_Producto) {
            await tx.caja_Movimiento.create({
              data: {
                id_caja: cajaAbierta.id_caja,
                fecha: pago.fecha || new Date(),
                concepto: `Venta: ${vp.cantidad}x ${vp.Producto.nombre} (Asociado)`,
                monto: vp.subtotal,
                tipo: "Ingreso",
              },
            });
            totalMovimientosCreados++;
          }
        }
        // Fallback para pagos sin detalle
        else {
          await tx.caja_Movimiento.create({
            data: {
              id_caja: cajaAbierta.id_caja,
              fecha: pago.fecha || new Date(),
              concepto: `Pago #${pago.id_pago} (Asociado automáticamente)`,
              monto: pago.monto,
              tipo: "Ingreso",
            },
          });
          totalMovimientosCreados++;
        }

        // ✅ IMPORTANTE: Marcar el pago como asociado a esta caja
        await tx.pago.update({
          where: { id_pago: pago.id_pago },
          data: { id_caja: cajaAbierta.id_caja },
        });
      }
    });

    return NextResponse.json({
      message: `${totalMovimientosCreados} movimientos asociados a la caja`,
      pagosAsociados: pagosPendientes.length,
      movimientosCreados: totalMovimientosCreados,
      totalMonto: pagosPendientes.reduce(
        (sum: number, p: any) => sum + Number(p.monto),
        0
      ),
    });
  } catch (error) {
    console.error("Error al asociar pagos:", error);
    return NextResponse.json(
      { error: "Error al asociar pagos pendientes" },
      { status: 500 }
    );
  }
}
