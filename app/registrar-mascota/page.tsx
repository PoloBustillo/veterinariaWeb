import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RegistrarMascotaForm from "./RegistrarMascotaForm";
import InternalNav from "../components/InternalNav";

export default async function RegistrarMascotaPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const isVeterinario = session.user.role === "veterinario";

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
            <div
              className={`${
                isVeterinario ? "bg-green-100" : "bg-blue-100"
              } p-3 rounded-lg`}
            >
              <svg
                className={`h-8 w-8 ${
                  isVeterinario ? "text-green-600" : "text-blue-600"
                }`}
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
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Registrar Nueva Mascota
              </h1>
              <p className="text-gray-600 mt-1">
                {isVeterinario
                  ? "Completa la información de la mascota y asígnala a un cliente"
                  : "Completa la información de tu mascota"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <RegistrarMascotaForm userRole={session.user.role || "dueno"} />
        </div>
      </div>
    </div>
  );
}
