import { auth } from "@/auth";
import { redirect } from "next/navigation";
import InternalNav from "@/app/components/InternalNav";

export default async function HistorialVentasPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  if (session.user.role !== "veterinario") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <InternalNav
        userName={session.user.name || "Usuario"}
        userEmail={session.user.email || ""}
        userRole={session.user.role}
        isAdmin={session.user.isAdmin}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              📊 Historial de Ventas
            </h1>
            <p className="text-gray-600 mt-2">
              Consulta el historial de ventas de productos
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-center py-8">
              🚧 Vista de historial en desarrollo
            </p>
            <p className="text-sm text-gray-500 text-center">
              Por ahora, las ventas se pueden ver desde el historial de caja
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
