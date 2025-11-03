import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Obtener historial de cajas cerradas
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "veterinario") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Solo administradores pueden ver el historial de caja
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a la caja" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limite = parseInt(searchParams.get("limite") || "10");

    const cajas = await prisma.caja.findMany({
      where: {
        fecha_cierre: {
          not: null,
        },
      },
      include: {
        Caja_Movimiento: {
          orderBy: {
            fecha: "desc",
          },
        },
      },
      orderBy: {
        fecha_cierre: "desc",
      },
      take: limite,
    });

    // Calcular estadísticas para cada caja
    const cajasConEstadisticas = cajas.map((caja) => {
      const totalIngresos = caja.Caja_Movimiento.filter(
        (m) => m.tipo === "Ingreso"
      ).reduce((sum, m) => sum + Number(m.monto), 0);

      const totalEgresos = caja.Caja_Movimiento.filter(
        (m) => m.tipo === "Egreso"
      ).reduce((sum, m) => sum + Number(m.monto), 0);

      return {
        ...caja,
        totalIngresos,
        totalEgresos,
        cantidadMovimientos: caja.Caja_Movimiento.length,
      };
    });

    return NextResponse.json({ cajas: cajasConEstadisticas });
  } catch (error) {
    console.error("Error al obtener historial:", error);
    return NextResponse.json(
      { error: "Error al obtener historial de cajas" },
      { status: 500 }
    );
  }
}
