import { auth, signIn, signOut } from "@/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No hay sesión activa" },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Forzar cierre de sesión
    await signOut({ redirect: false });

    return NextResponse.json({
      message: "Sesión cerrada. Por favor vuelve a iniciar sesión.",
      email: userEmail,
    });
  } catch (error) {
    console.error("Error al refrescar sesión:", error);
    return NextResponse.json(
      { error: "Error al refrescar sesión" },
      { status: 500 }
    );
  }
}
