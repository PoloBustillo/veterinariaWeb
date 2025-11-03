import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Obtener movimientos de caja
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "veterinario") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Solo administradores pueden ver movimientos de caja
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a la caja" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const idCaja = searchParams.get("id_caja");

    if (!idCaja) {
      return NextResponse.json(
        { error: "ID de caja requerido" },
        { status: 400 }
      );
    }

    const movimientos = await prisma.caja_Movimiento.findMany({
      where: {
        id_caja: parseInt(idCaja),
      },
      orderBy: {
        fecha: "desc",
      },
    });

    return NextResponse.json({ movimientos });
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    return NextResponse.json(
      { error: "Error al obtener movimientos" },
      { status: 500 }
    );
  }
}

// POST - Registrar nuevo movimiento de caja
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "veterinario") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Solo administradores pueden registrar movimientos de caja
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a la caja" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { concepto, monto, tipo } = body;

    // Buscar caja abierta
    const cajaAbierta = await prisma.caja.findFirst({
      where: {
        fecha_cierre: null,
      },
    });

    if (!cajaAbierta) {
      return NextResponse.json(
        { error: "No hay caja abierta. Debes abrir una caja primero." },
        { status: 400 }
      );
    }

    // Validar tipo
    if (tipo !== "Ingreso" && tipo !== "Egreso") {
      return NextResponse.json(
        { error: "Tipo de movimiento inválido" },
        { status: 400 }
      );
    }

    // Crear movimiento
    const movimiento = await prisma.caja_Movimiento.create({
      data: {
        id_caja: cajaAbierta.id_caja,
        fecha: new Date(),
        concepto,
        monto,
        tipo,
      },
    });

    return NextResponse.json({
      movimiento,
      message: "Movimiento registrado exitosamente",
    });
  } catch (error) {
    console.error("Error al registrar movimiento:", error);
    return NextResponse.json(
      { error: "Error al registrar movimiento" },
      { status: 500 }
    );
  }
}
