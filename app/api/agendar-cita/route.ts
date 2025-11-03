import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id_mascota, id_veterinario, fecha, motivo, observaciones } = body;

    // Validar campos requeridos
    if (!id_mascota || !id_veterinario || !fecha || !motivo) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Validar que la mascota existe
    const mascota = await prisma.mascota.findUnique({
      where: { id_mascota: parseInt(id_mascota) },
    });

    if (!mascota) {
      return NextResponse.json(
        { error: "La mascota no existe" },
        { status: 404 }
      );
    }

    // Validar que el veterinario existe y está activo
    const veterinario = await prisma.veterinario.findUnique({
      where: { id_veterinario: parseInt(id_veterinario) },
    });

    if (!veterinario || !veterinario.activo) {
      return NextResponse.json(
        { error: "El veterinario no está disponible" },
        { status: 404 }
      );
    }

    // Validar que la fecha no sea en el pasado
    const fechaCita = new Date(fecha);
    const ahora = new Date();
    if (fechaCita < ahora) {
      return NextResponse.json(
        { error: "No se pueden agendar citas en el pasado" },
        { status: 400 }
      );
    }

    // Validar que el horario sea en intervalos de 45 minutos
    const minutos = fechaCita.getMinutes();
    if (minutos !== 0 && minutos !== 45) {
      return NextResponse.json(
        {
          error:
            "Los horarios deben ser en intervalos de 45 minutos (por ejemplo: 10:00, 10:45, 11:00)",
        },
        { status: 400 }
      );
    }

    // Calcular el rango de 45 minutos para detectar conflictos
    const inicioRango = new Date(fechaCita.getTime());
    const finRango = new Date(fechaCita.getTime() + 45 * 60 * 1000); // +45 minutos

    // Verificar si hay conflictos de horario con otras citas del mismo veterinario
    // Una cita tiene conflicto si:
    // 1. Comienza exactamente a la misma hora
    // 2. La nueva cita comienza mientras otra está en progreso
    // 3. La nueva cita termina mientras otra está en progreso
    const citasConflicto = await prisma.consulta.findMany({
      where: {
        id_veterinario: parseInt(id_veterinario),
        estado: {
          in: ["programada", "en_proceso"],
        },
        fecha: {
          gte: new Date(fechaCita.getTime() - 45 * 60 * 1000), // 45 minutos antes
          lt: finRango, // hasta el final del rango de la nueva cita
        },
      },
    });

    if (citasConflicto.length > 0) {
      return NextResponse.json(
        {
          error:
            "El veterinario ya tiene una cita en ese horario o muy cercana. Por favor selecciona otro horario.",
        },
        { status: 409 }
      );
    }

    // Crear la consulta
    const nuevaConsulta = await prisma.consulta.create({
      data: {
        id_mascota: parseInt(id_mascota),
        id_veterinario: parseInt(id_veterinario),
        fecha: fechaCita,
        motivo: motivo,
        observaciones: observaciones || null,
        estado: "programada",
      },
    });

    // Obtener información completa después de crear
    const consultaCompleta = await prisma.consulta.findUnique({
      where: { id_consulta: nuevaConsulta.id_consulta },
      include: {
        Mascota: true,
        Veterinario: true,
      },
    });

    return NextResponse.json(
      {
        message: "Cita agendada exitosamente",
        consulta: {
          id_consulta: nuevaConsulta.id_consulta,
          mascota: consultaCompleta?.Mascota.nombre,
          veterinario: consultaCompleta?.Veterinario.nombre_completo,
          fecha: nuevaConsulta.fecha,
          motivo: nuevaConsulta.motivo,
          estado: nuevaConsulta.estado,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al agendar cita:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al agendar la cita" },
      { status: 500 }
    );
  }
}

// GET: Obtener todas las citas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get("estado");
    const id_mascota = searchParams.get("id_mascota");
    const id_veterinario = searchParams.get("id_veterinario");

    // Construir filtros
    const where: any = {};

    if (estado) {
      where.estado = estado;
    }

    if (id_mascota) {
      where.id_mascota = parseInt(id_mascota);
    }

    if (id_veterinario) {
      where.id_veterinario = parseInt(id_veterinario);
    }

    const consultas = await prisma.consulta.findMany({
      where,
      include: {
        Mascota: {
          include: {
            Relacion_Dueno_Mascota: {
              include: {
                Dueno: true,
              },
            },
          },
        },
        Veterinario: true,
      },
      orderBy: {
        fecha: "desc",
      },
    });

    // Transformar datos
    const consultasFormateadas = consultas.map((consulta: any) => {
      const duenoPrincipal = consulta.Mascota.Relacion_Dueno_Mascota.find(
        (rel: any) => rel.rol === "principal"
      );

      return {
        id_consulta: consulta.id_consulta,
        fecha: consulta.fecha,
        motivo: consulta.motivo,
        diagnostico: consulta.diagnostico,
        tratamiento: consulta.tratamiento,
        estado: consulta.estado,
        observaciones: consulta.observaciones,
        mascota: {
          id_mascota: consulta.Mascota.id_mascota,
          nombre: consulta.Mascota.nombre,
          especie: consulta.Mascota.especie,
          raza: consulta.Mascota.raza,
        },
        dueno: duenoPrincipal
          ? {
              id_dueno: duenoPrincipal.Dueno.id_dueno,
              nombre_completo: duenoPrincipal.Dueno.nombre_completo,
              telefono: duenoPrincipal.Dueno.telefono,
              correo: duenoPrincipal.Dueno.correo,
            }
          : null,
        veterinario: {
          id_veterinario: consulta.Veterinario.id_veterinario,
          nombre_completo: consulta.Veterinario.nombre_completo,
          especialidad: consulta.Veterinario.especialidad,
          telefono: consulta.Veterinario.telefono,
        },
      };
    });

    return NextResponse.json({
      consultas: consultasFormateadas,
      total: consultasFormateadas.length,
    });
  } catch (error) {
    console.error("Error al obtener consultas:", error);
    return NextResponse.json(
      { error: "Error al obtener las consultas" },
      { status: 500 }
    );
  }
}
