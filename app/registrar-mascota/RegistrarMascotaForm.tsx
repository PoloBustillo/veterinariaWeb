"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Cliente {
  id_dueno: number;
  nombre_completo: string;
  correo: string | null;
  telefono: string | null;
}

interface RegistrarMascotaFormProps {
  userRole: string;
}

export default function RegistrarMascotaForm({
  userRole,
}: RegistrarMascotaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    especie: "",
    raza: "",
    fecha_nacimiento: "",
    sexo: "",
    color: "",
    senias_particulares: "",
    id_dueno: "",
  });

  // Cargar clientes si es veterinario
  useEffect(() => {
    if (userRole === "veterinario") {
      const fetchClientes = async () => {
        setLoadingClientes(true);
        try {
          const response = await fetch("/api/clientes");
          const data = await response.json();
          if (response.ok) {
            setClientes(data.clientes);
          } else {
            setError(data.error || "Error al cargar clientes");
          }
        } catch (err) {
          setError("Error al cargar la lista de clientes");
        } finally {
          setLoadingClientes(false);
        }
      };
      fetchClientes();
    }
  }, [userRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/mascotas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Mostrar mensaje de éxito con animación
        const successMessage = document.createElement("div");
        successMessage.className =
          "fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-in slide-in-from-right";
        successMessage.innerHTML = `
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="font-semibold">¡Mascota registrada exitosamente!</span>
          </div>
        `;
        document.body.appendChild(successMessage);

        setTimeout(() => {
          successMessage.remove();
          router.push(
            userRole === "veterinario" ? "/mis-mascotas" : "/mis-mascotas"
          );
          router.refresh();
        }, 2000);
      } else {
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : data.error || "Error al registrar la mascota";
        setError(errorMsg);
        console.error("Error del servidor:", data);
      }
    } catch (err) {
      console.error("Error de red:", err);
      setError(
        "Error al conectar con el servidor. Por favor intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-4 rounded-lg flex items-start gap-3">
          <svg
            className="w-5 h-5 text-red-600 mt-0.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-semibold">Error al registrar mascota</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Selector de Cliente (solo para veterinarios) */}
      {userRole === "veterinario" && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <label
            htmlFor="id_dueno"
            className="block text-sm font-bold text-green-900 mb-2"
          >
            👤 Cliente (Dueño) *
          </label>
          {loadingClientes ? (
            <div className="flex items-center gap-2 text-green-700">
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Cargando clientes...</span>
            </div>
          ) : (
            <>
              <select
                id="id_dueno"
                name="id_dueno"
                required
                value={formData.id_dueno}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 font-medium"
              >
                <option value="">🔍 Selecciona un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id_dueno} value={cliente.id_dueno}>
                    {cliente.nombre_completo}
                    {cliente.telefono && ` - 📞 ${cliente.telefono}`}
                  </option>
                ))}
              </select>
              <p className="text-xs text-green-700 mt-2">
                💡 La mascota quedará registrada a nombre de este cliente
              </p>
            </>
          )}
        </div>
      )}

      {/* Nombre */}
      <div>
        <label
          htmlFor="nombre"
          className="block text-sm font-bold text-gray-900 mb-2"
        >
          🐾 Nombre de la Mascota *
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          required
          value={formData.nombre}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 font-medium transition"
          placeholder="Ej: Max, Luna, Bobby"
        />
      </div>

      {/* Especie */}
      <div>
        <label
          htmlFor="especie"
          className="block text-sm font-bold text-gray-900 mb-2"
        >
          🦴 Especie *
        </label>
        <select
          id="especie"
          name="especie"
          required
          value={formData.especie}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
        >
          <option value="">Selecciona una especie</option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
          <option value="Ave">Ave</option>
          <option value="Conejo">Conejo</option>
          <option value="Hámster">Hámster</option>
          <option value="Reptil">Reptil</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      {/* Raza */}
      <div>
        <label
          htmlFor="raza"
          className="block text-sm font-bold text-gray-900 mb-2"
        >
          🏷️ Raza (opcional)
        </label>
        <input
          type="text"
          id="raza"
          name="raza"
          value={formData.raza}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 font-medium transition"
          placeholder="Ej: Labrador, Siamés, Mestizo"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fecha de Nacimiento */}
        <div>
          <label
            htmlFor="fecha_nacimiento"
            className="block text-sm font-bold text-gray-900 mb-2"
          >
            🎂 Fecha de Nacimiento
          </label>
          <input
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium transition"
          />
        </div>

        {/* Sexo */}
        <div>
          <label
            htmlFor="sexo"
            className="block text-sm font-bold text-gray-900 mb-2"
          >
            ⚥ Sexo
          </label>
          <select
            id="sexo"
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium transition"
          >
            <option value="">Selecciona el sexo</option>
            <option value="Macho">♂ Macho</option>
            <option value="Hembra">♀ Hembra</option>
          </select>
        </div>
      </div>

      {/* Color */}
      <div>
        <label
          htmlFor="color"
          className="block text-sm font-bold text-gray-900 mb-2"
        >
          🎨 Color
        </label>
        <input
          type="text"
          id="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 font-medium transition"
          placeholder="Ej: Negro, Blanco, Atigrado"
        />
      </div>

      {/* Señas Particulares */}
      <div>
        <label
          htmlFor="senias_particulares"
          className="block text-sm font-bold text-gray-900 mb-2"
        >
          📝 Señas Particulares
        </label>
        <textarea
          id="senias_particulares"
          name="senias_particulares"
          rows={3}
          value={formData.senias_particulares}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 font-medium transition resize-none"
          placeholder="Ej: Mancha blanca en el pecho, cicatriz en la pata izquierda"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 px-6 py-3 ${
            userRole === "veterinario"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Registrando...
            </>
          ) : (
            <>
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Registrar Mascota
            </>
          )}
        </button>
      </div>
    </form>
  );
}
