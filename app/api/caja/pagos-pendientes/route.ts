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

    // Buscar pagos que NO están asociados a ninguna caja (id_caja es NULL)
    const pagosPendientes = await prisma.pago.findMany({
      where: {
        estado: "pagado",
        id_caja: null, // ✅ Solo pagos sin caja asociada
        fecha: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)), // Desde hoy
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
            Veterinario: true,
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

    // ✅ Ya no necesitamos filtrar manualmente, el WHERE con id_caja: null lo hace
    return NextResponse.json({
      pagosPendientes: pagosPendientes,
      total: pagosPendientes.length,
      totalMonto: pagosPendientes.reduce(
        (sum: number, p: any) => sum + Number(p.monto),
        0
      ),
    });
  } catch (error) {
    console.error("Error al obtener pagos pendientes:", error);
    return NextResponse.json(
      { error: "Error al obtener pagos pendientes" },
      { status: 500 }
    );
  }
}
