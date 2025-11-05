import { prisma } from "@/lib/prisma";
import AgendarCitaForm from "./AgendarCitaForm";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import InternalNav from "../components/InternalNav";

export default async function AgendarCitaPage() {
  const session = await auth();

  // Si no hay sesión, redirigir a login
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Obtener el ID del dueño desde la sesión
  const idDueno = parseInt(session.user.id);

  // Obtener veterinarios activos
  const veterinarios = await prisma.veterinario.findMany({
    where: {
      activo: true,
    },
    orderBy: {
      nombre_completo: "asc",
    },
  });

  // Obtener solo las mascotas del dueño autenticado
  const relacionesMascotas = await prisma.relacion_Dueno_Mascota.findMany({
    where: {
      id_dueno: idDueno,
    },
    include: {
      Mascota: true,
    },
  });

  // Transformar datos para el formulario (solo mascotas del usuario)
  const mascotasConDueno = relacionesMascotas.map((relacion: any) => {
    return {
      id_mascota: relacion.Mascota.id_mascota,
      nombre: relacion.Mascota.nombre,
      especie: relacion.Mascota.especie,
      raza: relacion.Mascota.raza || "N/A",
      dueno: session.user?.name || "Usuario",
    };
  });

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg
                className="h-8 w-8 text-blue-600"
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
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agendar Cita</h1>
              <p className="mt-1 text-gray-600">
                Completa el formulario para programar tu consulta
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {mascotasConDueno.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <svg
                className="h-8 w-8 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3 className="text-lg font-bold text-yellow-900">
                  No tienes mascotas registradas
                </h3>
                <p className="text-yellow-800 mt-1">
                  Para agendar una cita, primero debes registrar al menos una
                  mascota en tu cuenta.
                </p>
                <div className="mt-4">
                  <Link
                    href="/registrar-mascota"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Registrar mi Mascota
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            <AgendarCitaForm
              veterinarios={veterinarios}
              mascotas={mascotasConDueno}
            />
          </div>
        )}

        {/* Info Cards */}
        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-blue-900 text-lg">Horarios</h3>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>Lunes a Viernes:</strong> 8:00 AM - 8:00 PM
              <br />
              <strong>Sábados:</strong> 9:00 AM - 6:00 PM
              <br />
              <strong>Domingos:</strong> 10:00 AM - 2:00 PM
              <br />
              <span className="text-xs mt-1 block text-blue-700">
                * Intervalos de 45 minutos
              </span>
            </p>
          </div>

          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-green-900 text-lg">Duración</h3>
            </div>
            <p className="text-sm text-green-800 leading-relaxed">
              <strong>Duración:</strong> 45 minutos
              <br />
              <strong>Horarios:</strong> Cada 45 minutos
              <br />
              <strong>Ejemplos:</strong> 10:00, 10:45, 11:00...
              <br />
              <span className="text-xs mt-1 block text-green-700">
                * Sistema optimizado sin tiempos muertos
              </span>
            </p>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-500 p-2 rounded-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-purple-900 text-lg">Contacto</h3>
            </div>
            <p className="text-sm text-purple-800 leading-relaxed">
              <strong>Teléfono:</strong> (555) 123-4567
              <br />
              <strong>WhatsApp:</strong> (555) 765-4321
              <br />
              <strong>Email:</strong> info@dalton.vet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
