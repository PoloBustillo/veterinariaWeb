"use client";

import { useState } from "react";
import MascotaCard from "./MascotaCard";

interface MascotasListProps {
  initialMascotas: any[];
  isVeterinario: boolean;
}

export default function MascotasList({
  initialMascotas,
  isVeterinario,
}: MascotasListProps) {
  const [mascotas, setMascotas] = useState(initialMascotas);

  const handleDelete = (id: number) => {
    setMascotas((prev) => prev.filter((m) => m.id_mascota !== id));
  };

  const handleUpdate = (mascotaActualizada: any) => {
    setMascotas((prev) =>
      prev.map((m) =>
        m.id_mascota === mascotaActualizada.id_mascota
          ? { ...m, ...mascotaActualizada }
          : m
      )
    );
  };

  if (mascotas.length === 0) {
    return null; // El componente padre mostrará el estado vacío
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mascotas.map((mascota) => (
        <MascotaCard
          key={mascota.id_mascota}
          mascota={mascota}
          isVeterinario={isVeterinario}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
}
