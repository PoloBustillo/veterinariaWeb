"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Veterinario {
  id_veterinario: number;
  nombre_completo: string;
  especialidad: string | null;
}

interface Mascota {
  id_mascota: number;
  nombre: string;
  especie: string;
  raza: string;
  dueno: string;
}

interface Props {
  veterinarios: Veterinario[];
  mascotas: Mascota[];
}

export default function AgendarCitaForm({ veterinarios, mascotas }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    id_mascota: "",
    id_veterinario: "",
    fecha: "",
    hora: "",
    motivo: "",
    observaciones: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validar campos requeridos
      if (
        !formData.id_mascota ||
        !formData.id_veterinario ||
        !formData.fecha ||
        !formData.hora ||
        !formData.motivo
      ) {
        setError("Por favor, completa todos los campos requeridos");
        setLoading(false);
        return;
      }

      // Combinar fecha y hora
      const fechaHora = `${formData.fecha}T${formData.hora}:00`;

      const response = await fetch("/api/agendar-cita", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_mascota: parseInt(formData.id_mascota),
          id_veterinario: parseInt(formData.id_veterinario),
          fecha: fechaHora,
          motivo: formData.motivo,
          observaciones: formData.observaciones || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al agendar la cita");
      }

      setSuccess(true);
      // Resetear formulario
      setFormData({
        id_mascota: "",
        id_veterinario: "",
        fecha: "",
        hora: "",
        motivo: "",
        observaciones: "",
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al agendar la cita");
    } finally {
      setLoading(false);
    }
  };

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split("T")[0];

  // Generar horarios disponibles en intervalos de 45 minutos
  const generarHorarios = () => {
    const horarios = [];

    // Horarios de lunes a viernes: 8:00 AM - 8:00 PM (20:00)
    // Sábados: 9:00 AM - 6:00 PM (18:00)
    // Domingos: 10:00 AM - 2:00 PM (14:00)

    const horaInicio = 8; // 8:00 AM
    const horaFin = 20; // 8:00 PM

    for (let hora = horaInicio; hora < horaFin; hora++) {
      // Cada hora tiene dos slots: :00 y :45
      horarios.push(`${hora.toString().padStart(2, "0")}:00`);

      // Solo agregar :45 si no excede el horario de cierre
      if (hora < horaFin - 1 || (hora === horaFin - 1 && 45 < 60)) {
        horarios.push(`${hora.toString().padStart(2, "0")}:45`);
      }
    }

    return horarios;
  };

  const horariosDisponibles = generarHorarios();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mensaje de éxito */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-900 px-4 py-3 rounded">
          <p className="font-medium">✅ ¡Cita agendada exitosamente!</p>
          <p className="text-sm">Redirigiendo...</p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-900 px-4 py-3 rounded">
          <p className="font-medium">❌ {error}</p>
        </div>
      )}

      {/* Selección de Mascota */}
      <div>
        <label
          htmlFor="id_mascota"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Mascota <span className="text-red-600">*</span>
        </label>
        <select
          id="id_mascota"
          name="id_mascota"
          value={formData.id_mascota}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium"
        >
          <option value="" className="text-gray-500">
            -- Selecciona tu mascota --
          </option>
          {mascotas.map((mascota) => (
            <option
              key={mascota.id_mascota}
              value={mascota.id_mascota}
              className="text-gray-900"
            >
              {mascota.nombre} ({mascota.especie})
            </option>
          ))}
        </select>
      </div>

      {/* Selección de Veterinario */}
      <div>
        <label
          htmlFor="id_veterinario"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Veterinario <span className="text-red-600">*</span>
        </label>
        <select
          id="id_veterinario"
          name="id_veterinario"
          value={formData.id_veterinario}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium"
        >
          <option value="" className="text-gray-500">
            -- Selecciona un veterinario --
          </option>
          {veterinarios.map((vet) => (
            <option
              key={vet.id_veterinario}
              value={vet.id_veterinario}
              className="text-gray-900"
            >
              Dr(a). {vet.nombre_completo}
              {vet.especialidad && ` • ${vet.especialidad}`}
            </option>
          ))}
        </select>
      </div>

      {/* Fecha y Hora */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="fecha"
            className="block text-sm font-semibold text-gray-900 mb-2"
          >
            Fecha <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            min={today}
            required
            className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium"
          />
        </div>

        <div>
          <label
            htmlFor="hora"
            className="block text-sm font-semibold text-gray-900 mb-2"
          >
            Hora <span className="text-red-600">*</span>
          </label>
          <select
            id="hora"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium"
          >
            <option value="" className="text-gray-500">
              -- Selecciona un horario --
            </option>
            {horariosDisponibles.map((horario) => (
              <option key={horario} value={horario} className="text-gray-900">
                {horario}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            ⏱️ Cada consulta dura aproximadamente 45 minutos
          </p>
        </div>
      </div>

      {/* Motivo de la Consulta */}
      <div>
        <label
          htmlFor="motivo"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Motivo de la Consulta <span className="text-red-600">*</span>
        </label>
        <textarea
          id="motivo"
          name="motivo"
          value={formData.motivo}
          onChange={handleChange}
          required
          rows={3}
          placeholder="Ejemplo: Vacunación, revisión general, síntomas..."
          className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-base placeholder-gray-400"
        />
      </div>

      {/* Observaciones - Más compacto */}
      <div>
        <label
          htmlFor="observaciones"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Notas adicionales (opcional)
        </label>
        <input
          type="text"
          id="observaciones"
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          placeholder="Información extra relevante..."
          className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base placeholder-gray-400"
        />
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
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
              Agendando...
            </span>
          ) : (
            "📅 Agendar Cita"
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/")}
          disabled={loading}
          className="sm:w-auto px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
