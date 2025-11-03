import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Obtener todos los productos disponibles (solo veterinarios)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "veterinario") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const productos = await prisma.producto.findMany({
      where: {
        activo: true,
      },
      orderBy: {
        nombre: "asc",
      },
      select: {
        id_producto: true,
        nombre: true,
        descripcion: true,
        precio: true,
        cantidad_disponible: true,
        categoria: true,
      },
    });

    return NextResponse.json({ productos });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}
