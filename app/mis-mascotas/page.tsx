import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { prisma } from "@/lib/prisma";
import InternalNav from "@/app/components/InternalNav";

export default async function MisMascotasPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const isVeterinario = session.user.role === "veterinario";
  const userId = parseInt(session.user.id);

  // Obtener mascotas
  let mascotas;

  if (isVeterinario) {
    // Veterinarios ven todas las mascotas
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
  } else {
    // Clientes solo ven sus propias mascotas
    const relacionesMascotas = await prisma.relacion_Dueno_Mascota.findMany({
      where: {
        id_dueno: userId,
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

    mascotas = relacionesMascotas.map((relacion) => ({
      ...relacion.Mascota,
      Relacion_Dueno_Mascota: [relacion],
    }));
  }

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return "No especificada";
    return new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <InternalNav
        userName={session.user.name || "Usuario"}
        userEmail={session.user.email || ""}
        userRole={session.user.role || "dueno"}
        isAdmin={session.user.isAdmin}
      />
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isVeterinario ? "Todas las Mascotas" : "Mis Mascotas"}
              </h1>
              <p className="mt-2 text-gray-600">
                {isVeterinario
                  ? "Registro completo de mascotas en la clínica"
                  : "Administra la información de tus mascotas"}
              </p>
            </div>
            <Link
              href="/registrar-mascota"
              className={`flex items-center gap-2 px-6 py-3 ${
                isVeterinario
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg`}
            >
              <PlusCircleIcon className="w-5 h-5" />
              Registrar Mascota
            </Link>
          </div>

          {mascotas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🐾</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No hay mascotas registradas
                </h3>
                <p className="text-gray-600 mb-6">
                  {isVeterinario
                    ? "Comienza registrando la primera mascota de un cliente"
                    : "Registra tu primera mascota para poder agendar citas"}
                </p>
                <Link
                  href="/registrar-mascota"
                  className={`inline-flex items-center gap-2 px-6 py-3 ${
                    isVeterinario
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg`}
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  Registrar Primera Mascota
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mascotas.map((mascota: any) => {
                const dueno = mascota.Relacion_Dueno_Mascota?.[0]?.Dueno;
                return (
                  <div
                    key={mascota.id_mascota}
                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition"
                  >
                    {/* Header con emoji de mascota */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">
                          {mascota.especie === "Perro"
                            ? "🐕"
                            : mascota.especie === "Gato"
                            ? "🐈"
                            : mascota.especie === "Ave"
                            ? "🦜"
                            : mascota.especie === "Conejo"
                            ? "🐰"
                            : "🐾"}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {mascota.nombre}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {mascota.especie}
                            {mascota.raza && ` • ${mascota.raza}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Información de la mascota */}
                    <div className="space-y-2 mb-4">
                      {mascota.sexo && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Sexo:</span>{" "}
                          {mascota.sexo}
                        </p>
                      )}
                      {mascota.fecha_nacimiento && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Nacimiento:</span>{" "}
                          {formatFecha(mascota.fecha_nacimiento)}
                        </p>
                      )}
                      {mascota.color && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Color:</span>{" "}
                          {mascota.color}
                        </p>
                      )}
                      {mascota.senias_particulares && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Señas:</span>{" "}
                          {mascota.senias_particulares}
                        </p>
                      )}
                    </div>

                    {/* Información del dueño (solo para veterinarios) */}
                    {isVeterinario && dueno && (
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          DUEÑO
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {dueno.nombre_completo}
                        </p>
                        {dueno.telefono && (
                          <p className="text-sm text-gray-600">
                            📞 {dueno.telefono}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
