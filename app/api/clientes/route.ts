import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Solo veterinarios pueden ver la lista de clientes
    if (session.user.role !== "veterinario") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const clientes = await prisma.dueno.findMany({
      where: {
        activo: true,
      },
      select: {
        id_dueno: true,
        nombre_completo: true,
        correo: true,
        telefono: true,
      },
      orderBy: {
        nombre_completo: "asc",
      },
    });

    return NextResponse.json({ clientes });
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return NextResponse.json(
      { error: "Error al obtener la lista de clientes" },
      { status: 500 }
    );
  }
}
