"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      // Redirigir al home
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/icono-clinica.png"
                alt="Clínica Veterinaria Dalton"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-2xl font-bold text-gray-900">
                Clínica Dalton
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition font-medium"
              >
                Inicio
              </Link>
              <Link
                href="/registro"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido del Login */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Logo y Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h1>
            <p className="mt-2 text-gray-600">Accede a tu cuenta</p>
          </div>

          {/* Formulario de Login */}
          <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-900 px-4 py-3 rounded">
                  <p className="font-medium">❌ {error}</p>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  placeholder="••••••"
                  className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg shadow-lg"
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/registro"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
