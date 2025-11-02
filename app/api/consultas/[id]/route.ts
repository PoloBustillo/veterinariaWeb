import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const idConsulta = parseInt(id);
    const userRole = session.user.role;
    const userId = parseInt(session.user.id);

    // Obtener consulta con todas las relaciones
    const consulta = await prisma.consulta.findUnique({
      where: { id_consulta: idConsulta },
      include: {
        mascota: {
          include: {
            Relacion_Dueno_Mascota: {
              include: {
                Dueno: true,
              },
            },
          },
        },
        veterinario: true,
        Consulta_Insumo: {
          include: {
            Insumo: true,
          },
        },
        Consulta_Servicio: {
          include: {
            Servicio: true,
          },
        },
        pagos: true,
      },
    });

    if (!consulta) {
      return NextResponse.json(
        { error: "Consulta no encontrada" },
        { status: 404 }
      );
    }

    // Verificar permisos
    if (userRole === "veterinario") {
      // Veterinario solo puede ver sus propias consultas
      if (consulta.id_veterinario !== userId) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }
    } else if (userRole === "dueno") {
      // Cliente solo puede ver consultas de sus mascotas
      const esSuMascota = consulta.mascota.Relacion_Dueno_Mascota.some(
        (relacion) => relacion.id_dueno === userId
      );
      if (!esSuMascota) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }
    }

    return NextResponse.json({ consulta });
  } catch (error) {
    console.error("Error al obtener consulta:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: "Error al obtener consulta", details: errorMessage },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar consulta
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const idConsulta = parseInt(id);
    const userRole = session.user.role;
    const userId = parseInt(session.user.id);
    const body = await request.json();

    // Obtener consulta actual
    const consultaActual = await prisma.consulta.findUnique({
      where: { id_consulta: idConsulta },
      include: {
        mascota: {
          include: {
            Relacion_Dueno_Mascota: true,
          },
        },
      },
    });

    if (!consultaActual) {
      return NextResponse.json(
        { error: "Consulta no encontrada" },
        { status: 404 }
      );
    }

    // Verificar permisos según el rol
    if (userRole === "veterinario") {
      // Veterinario solo puede actualizar sus propias consultas
      if (consultaActual.id_veterinario !== userId) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }

      // Veterinario NO puede cancelar consultas
      if (body.estado === "cancelada") {
        return NextResponse.json(
          { error: "Los veterinarios no pueden cancelar consultas" },
          { status: 403 }
        );
      }

      // Veterinario puede: iniciar (en_proceso), finalizar, agregar diagnóstico, tratamiento, observaciones
      const { estado, diagnostico, tratamiento, observaciones, insumos, servicios } = body;

      // Validar transiciones de estado
      if (estado) {
        if (consultaActual.estado === "programada" && estado !== "en_proceso" && estado !== "programada") {
          return NextResponse.json(
            { error: "Solo puedes iniciar una consulta programada" },
            { status: 400 }
          );
        }
        if (consultaActual.estado === "finalizada" || consultaActual.estado === "cancelada") {
          return NextResponse.json(
            { error: "No puedes modificar una consulta finalizada o cancelada" },
            { status: 400 }
          );
        }
      }

      // Actualizar consulta
      const consulta = await prisma.consulta.update({
        where: { id_consulta: idConsulta },
        data: {
          ...(estado && { estado }),
          ...(diagnostico !== undefined && { diagnostico }),
          ...(tratamiento !== undefined && { tratamiento }),
          ...(observaciones !== undefined && { observaciones }),
        },
      });

      // Agregar insumos si se proporcionan
      if (insumos && Array.isArray(insumos)) {
        for (const insumo of insumos) {
          const { id_insumo, cantidad } = insumo;
          
          // Verificar disponibilidad
          const insumoData = await prisma.insumo.findUnique({
            where: { id_insumo },
          });

          if (!insumoData || (insumoData.cantidad_disponible || 0) < cantidad) {
            return NextResponse.json(
              { error: `Insumo ${insumoData?.nombre || id_insumo} no tiene suficiente cantidad disponible` },
              { status: 400 }
            );
          }

          // Agregar insumo a la consulta
          await prisma.consulta_Insumo.create({
            data: {
              id_consulta: idConsulta,
              id_insumo,
              cantidad,
            },
          });

          // Reducir cantidad disponible
          await prisma.insumo.update({
            where: { id_insumo },
            data: {
              cantidad_disponible: {
                decrement: cantidad,
              },
            },
          });
        }
      }

      // Agregar servicios si se proporcionan
      if (servicios && Array.isArray(servicios)) {
        for (const servicio of servicios) {
          const { id_servicio, cantidad = 1 } = servicio;
          
          const servicioData = await prisma.servicio.findUnique({
            where: { id_servicio },
          });

          if (!servicioData) {
            return NextResponse.json(
              { error: `Servicio ${id_servicio} no encontrado` },
              { status: 400 }
            );
          }

          // Calcular subtotal
          const subtotal = servicioData.costo.toNumber() * cantidad;

          // Agregar servicio a la consulta
          await prisma.consulta_Servicio.create({
            data: {
              id_consulta: idConsulta,
              id_servicio,
              cantidad,
              subtotal,
            },
          });
        }
      }

      return NextResponse.json({ 
        consulta,
        message: "Consulta actualizada exitosamente"
      });

    } else if (userRole === "dueno") {
      // Cliente solo puede ver consultas de sus mascotas
      const esSuMascota = consultaActual.mascota.Relacion_Dueno_Mascota.some(
        (relacion) => relacion.id_dueno === userId
      );
      if (!esSuMascota) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }

      // Cliente solo puede cancelar si está programada
      const { estado } = body;
      
      if (estado !== "cancelada") {
        return NextResponse.json(
          { error: "Los clientes solo pueden cancelar consultas" },
          { status: 403 }
        );
      }

      if (consultaActual.estado !== "programada") {
        return NextResponse.json(
          { error: "Solo puedes cancelar consultas programadas" },
          { status: 400 }
        );
      }

      // Verificar que la consulta sea en el futuro (al menos 2 horas de anticipación)
      if (consultaActual.fecha) {
        const fechaConsulta = new Date(consultaActual.fecha);
        const ahora = new Date();
        const dosHorasEnMs = 2 * 60 * 60 * 1000;
        
        if (fechaConsulta.getTime() - ahora.getTime() < dosHorasEnMs) {
          return NextResponse.json(
            { error: "Debes cancelar con al menos 2 horas de anticipación" },
            { status: 400 }
          );
        }
      }

      // Cancelar consulta
      const consulta = await prisma.consulta.update({
        where: { id_consulta: idConsulta },
        data: {
          estado: "cancelada",
        },
      });

      return NextResponse.json({ 
        consulta,
        message: "Consulta cancelada exitosamente"
      });
    }

    return NextResponse.json({ error: "Rol no válido" }, { status: 403 });

  } catch (error) {
    console.error("Error al actualizar consulta:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: "Error al actualizar consulta", details: errorMessage },
      { status: 500 }
    );
  }
}
