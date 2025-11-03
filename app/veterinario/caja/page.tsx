import { auth } from "@/auth";
import { redirect } from "next/navigation";
import InternalNav from "@/app/components/InternalNav";
import GestionCajaForm from "./GestionCajaForm";

export default async function CajaPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "veterinario") {
    redirect("/");
  }

  // Solo administradores pueden acceder a la caja
  if (!session.user.isAdmin) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 via-blue-50 to-purple-50">
        <InternalNav
          userName={session.user.name || "Usuario"}
          userEmail={session.user.email || ""}
          userRole={session.user.role}
          isAdmin={session.user.isAdmin}
        />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
              <span className="text-6xl mb-4 block">🔒</span>
              <h2 className="text-2xl font-bold text-red-900 mb-4">
                Acceso Restringido
              </h2>
              <p className="text-red-700 mb-6">
                No tienes permisos para acceder al módulo de caja.
              </p>
              <p className="text-sm text-red-600">
                Solo los administradores tienen acceso a esta sección.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-blue-50 to-purple-50">
      <InternalNav
        userName={session.user.name || "Usuario"}
        userEmail={session.user.email || ""}
        userRole={session.user.role}
        isAdmin={session.user.isAdmin}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-linear-to-br from-green-500 to-emerald-600 p-4 rounded-xl shadow-lg">
                <span className="text-4xl">💰</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Gestión de Caja
                </h1>
                <p className="text-gray-600 mt-2">
                  Control de ingresos, egresos y movimientos financieros
                </p>
              </div>
            </div>
          </div>

          <GestionCajaForm />
        </div>
      </div>
    </div>
  );
}
