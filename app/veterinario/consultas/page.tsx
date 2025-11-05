import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import InternalNav from "@/app/components/InternalNav";

export default async function ConsultasVeterinarioPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "veterinario") {
    redirect("/login");
  }

  const idVeterinario = parseInt(session.user.id);

  // Obtener todas las consultas del veterinario
  const consultas = await prisma.consulta.findMany({
    where: {
      id_veterinario: idVeterinario,
    },
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
    },
    orderBy: {
      fecha: "desc",
    },
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

  const getEstadoBadge = (estado: string | null) => {
    switch (estado) {
      case "programada":
        return "bg-yellow-100 text-yellow-800";
      case "finalizada":
        return "bg-green-100 text-green-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <InternalNav
        userName={session.user.name || "Veterinario"}
        userEmail={session.user.email || ""}
        userRole={session.user.role || "veterinario"}
        isAdmin={session.user.isAdmin}
      />
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Mis Consultas
            </h1>

            {consultas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No tienes consultas registradas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {consultas.map((consulta: any) => {
                  const dueno =
                    consulta.Mascota.Relacion_Dueno_Mascota[0]?.Dueno;
                  return (
                    <Link
                      key={consulta.id_consulta}
                      href={`/veterinario/consultas/${consulta.id_consulta}`}
                      className="block border border-gray-200 rounded-lg p-4 hover:border-green-400 hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              🐾 {consulta.Mascota.nombre}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {consulta.Mascota.especie}
                              {consulta.Mascota.raza &&
                                ` • ${consulta.Mascota.raza}`}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600">
                            <span className="font-medium">👤 Dueño:</span>{" "}
                            {dueno?.nombre_completo || "No especificado"}
                          </p>

                          {dueno?.telefono && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">📞 Teléfono:</span>{" "}
                              {dueno.telefono}
                            </p>
                          )}

                          {consulta.motivo && (
                            <p className="text-sm text-gray-700 mt-2">
                              <span className="font-medium">💬 Motivo:</span>{" "}
                              {consulta.motivo}
                            </p>
                          )}

                          {consulta.diagnostico && (
                            <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                              <span className="font-medium">
                                🩺 Diagnóstico:
                              </span>{" "}
                              {consulta.diagnostico}
                            </p>
                          )}
                        </div>

                        <div className="text-right ml-4">
                          <p className="text-sm font-medium text-green-600 mb-2">
                            📅 {formatFecha(consulta.fecha)}
                          </p>
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getEstadoBadge(
                              consulta.estado
                            )}`}
                          >
                            {consulta.estado || "Sin estado"}
                          </span>
                          <p className="text-xs text-gray-500 mt-2">
                            👆 Click para gestionar
                          </p>
                        </div>
                      </div>
                    </Link>
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
