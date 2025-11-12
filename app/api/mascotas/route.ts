import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      nombre,
      especie,
      raza,
      fecha_nacimiento,
      sexo,
      color,
      senias_particulares,
      id_dueno, // Solo para veterinarios
    } = body;

    // Validaciones básicas
    if (!nombre || !especie) {
      return NextResponse.json(
        { error: "Nombre y especie son requeridos" },
        { status: 400 }
      );
    }

    // Determinar el dueño de la mascota
    let duenoId: number;

    if (session.user.role === "veterinario") {
      // Veterinario debe especificar el dueño
      if (!id_dueno) {
        return NextResponse.json(
          { error: "Debe seleccionar un cliente" },
          { status: 400 }
        );
      }
      duenoId = parseInt(id_dueno);
    } else {
      // Cliente registra su propia mascota
      duenoId = parseInt(session.user.id);
    }

    // Crear la mascota
    const mascota = await prisma.mascota.create({
      data: {
        nombre,
        especie,
        raza: raza || null,
        fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : null,
        sexo: sexo || null,
        color: color || null,
        senias_particulares: senias_particulares || null,
      },
    });

    // Crear la relación dueño-mascota
    await prisma.relacion_Dueno_Mascota.create({
      data: {
        id_dueno: duenoId,
        id_mascota: mascota.id_mascota,
        rol: "principal",
      },
    });

    return NextResponse.json({
      success: true,
      mascota: {
        ...mascota,
        id_dueno: duenoId,
      },
    });
  } catch (error) {
    console.error("Error al registrar mascota:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      {
        error: "Error al registrar la mascota",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// GET: Obtener mascotas del usuario o todas (para veterinarios)
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const duenoId = searchParams.get("dueno_id");

    let mascotas;

    if (session.user.role === "veterinario") {
      // Veterinarios pueden ver todas las mascotas o filtrar por dueño
      if (duenoId) {
        mascotas = await prisma.mascota.findMany({
          where: {
            Relacion_Dueno_Mascota: {
              some: {
                id_dueno: parseInt(duenoId),
              },
            },
          },
          include: {
            Relacion_Dueno_Mascota: {
              include: {
                Dueno: true,
              },
            },
          },
          orderBy: {
            nombre: "asc",
          },
        });
      } else {
        mascotas = await prisma.mascota.findMany({
          include: {
            Relacion_Dueno_Mascota: {
              include: {
                Dueno: true,
              },
            },
          },
          orderBy: {
            nombre: "asc",
          },
        });
      }
    } else {
      // Clientes solo ven sus propias mascotas
      const relacionesMascotas = await prisma.relacion_Dueno_Mascota.findMany({
        where: {
          id_dueno: parseInt(session.user.id),
        },
        include: {
          Mascota: true,
        },
        orderBy: {
          Mascota: {
            nombre: "asc",
          },
        },
      });

      mascotas = relacionesMascotas.map((relacion: any) => ({
        ...relacion.Mascota,
        Relacion_Dueno_Mascota: [relacion],
      }));
    }

    return NextResponse.json({ mascotas });
  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    return NextResponse.json(
      { error: "Error al obtener las mascotas" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar una mascota
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const idMascota = searchParams.get("id_mascota");

    if (!idMascota) {
      return NextResponse.json(
        { error: "ID de mascota requerido" },
        { status: 400 }
      );
    }

    const mascotaId = parseInt(idMascota);

    // Verificar que la mascota existe y el usuario tiene permiso
    const mascota = await prisma.mascota.findUnique({
      where: { id_mascota: mascotaId },
      include: {
        Relacion_Dueno_Mascota: true,
      },
    });

    if (!mascota) {
      return NextResponse.json(
        { error: "Mascota no encontrada" },
        { status: 404 }
      );
    }

    // Verificar permisos: veterinarios pueden eliminar cualquiera, clientes solo sus mascotas
    if (session.user.role !== "veterinario") {
      const esDueno = mascota.Relacion_Dueno_Mascota.some(
        (relacion: any) => relacion.id_dueno === parseInt(session.user.id!)
      );

      if (!esDueno) {
        return NextResponse.json(
          { error: "No tienes permiso para eliminar esta mascota" },
          { status: 403 }
        );
      }
    }

    // Verificar si tiene consultas asociadas
    const consultasCount = await prisma.consulta.count({
      where: { id_mascota: mascotaId },
    });

    if (consultasCount > 0) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar la mascota porque tiene consultas registradas",
        },
        { status: 400 }
      );
    }

    // Eliminar relaciones dueño-mascota primero
    await prisma.relacion_Dueno_Mascota.deleteMany({
      where: { id_mascota: mascotaId },
    });

    // Eliminar la mascota
    await prisma.mascota.delete({
      where: { id_mascota: mascotaId },
    });

    return NextResponse.json({
      success: true,
      message: "Mascota eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar mascota:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      {
        error: "Error al eliminar la mascota",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// PUT: Actualizar una mascota
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      id_mascota,
      nombre,
      especie,
      raza,
      fecha_nacimiento,
      sexo,
      color,
      senias_particulares,
    } = body;

    // Validaciones básicas
    if (!id_mascota) {
      return NextResponse.json(
        { error: "ID de mascota requerido" },
        { status: 400 }
      );
    }

    if (!nombre || !especie) {
      return NextResponse.json(
        { error: "Nombre y especie son requeridos" },
        { status: 400 }
      );
    }

    const mascotaId = parseInt(id_mascota);

    // Verificar que la mascota existe y el usuario tiene permiso
    const mascotaExistente = await prisma.mascota.findUnique({
      where: { id_mascota: mascotaId },
      include: {
        Relacion_Dueno_Mascota: true,
      },
    });

    if (!mascotaExistente) {
      return NextResponse.json(
        { error: "Mascota no encontrada" },
        { status: 404 }
      );
    }

    // Verificar permisos: veterinarios pueden editar cualquiera, clientes solo sus mascotas
    if (session.user.role !== "veterinario") {
      const esDueno = mascotaExistente.Relacion_Dueno_Mascota.some(
        (relacion: any) => relacion.id_dueno === parseInt(session.user.id!)
      );

      if (!esDueno) {
        return NextResponse.json(
          { error: "No tienes permiso para editar esta mascota" },
          { status: 403 }
        );
      }
    }

    // Actualizar la mascota
    const mascotaActualizada = await prisma.mascota.update({
      where: { id_mascota: mascotaId },
      data: {
        nombre,
        especie,
        raza: raza || null,
        fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : null,
        sexo: sexo || null,
        color: color || null,
        senias_particulares: senias_particulares || null,
      },
      include: {
        Relacion_Dueno_Mascota: {
          include: {
            Dueno: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      mascota: mascotaActualizada,
    });
  } catch (error) {
    console.error("Error al actualizar mascota:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      {
        error: "Error al actualizar la mascota",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
