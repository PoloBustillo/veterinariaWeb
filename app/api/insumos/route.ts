import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Obtener todos los insumos disponibles (solo veterinarios)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "veterinario") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const insumos = await prisma.insumo.findMany({
      where: {
        cantidad_disponible: {
          gt: 0,
        },
      },
      orderBy: {
        nombre: "asc",
      },
    });

    return NextResponse.json({ insumos });
  } catch (error) {
    console.error("Error al obtener insumos:", error);
    return NextResponse.json(
      { error: "Error al obtener insumos" },
      { status: 500 }
    );
  }
}
