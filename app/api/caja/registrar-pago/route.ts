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

    // Buscar caja abierta (puede o no existir)
    const cajaAbierta = await prisma.caja.findFirst({
      where: {
        fecha_cierre: null,
      },
    });

    // Verificar que la consulta exista
    const consulta = await prisma.consulta.findUnique({
      where: { id_consulta: parseInt(id_consulta) },
      include: {
        Consulta_Servicio: {
          include: {
            Servicio: true,
          },
        },
        Mascota: {
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

    // Obtener información del cliente antes de la transacción
    const cliente = consulta.Mascota.Relacion_Dueno_Mascota[0]?.Dueno;

    // Usar transacción para registrar pago y opcionalmente movimiento de caja
  const resultado = await prisma.$transaction(async (tx: any) => {
      // 1. Registrar pago (asociar id_caja si hay caja abierta)
      const pago = await tx.pago.create({
        data: {
          id_consulta: parseInt(id_consulta),
          fecha: new Date(),
          monto,
          metodo,
          estado: "pagado",
          // Si hay caja abierta, asociar el pago inmediatamente
          ...(cajaAbierta ? { id_caja: cajaAbierta.id_caja } : {}),
        },
      });

      // 2. Registrar movimiento en caja SI hay caja abierta
      let movimiento = null;
      if (cajaAbierta) {
        const concepto = `Pago consulta #${id_consulta} - ${
          cliente?.nombre_completo || "Cliente"
        }`;

        movimiento = await tx.caja_Movimiento.create({
          data: {
            id_caja: cajaAbierta.id_caja,
            fecha: new Date(),
            concepto,
            monto,
            tipo: "Ingreso",
          },
        });
      }

      return { pago, movimiento };
    });

    return NextResponse.json({
      pago: resultado.pago,
      movimiento: resultado.movimiento,
      message: cajaAbierta
        ? "Pago registrado y asociado a caja abierta"
        : "Pago registrado. Será asociado a la caja cuando se abra.",
      sinCaja: !cajaAbierta,
    });
  } catch (error) {
    console.error("Error al registrar pago:", error);
    return NextResponse.json(
      { error: "Error al registrar pago" },
      { status: 500 }
    );
  }
}
