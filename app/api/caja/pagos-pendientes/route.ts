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
        Venta_Producto: {
          include: {
            Producto: true,
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
        OR: [
          { concepto: { contains: "Pago consulta" } },
          { concepto: { contains: "Venta de productos" } },
        ],
      },
      select: {
        concepto: true,
      },
    });

    // Extraer IDs de consultas y pagos de los conceptos
    const consultasConMovimiento = new Set<number>();
    const ventasConMovimiento = new Set<string>();

    movimientosExistentes.forEach((m) => {
      // Para consultas: "Pago consulta #123"
      const matchConsulta = m.concepto.match(/Pago consulta #(\d+)/);
      if (matchConsulta) {
        consultasConMovimiento.add(parseInt(matchConsulta[1]));
      }

      // Para ventas: "Venta de productos: 2x Producto A, 1x Producto B"
      if (m.concepto.includes("Venta de productos")) {
        ventasConMovimiento.add(m.concepto);
      }
    });

    // Filtrar pagos que NO tienen movimiento
    const pagosSinCaja = pagosPendientes.filter((pago) => {
      // Si es pago de consulta
      if (pago.id_consulta) {
        return !consultasConMovimiento.has(pago.id_consulta);
      }

      // Si es venta de productos
      if (pago.Venta_Producto && pago.Venta_Producto.length > 0) {
        // Verificar si ya existe un movimiento con estos productos
        // (esto es una simplificación, en producción sería más robusto)
        return true; // Por ahora incluimos todas las ventas sin movimiento
      }

      return false;
    });

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
