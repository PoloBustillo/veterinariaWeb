import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Obtener estado actual de la caja
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "veterinario") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Solo administradores pueden acceder a la caja
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a la caja" },
        { status: 403 }
      );
    }

    // Buscar caja abierta
    const cajaAbierta = await prisma.caja.findFirst({
      where: {
        fecha_cierre: null,
      },
      include: {
        Caja_Movimiento: {
          orderBy: {
            fecha: "desc",
          },
        },
      },
    });

    if (cajaAbierta) {
      // Calcular saldo actual
      const totalIngresos = await prisma.caja_Movimiento.aggregate({
        where: {
          id_caja: cajaAbierta.id_caja,
          tipo: "Ingreso",
        },
        _sum: {
          monto: true,
        },
      });

      const totalEgresos = await prisma.caja_Movimiento.aggregate({
        where: {
          id_caja: cajaAbierta.id_caja,
          tipo: "Egreso",
        },
        _sum: {
          monto: true,
        },
      });

      const saldoActual =
        Number(cajaAbierta.saldo_inicial) +
        Number(totalIngresos._sum.monto || 0) -
        Number(totalEgresos._sum.monto || 0);

      return NextResponse.json({
        caja: cajaAbierta,
        saldoActual,
        totalIngresos: Number(totalIngresos._sum.monto || 0),
        totalEgresos: Number(totalEgresos._sum.monto || 0),
      });
    }

    return NextResponse.json({ caja: null, saldoActual: 0 });
  } catch (error) {
    console.error("Error al obtener caja:", error);
    return NextResponse.json(
      { error: "Error al obtener información de caja" },
      { status: 500 }
    );
  }
}

// POST - Abrir nueva caja
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "veterinario") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Solo administradores pueden acceder a la caja
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a la caja" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { saldo_inicial, observaciones } = body;

    // Verificar que no haya caja abierta
    const cajaAbierta = await prisma.caja.findFirst({
      where: {
        fecha_cierre: null,
      },
    });

    if (cajaAbierta) {
      return NextResponse.json(
        { error: "Ya existe una caja abierta" },
        { status: 400 }
      );
    }

    // Crear nueva caja
    const nuevaCaja = await prisma.caja.create({
      data: {
        fecha_apertura: new Date(),
        saldo_inicial: saldo_inicial || 0,
        observaciones,
      },
    });

    return NextResponse.json({
      caja: nuevaCaja,
      message: "Caja abierta exitosamente",
    });
  } catch (error) {
    console.error("Error al abrir caja:", error);
    return NextResponse.json({ error: "Error al abrir caja" }, { status: 500 });
  }
}
