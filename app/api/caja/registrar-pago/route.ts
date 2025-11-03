import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST - Registrar pago de consulta y actualizar caja
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "veterinario") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { id_consulta, monto, metodo } = body;

    // Verificar que exista caja abierta
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

    // Verificar que la consulta exista
    const consulta = await prisma.consulta.findUnique({
      where: { id_consulta: parseInt(id_consulta) },
      include: {
        Consulta_Servicio: {
          include: {
            Servicio: true,
          },
        },
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
    });

    if (!consulta) {
      return NextResponse.json(
        { error: "Consulta no encontrada" },
        { status: 404 }
      );
    }

    // Usar transacción para registrar pago y movimiento de caja
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Registrar pago
      const pago = await tx.pago.create({
        data: {
          id_consulta: parseInt(id_consulta),
          fecha: new Date(),
          monto,
          metodo,
          estado: "pagado",
        },
      });

      // 2. Registrar movimiento en caja
      const cliente = consulta.mascota.Relacion_Dueno_Mascota[0]?.Dueno;
      const concepto = `Pago consulta #${id_consulta} - ${
        cliente?.nombre_completo || "Cliente"
      }`;

      const movimiento = await tx.caja_Movimiento.create({
        data: {
          id_caja: cajaAbierta.id_caja,
          fecha: new Date(),
          concepto,
          monto,
          tipo: "Ingreso",
        },
      });

      return { pago, movimiento };
    });

    return NextResponse.json({
      pago: resultado.pago,
      movimiento: resultado.movimiento,
      message: "Pago registrado exitosamente",
    });
  } catch (error) {
    console.error("Error al registrar pago:", error);
    return NextResponse.json(
      { error: "Error al registrar pago" },
      { status: 500 }
    );
  }
}
