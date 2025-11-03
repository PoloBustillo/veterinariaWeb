import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No hay sesión activa" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        isAdmin: session.user.isAdmin,
      },
      debug: "Esta información es solo para debugging"
    });
  } catch (error) {
    console.error("Error al obtener sesión:", error);
    return NextResponse.json(
      { error: "Error al obtener sesión" },
      { status: 500 }
    );
  }
}
