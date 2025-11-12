"use client";

import { useState } from "react";

interface EditarMascotaFormProps {
  mascota: any;
  onClose: () => void;
  onUpdate: (mascotaActualizada: any) => void;
}

export default function EditarMascotaForm({
  mascota,
  onClose,
  onUpdate,
}: EditarMascotaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: mascota.nombre || "",
    especie: mascota.especie || "",
    raza: mascota.raza || "",
    fecha_nacimiento: mascota.fecha_nacimiento
      ? new Date(mascota.fecha_nacimiento).toISOString().split("T")[0]
      : "",
    sexo: mascota.sexo || "",
    color: mascota.color || "",
    senias_particulares: mascota.senias_particulares || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/mascotas", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_mascota: mascota.id_mascota,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error al actualizar la mascota");
        setIsSubmitting(false);
        return;
      }

      onUpdate(data.mascota);
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar la mascota");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-300">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-2xl font-bold text-white">Editar Mascota</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-3xl font-bold leading-none"
            title="Cerrar"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-gray-50">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
              placeholder="Ingresa el nombre"
            />
          </div>

          {/* Especie */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Especie *
            </label>
            <select
              required
              value={formData.especie}
              onChange={(e) =>
                setFormData({ ...formData, especie: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
            >
              <option value="">Seleccionar especie</option>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Ave">Ave</option>
              <option value="Conejo">Conejo</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Raza */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Raza
            </label>
            <input
              type="text"
              value={formData.raza}
              onChange={(e) =>
                setFormData({ ...formData, raza: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
              placeholder="Ingresa la raza"
            />
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              value={formData.fecha_nacimiento}
              onChange={(e) =>
                setFormData({ ...formData, fecha_nacimiento: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
            />
          </div>

          {/* Sexo */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Sexo
            </label>
            <select
              value={formData.sexo}
              onChange={(e) =>
                setFormData({ ...formData, sexo: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
            >
              <option value="">Seleccionar sexo</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Color
            </label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
              placeholder="Ingresa el color"
            />
          </div>

          {/* Señas particulares */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Señas Particulares
            </label>
            <textarea
              value={formData.senias_particulares}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  senias_particulares: e.target.value,
                })
              }
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium resize-none"
              placeholder="Describe las señas particulares"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-6 border-t-2 border-gray-300 bg-white -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 text-gray-800 font-bold bg-gray-200 hover:bg-gray-300 rounded-lg transition disabled:opacity-50 border-2 border-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50 shadow-lg"
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
