import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST - Cerrar caja
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "veterinario") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Solo administradores pueden cerrar la caja
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a la caja" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { observaciones } = body;

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

    // Calcular saldo final
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

    const saldoFinal =
      Number(cajaAbierta.saldo_inicial) +
      Number(totalIngresos._sum.monto || 0) -
      Number(totalEgresos._sum.monto || 0);

    // Cerrar caja
    const cajaCerrada = await prisma.caja.update({
      where: {
        id_caja: cajaAbierta.id_caja,
      },
      data: {
        fecha_cierre: new Date(),
        saldo_final: saldoFinal,
        observaciones: observaciones || cajaAbierta.observaciones,
      },
    });

    return NextResponse.json({
      caja: cajaCerrada,
      saldoFinal,
      totalIngresos: Number(totalIngresos._sum.monto || 0),
      totalEgresos: Number(totalEgresos._sum.monto || 0),
      message: "Caja cerrada exitosamente",
    });
  } catch (error) {
    console.error("Error al cerrar caja:", error);
    return NextResponse.json(
      { error: "Error al cerrar caja" },
      { status: 500 }
    );
  }
}
