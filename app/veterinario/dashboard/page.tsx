import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import InternalNav from "@/app/components/InternalNav";
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default async function DashboardVeterinarioPage() {
  const session = await auth();

  // Verificar que el usuario esté autenticado y sea veterinario
  if (!session?.user?.id || session.user.role !== "veterinario") {
    redirect("/login");
  }

  const idVeterinario = parseInt(session.user.id);

  // Obtener datos del veterinario
  const veterinario = await prisma.veterinario.findUnique({
    where: { id_veterinario: idVeterinario },
  });

  // Obtener estadísticas
  const [
    totalConsultas,
    consultasHoy,
    consultasPendientes,
    consultasFinalizadas,
  ] = await Promise.all([
    // Total de consultas del veterinario
    prisma.consulta.count({
      where: { id_veterinario: idVeterinario },
    }),
    // Consultas de hoy
    prisma.consulta.count({
      where: {
        id_veterinario: idVeterinario,
        fecha: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
    // Consultas pendientes
    prisma.consulta.count({
      where: {
        id_veterinario: idVeterinario,
        estado: "programada",
      },
    }),
    // Consultas finalizadas
    prisma.consulta.count({
      where: {
        id_veterinario: idVeterinario,
        estado: "finalizada",
      },
    }),
  ]);

  // Próximas consultas
  const proximasConsultas = await prisma.consulta.findMany({
    where: {
      id_veterinario: idVeterinario,
      estado: "programada",
      fecha: {
        gte: new Date(),
      },
    },
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
    },
    orderBy: {
      fecha: "asc",
    },
    take: 10,
  });

  const formatFecha = (fecha: Date | null) => {
    if (!fecha) return "Fecha no disponible";
    return new Date(fecha).toLocaleString("es-MX", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <InternalNav
        userName={session.user.name || "Veterinario"}
        userEmail={session.user.email || ""}
        userRole={session.user.role || "veterinario"}
      />
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Veterinario
              </h1>
              <p className="mt-1 text-gray-600">
                Bienvenido, {veterinario?.nombre_completo}
              </p>
              {veterinario?.especialidad && (
                <p className="text-sm text-blue-600 font-medium">
                  Especialidad: {veterinario.especialidad}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Consultas */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Consultas
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {totalConsultas}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <CalendarIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Consultas Hoy */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Hoy</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {consultasHoy}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <ClockIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Pendientes */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Pendientes
                  </p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {consultasPendientes}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <ClockIcon className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Finalizadas */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Finalizadas
                  </p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {consultasFinalizadas}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Próximas Consultas */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Próximas Consultas
              </h2>
              <Link
                href="/veterinario/consultas"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Ver todas →
              </Link>
            </div>

            {proximasConsultas.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No hay consultas programadas
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Las consultas aparecerán aquí cuando sean agendadas.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {proximasConsultas.map((consulta) => {
                  const dueno =
                    consulta.mascota.Relacion_Dueno_Mascota[0]?.Dueno;
                  return (
                    <div
                      key={consulta.id_consulta}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900">
                              {consulta.mascota.nombre}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {consulta.mascota.especie}
                              {consulta.mascota.raza &&
                                ` • ${consulta.mascota.raza}`}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Dueño: {dueno?.nombre_completo || "No especificado"}
                          </p>
                          {consulta.motivo && (
                            <p className="text-sm text-gray-700 mt-2">
                              <span className="font-medium">Motivo:</span>{" "}
                              {consulta.motivo}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600">
                            {formatFecha(consulta.fecha)}
                          </p>
                          <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Programada
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
