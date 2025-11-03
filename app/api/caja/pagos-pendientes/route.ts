import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Obtener pagos pendientes de asociar a caja
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "veterinario") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Solo administradores pueden ver pagos pendientes
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a esta información" },
        { status: 403 }
      );
    }

    // Buscar pagos que no tienen movimiento de caja asociado
    const pagosPendientes = await prisma.pago.findMany({
      where: {
        // Pagos que no están en Caja_Movimiento
        // (esto requiere una consulta más compleja)
        estado: "pagado",
        fecha: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)), // Desde hoy
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
            veterinario: true,
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },
    });

    // Obtener IDs de pagos que ya tienen movimiento en caja
    const movimientosExistentes = await prisma.caja_Movimiento.findMany({
      where: {
        concepto: {
          contains: "Pago consulta",
        },
      },
      select: {
        concepto: true,
      },
    });

    // Extraer IDs de consultas de los conceptos
    const consultasConMovimiento = movimientosExistentes
      .map((m) => {
        const match = m.concepto.match(/Pago consulta #(\d+)/);
        return match ? parseInt(match[1]) : null;
      })
      .filter((id) => id !== null);

    // Filtrar pagos que NO tienen movimiento
    const pagosSinCaja = pagosPendientes.filter(
      (pago) => !consultasConMovimiento.includes(pago.id_consulta!)
    );

    return NextResponse.json({
      pagosPendientes: pagosSinCaja,
      total: pagosSinCaja.length,
      totalMonto: pagosSinCaja.reduce((sum, p) => sum + Number(p.monto), 0),
    });
  } catch (error) {
    console.error("Error al obtener pagos pendientes:", error);
    return NextResponse.json(
      { error: "Error al obtener pagos pendientes" },
      { status: 500 }
    );
  }
}
