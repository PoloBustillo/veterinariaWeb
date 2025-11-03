import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import InternalNav from "@/app/components/InternalNav";
import GestionarConsultaForm from "./GestionarConsultaForm";

export default async function DetalleConsultaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "veterinario") {
    redirect("/login");
  }

  const { id } = await params;

  return (
    <>
      <InternalNav
        userName={session.user.name || "Veterinario"}
        userEmail={session.user.email || ""}
        userRole={session.user.role || "veterinario"}
        isAdmin={session.user.isAdmin}
      />
      <div className="min-h-screen bg-linear-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <Link
              href="/veterinario/consultas"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Volver a consultas
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              📋 Gestionar Consulta
            </h1>

            <GestionarConsultaForm
              consultaId={id}
              userRole={session.user.role || "veterinario"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
