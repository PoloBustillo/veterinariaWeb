import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Obtener todos los servicios disponibles (solo veterinarios)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "veterinario") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const servicios = await prisma.servicio.findMany({
      orderBy: {
        nombre: "asc",
      },
    });

    return NextResponse.json({ servicios });
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    return NextResponse.json(
      { error: "Error al obtener servicios" },
      { status: 500 }
    );
  }
}
