import Link from "next/link";
import Image from "next/image";
import UserMenu from "./UserMenu";

interface InternalNavProps {
  userName: string;
  userEmail: string;
}

export default function InternalNav({ userName, userEmail }: InternalNavProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition">
            <Image
              src="/icono-clinica.png"
              alt="Clínica Veterinaria Dalton"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-gray-900">
              Clínica Dalton
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition font-medium text-sm"
            >
              Inicio
            </Link>
            <Link
              href="/mis-citas"
              className="text-gray-700 hover:text-blue-600 transition font-medium text-sm"
            >
              Mis Citas
            </Link>
            <Link
              href="/agendar-cita"
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition font-medium text-sm shadow-md hover:shadow-lg"
            >
              Agendar Cita
            </Link>
            <UserMenu userName={userName} userEmail={userEmail} />
          </div>
        </div>
      </div>
    </nav>
  );
}
