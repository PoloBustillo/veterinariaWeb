"use client";

import { useState } from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import EditarMascotaForm from "./EditarMascotaForm";

interface MascotaCardProps {
  mascota: any;
  isVeterinario: boolean;
  onDelete: (id: number) => void;
  onUpdate: (mascotaActualizada: any) => void;
}

export default function MascotaCard({
  mascota,
  isVeterinario,
  onDelete,
  onUpdate,
}: MascotaCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [mascotaData, setMascotaData] = useState(mascota);

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return "No especificada";
    return new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/mascotas?id_mascota=${mascota.id_mascota}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error al eliminar la mascota");
        setIsDeleting(false);
        setShowConfirm(false);
        return;
      }

      onDelete(mascota.id_mascota);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar la mascota");
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleUpdate = (mascotaActualizada: any) => {
    setMascotaData(mascotaActualizada);
    onUpdate(mascotaActualizada);
  };

  const dueno = mascotaData.Relacion_Dueno_Mascota?.[0]?.Dueno;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition relative">
      {/* Botones de acción */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setShowEditForm(true)}
          disabled={isDeleting}
          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
          title="Editar mascota"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          disabled={isDeleting}
          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
          title="Eliminar mascota"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Header con emoji de mascota */}
      <div className="flex items-start justify-between mb-4 pr-8">
        <div className="flex items-center gap-3">
          <div className="text-4xl">
            {mascotaData.especie === "Perro"
              ? "🐕"
              : mascotaData.especie === "Gato"
              ? "🐈"
              : mascotaData.especie === "Ave"
              ? "🦜"
              : mascotaData.especie === "Conejo"
              ? "🐰"
              : "🐾"}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {mascotaData.nombre}
            </h3>
            <p className="text-sm text-gray-600">
              {mascotaData.especie}
              {mascotaData.raza && ` • ${mascotaData.raza}`}
            </p>
          </div>
        </div>
      </div>

      {/* Información de la mascota */}
      <div className="space-y-2 mb-4">
        {mascotaData.sexo && (
          <p className="text-sm text-gray-700">
            <span className="font-medium">Sexo:</span> {mascotaData.sexo}
          </p>
        )}
        {mascotaData.fecha_nacimiento && (
          <p className="text-sm text-gray-700">
            <span className="font-medium">Nacimiento:</span>{" "}
            {formatFecha(mascotaData.fecha_nacimiento)}
          </p>
        )}
        {mascotaData.color && (
          <p className="text-sm text-gray-700">
            <span className="font-medium">Color:</span> {mascotaData.color}
          </p>
        )}
        {mascotaData.senias_particulares && (
          <p className="text-sm text-gray-700">
            <span className="font-medium">Señas:</span>{" "}
            {mascotaData.senias_particulares}
          </p>
        )}
      </div>

      {/* Información del dueño (solo para veterinarios) */}
      {isVeterinario && dueno && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <p className="text-xs text-gray-500 font-medium mb-1">DUEÑO</p>
          <p className="text-sm font-medium text-gray-900">
            {dueno.nombre_completo}
          </p>
          {dueno.telefono && (
            <p className="text-sm text-gray-600">📞 {dueno.telefono}</p>
          )}
        </div>
      )}

      {/* Modal de edición */}
      {showEditForm && (
        <EditarMascotaForm
          mascota={mascotaData}
          onClose={() => setShowEditForm(false)}
          onUpdate={handleUpdate}
        />
      )}

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ¿Eliminar mascota?
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar a{" "}
              <span className="font-semibold">{mascota.nombre}</span>? Esta
              acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
