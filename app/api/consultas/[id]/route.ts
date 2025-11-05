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
        Pago: true,
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
      const esSuMascota = consulta.Mascota.Relacion_Dueno_Mascota.some(
        (relacion: any) => relacion.id_dueno === userId
      );
      if (!esSuMascota) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }
    }

    return NextResponse.json({ consulta });
  } catch (error) {
    console.error("Error al obtener consulta:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
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
        Mascota: {
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
      const {
        estado,
        diagnostico,
        tratamiento,
        observaciones,
        insumos,
        servicios,
      } = body;

      // Validar transiciones de estado
      if (estado) {
        if (
          consultaActual.estado === "programada" &&
          estado !== "en_proceso" &&
          estado !== "programada"
        ) {
          return NextResponse.json(
            { error: "Solo puedes iniciar una consulta programada" },
            { status: 400 }
          );
        }
        if (
          consultaActual.estado === "finalizada" ||
          consultaActual.estado === "cancelada"
        ) {
          return NextResponse.json(
            {
              error: "No puedes modificar una consulta finalizada o cancelada",
            },
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

      // Agregar insumos si se proporcionan (usar transacción)
      if (insumos && Array.isArray(insumos) && insumos.length > 0) {
        await prisma.$transaction(async (tx: any) => {
          // Primero, obtener los insumos actuales de la consulta
          const insumosActuales = await tx.consulta_Insumo.findMany({
            where: { id_consulta: idConsulta },
          });

          // Devolver las cantidades al inventario antes de eliminar
          for (const insumoActual of insumosActuales) {
            await tx.insumo.update({
              where: { id_insumo: insumoActual.id_insumo },
              data: {
                cantidad_disponible: {
                  increment: insumoActual.cantidad,
                },
              },
            });
          }

          // Eliminar todos los insumos actuales de la consulta
          await tx.consulta_Insumo.deleteMany({
            where: { id_consulta: idConsulta },
          });

          // Ahora agregar los nuevos insumos
          for (const insumo of insumos) {
            const { id_insumo, cantidad } = insumo;

            // Verificar disponibilidad
            const insumoData = await tx.insumo.findUnique({
              where: { id_insumo },
            });

            if (
              !insumoData ||
              (insumoData.cantidad_disponible || 0) < cantidad
            ) {
              throw new Error(
                `Insumo ${
                  insumoData?.nombre || id_insumo
                } no tiene suficiente cantidad disponible`
              );
            }

            // Agregar insumo a la consulta
            await tx.consulta_Insumo.create({
              data: {
                id_consulta: idConsulta,
                id_insumo,
                cantidad,
              },
            });

            // Reducir cantidad disponible
            await tx.insumo.update({
              where: { id_insumo },
              data: {
                cantidad_disponible: {
                  decrement: cantidad,
                },
              },
            });
          }
        });
      }

      // Agregar servicios si se proporcionan (usar transacción)
      if (servicios && Array.isArray(servicios) && servicios.length > 0) {
        await prisma.$transaction(async (tx: any) => {
          // Eliminar todos los servicios actuales de la consulta
          await tx.consulta_Servicio.deleteMany({
            where: { id_consulta: idConsulta },
          });

          // Ahora agregar los nuevos servicios
          for (const servicio of servicios) {
            const { id_servicio, cantidad = 1 } = servicio;

            const servicioData = await tx.servicio.findUnique({
              where: { id_servicio },
            });

            if (!servicioData) {
              throw new Error(`Servicio ${id_servicio} no encontrado`);
            }

            // Calcular subtotal
            const subtotal = servicioData.costo.toNumber() * cantidad;

            // Agregar servicio a la consulta
            await tx.consulta_Servicio.create({
              data: {
                id_consulta: idConsulta,
                id_servicio,
                cantidad,
                subtotal,
              },
            });
          }
        });
      }

      // Si se finaliza la consulta, crear pago automático y registrar en caja si está abierta
      if (estado === "finalizada") {
        // Calcular el total de la consulta
        const consultaConDetalles = await prisma.consulta.findUnique({
          where: { id_consulta: idConsulta },
          include: {
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
          },
        });

        if (consultaConDetalles) {
          // Calcular total de servicios
          const totalServicios = consultaConDetalles.Consulta_Servicio.reduce(
            (sum: number, cs: any) => sum + Number(cs.subtotal),
            0
          );

          // Calcular total de insumos (usando costo unitario)
          const totalInsumos = consultaConDetalles.Consulta_Insumo.reduce(
            (sum: number, ci: any) =>
              sum + (Number(ci.Insumo.costo_unitario) || 0) * ci.cantidad,
            0
          );

          const montoTotal = totalServicios + totalInsumos;

          // Solo crear pago si hay monto a cobrar
          if (montoTotal > 0) {
            // Verificar si ya existe un pago para esta consulta
            const pagoExistente = await prisma.pago.findFirst({
              where: { id_consulta: idConsulta },
            });

            if (!pagoExistente) {
              // Crear el pago con estado pendiente
              const pago = await prisma.pago.create({
                data: {
                  id_consulta: idConsulta,
                  fecha: new Date(),
                  monto: montoTotal,
                  metodo: "efectivo", // Por defecto
                  estado: "pendiente",
                },
              });

              // Buscar caja abierta
              const cajaAbierta = await prisma.caja.findFirst({
                where: {
                  fecha_cierre: null,
                },
                orderBy: {
                  fecha_apertura: "desc",
                },
              });

              // Si hay caja abierta, crear movimientos detallados y cambiar estado a pagado
              if (cajaAbierta) {
                await prisma.$transaction(async (tx: any) => {
                  // Crear un movimiento por cada servicio
                  for (const cs of consultaConDetalles.Consulta_Servicio) {
                    await tx.caja_Movimiento.create({
                      data: {
                        id_caja: cajaAbierta.id_caja,
                        fecha: new Date(),
                        concepto: `Consulta #${idConsulta} - Servicio: ${cs.Servicio.nombre}`,
                        monto: cs.subtotal,
                        tipo: "Ingreso",
                      },
                    });
                  }

                  // Crear un movimiento por cada insumo
                  for (const ci of consultaConDetalles.Consulta_Insumo) {
                    const montoInsumo =
                      (Number(ci.Insumo.costo_unitario) || 0) * ci.cantidad;
                    await tx.caja_Movimiento.create({
                      data: {
                        id_caja: cajaAbierta.id_caja,
                        fecha: new Date(),
                        concepto: `Consulta #${idConsulta} - Insumo: ${ci.Insumo.nombre} (${ci.cantidad})`,
                        monto: montoInsumo,
                        tipo: "Ingreso",
                      },
                    });
                  }

                  // Actualizar pago a pagado y asociarlo a la caja
                  await tx.pago.update({
                    where: { id_pago: pago.id_pago },
                    data: {
                      estado: "pagado",
                      id_caja: cajaAbierta.id_caja, // ✅ Asociar a la caja actual
                    },
                  });
                });
              }
            }
          }
        }
      }

      // Recargar consulta con todas las relaciones para devolverla completa
      const consultaCompleta = await prisma.consulta.findUnique({
        where: { id_consulta: idConsulta },
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
          Pago: true,
        },
      });
      return NextResponse.json({
        consulta: consultaCompleta,
        message: "Consulta actualizada exitosamente",
      });
    } else if (userRole === "dueno") {
      // Cliente solo puede ver consultas de sus mascotas
      const esSuMascota = consultaActual.Mascota.Relacion_Dueno_Mascota.some(
        (relacion: any) => relacion.id_dueno === userId
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
        message: "Consulta cancelada exitosamente",
      });
    }

    return NextResponse.json({ error: "Rol no válido" }, { status: 403 });
  } catch (error) {
    console.error("Error al actualizar consulta:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: "Error al actualizar consulta", details: errorMessage },
      { status: 500 }
    );
  }
}
