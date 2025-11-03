import { auth } from "@/auth";
import { redirect } from "next/navigation";
import InternalNav from "@/app/components/InternalNav";
import VentaProductosForm from "./VentaProductosForm";

export default async function VentaProductosPage() {
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
              🛒 Venta de Productos
            </h1>
            <p className="text-gray-600 mt-2">
              Registra ventas de productos y medicamentos
            </p>
          </div>

          <VentaProductosForm />
        </div>
      </div>
    </main>
  );
}
