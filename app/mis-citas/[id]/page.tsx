import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import InternalNav from "@/app/components/InternalNav";
import CancelarConsultaForm from "./CancelarConsultaForm";

export default async function DetalleConsultaClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "dueno") {
    redirect("/login");
  }

  const { id } = await params;

  return (
    <>
      <InternalNav
        userName={session.user.name || "Usuario"}
        userEmail={session.user.email || ""}
        userRole={session.user.role || "dueno"}
        isAdmin={session.user.isAdmin}
      />
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <Link
              href="/mis-citas"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Volver a mis citas
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              📋 Detalle de Consulta
            </h1>

            <CancelarConsultaForm
              consultaId={id}
              userRole={session.user.role || "dueno"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
