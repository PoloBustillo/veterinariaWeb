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

    // Obtener pagos pendientes de hoy
    const pagosPendientes = await prisma.pago.findMany({
      where: {
        estado: "pagado",
        fecha: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      include: {
        consulta: {
          include: {
            mascota: {
              include: {
                Relacion_Dueno_Mascota: {
                  include: {
                    Dueno: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Verificar cuáles ya tienen movimiento
    const movimientosExistentes = await prisma.caja_Movimiento.findMany({
      where: {
        id_caja: cajaAbierta.id_caja,
        concepto: {
          contains: "Pago consulta",
        },
      },
      select: {
        concepto: true,
      },
    });

    const consultasConMovimiento = movimientosExistentes
      .map((m) => {
        const match = m.concepto.match(/Pago consulta #(\d+)/);
        return match ? parseInt(match[1]) : null;
      })
      .filter((id) => id !== null);

    // Filtrar pagos sin movimiento
    const pagosSinCaja = pagosPendientes.filter(
      (pago) => !consultasConMovimiento.includes(pago.id_consulta!)
    );

    // Crear movimientos de caja para cada pago pendiente
    const movimientosCreados = await prisma.$transaction(
      pagosSinCaja.map((pago) => {
        const cliente = pago.consulta?.mascota.Relacion_Dueno_Mascota[0]?.Dueno;
        const concepto = `Pago consulta #${pago.id_consulta} - ${
          cliente?.nombre_completo || "Cliente"
        } (Asociado automáticamente)`;

        return prisma.caja_Movimiento.create({
          data: {
            id_caja: cajaAbierta.id_caja,
            fecha: pago.fecha || new Date(),
            concepto,
            monto: pago.monto,
            tipo: "Ingreso",
          },
        });
      })
    );

    return NextResponse.json({
      message: `${movimientosCreados.length} pagos asociados a la caja`,
      pagosAsociados: movimientosCreados.length,
      totalMonto: pagosSinCaja.reduce((sum, p) => sum + Number(p.monto), 0),
    });
  } catch (error) {
    console.error("Error al asociar pagos:", error);
    return NextResponse.json(
      { error: "Error al asociar pagos pendientes" },
      { status: 500 }
    );
  }
}
