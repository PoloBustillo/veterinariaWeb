import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return NextResponse.json(
            { error: "Credenciales inválidas" },
            { status: 401 }
          );
        default:
          return NextResponse.json(
            { error: "Error al iniciar sesión" },
            { status: 500 }
          );
      }
    }
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
