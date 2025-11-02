import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre_completo, email, telefono, direccion, password } = body;

    // Validar campos requeridos
    if (!nombre_completo || !email || !telefono || !password) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos excepto dirección" },
        { status: 400 }
      );
    }

    // Validar que el password tenga al menos 6 caracteres
    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Verificar que el email no esté registrado
    const existingUser = await prisma.dueno.findFirst({
      where: { correo: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este correo ya está registrado" },
        { status: 409 }
      );
    }

    // Hashear el password con bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo dueño
    const newDueno = await prisma.dueno.create({
      data: {
        nombre_completo,
        correo: email,
        telefono,
        direccion: direccion || null,
        password: hashedPassword,
        fecha_registro: new Date(),
        activo: true,
      },
    });

    return NextResponse.json(
      {
        message: "Usuario registrado exitosamente",
        user: {
          id: newDueno.id_dueno,
          nombre: newDueno.nombre_completo,
          email: newDueno.correo,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return NextResponse.json(
      { error: "Error al registrar usuario" },
      { status: 500 }
    );
  }
}
