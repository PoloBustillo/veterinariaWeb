import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import InternalNav from "../components/InternalNav";

export default async function MisCitasPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const idDueno = parseInt(session.user.id);

  // Obtener las mascotas del dueño
  const relacionesMascotas = await prisma.relacion_Dueno_Mascota.findMany({
    where: { id_dueno: idDueno },
    select: { id_mascota: true },
  });

  const idsMascotas = relacionesMascotas.map((rel: any) => rel.id_mascota);

  // Obtener las consultas de las mascotas del dueño
  const consultas = await prisma.consulta.findMany({
    where: {
      id_mascota: {
        in: idsMascotas,
      },
    },
    include: {
      Mascota: true,
      Veterinario: true,
    },
    orderBy: {
      fecha: "desc",
    },
  });

  const getEstadoBadge = (estado: string) => {
    const estados = {
      programada: "bg-blue-100 text-blue-800",
      en_proceso: "bg-yellow-100 text-yellow-800",
      finalizada: "bg-green-100 text-green-800",
      cancelada: "bg-red-100 text-red-800",
    };
    return (
      estados[estado as keyof typeof estados] || "bg-gray-100 text-gray-800"
    );
  };

  const formatFecha = (fecha: Date | null) => {
    if (!fecha) return "Fecha no disponible";
    return new Date(fecha).toLocaleString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Navigation */}
      <InternalNav
        userName={session.user?.name || "Usuario"}
        userEmail={session.user?.email || ""}
        userRole={session.user?.role || "dueno"}
        isAdmin={session.user?.isAdmin}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Citas</h1>
              <p className="mt-1 text-gray-600">
                Historial de consultas veterinarias
              </p>
            </div>
            <Link
              href="/agendar-cita"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md hover:shadow-lg"
            >
              + Nueva Cita
            </Link>
          </div>
        </div>
      </div>

      {/* Lista de Citas */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {consultas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes citas registradas
            </h3>
            <p className="text-gray-600 mb-6">
              Agenda tu primera consulta veterinaria para tu mascota
            </p>
            <Link
              href="/agendar-cita"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Agendar Primera Cita
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {consultas.map((consulta: any) => (
              <Link
                key={consulta.id_consulta}
                href={`/mis-citas/${consulta.id_consulta}`}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:border-blue-300 transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        🐾 {consulta.Mascota.nombre}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getEstadoBadge(
                          consulta.estado || "programada"
                        )}`}
                      >
                        {consulta.estado || "Programada"}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {consulta.Mascota.especie} •{" "}
                      {consulta.Mascota.raza || "Sin raza"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      ID: #{consulta.id_consulta}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      👆 Click para ver detalles
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      📅 Fecha y Hora
                    </p>
                    <p className="font-semibold text-gray-900">
                      {formatFecha(consulta.fecha)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">👨‍⚕️ Veterinario</p>
                    <p className="font-semibold text-gray-900">
                      Dr(a). {consulta.Veterinario.nombre_completo}
                    </p>
                    {consulta.Veterinario.especialidad && (
                      <p className="text-sm text-gray-600">
                        {consulta.Veterinario.especialidad}
                      </p>
                    )}
                  </div>
                </div>

                {consulta.motivo && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">🔍 Motivo</p>
                    <p className="text-gray-900">{consulta.motivo}</p>
                  </div>
                )}

                {consulta.diagnostico && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">📋 Diagnóstico</p>
                    <p className="text-gray-900">{consulta.diagnostico}</p>
                  </div>
                )}

                {consulta.tratamiento && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">💊 Tratamiento</p>
                    <p className="text-gray-900">{consulta.tratamiento}</p>
                  </div>
                )}

                {consulta.observaciones && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      📝 Observaciones
                    </p>
                    <p className="text-gray-600 text-sm">
                      {consulta.observaciones}
                    </p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
