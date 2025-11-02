"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Consulta {
  id_consulta: number;
  fecha: string | null;
  motivo: string | null;
  diagnostico: string | null;
  tratamiento: string | null;
  estado: string | null;
  observaciones: string | null;
  mascota: {
    id_mascota: number;
    nombre: string;
    especie: string;
    raza: string | null;
  };
  veterinario: {
    id_veterinario: number;
    nombre_completo: string;
    especialidad: string | null;
  };
  Consulta_Insumo: Array<{
    id_consulta_insumo: number;
    cantidad: number;
    Insumo: {
      id_insumo: number;
      nombre: string;
    };
  }>;
  Consulta_Servicio: Array<{
    id_consulta_servicio: number;
    cantidad: number | null;
    subtotal: number;
    Servicio: {
      id_servicio: number;
      nombre: string;
    };
  }>;
}

interface CancelarConsultaFormProps {
  consultaId: string;
  userRole: string;
}

export default function CancelarConsultaForm({
  consultaId,
  userRole,
}: CancelarConsultaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [consulta, setConsulta] = useState<Consulta | null>(null);

  useEffect(() => {
    const fetchConsulta = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/consultas/${consultaId}`);
        const data = await response.json();

        if (response.ok) {
          setConsulta(data.consulta);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Error al cargar la consulta");
      } finally {
        setLoading(false);
      }
    };

    fetchConsulta();
  }, [consultaId]);

  const handleCancelar = async () => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta consulta?")) {
      return;
    }

    setCanceling(true);
    setError("");

    try {
      const response = await fetch(`/api/consultas/${consultaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "cancelada" }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Consulta cancelada exitosamente");
        setTimeout(() => router.push("/mis-citas"), 2000);
      } else {
        setError(data.error || "Error al cancelar consulta");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setCanceling(false);
    }
  };

  const getEstadoBadge = (estado: string | null) => {
    switch (estado) {
      case "programada":
        return "bg-yellow-100 text-yellow-800";
      case "en_proceso":
        return "bg-blue-100 text-blue-800";
      case "finalizada":
        return "bg-green-100 text-green-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const puedeCancelar = () => {
    if (!consulta || consulta.estado !== "programada") {
      return false;
    }

    if (!consulta.fecha) {
      return false;
    }

    const fechaConsulta = new Date(consulta.fecha);
    const ahora = new Date();
    const dosHorasEnMs = 2 * 60 * 60 * 1000;

    return fechaConsulta.getTime() - ahora.getTime() >= dosHorasEnMs;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!consulta) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">No se pudo cargar la consulta</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-2 border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Información general */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">🐾 Mascota</h3>
          <p className="text-lg font-semibold text-gray-800">{consulta.mascota.nombre}</p>
          <p className="text-sm text-gray-600">
            {consulta.mascota.especie} {consulta.mascota.raza && `- ${consulta.mascota.raza}`}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">👨‍⚕️ Veterinario</h3>
          <p className="text-lg font-semibold text-gray-800">{consulta.veterinario.nombre_completo}</p>
          {consulta.veterinario.especialidad && (
            <p className="text-sm text-gray-600">{consulta.veterinario.especialidad}</p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">📅 Fecha</h3>
          <p className="text-sm text-gray-700">
            {consulta.fecha
              ? new Date(consulta.fecha).toLocaleString("es-MX", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "No especificada"}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">🏥 Estado</h3>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getEstadoBadge(
              consulta.estado
            )}`}
          >
            {consulta.estado || "Sin estado"}
          </span>
        </div>
      </div>

      {/* Motivo */}
      {consulta.motivo && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">💬 Motivo de la consulta</h3>
          <p className="text-gray-700">{consulta.motivo}</p>
        </div>
      )}

      {/* Información médica (si ya fue atendida) */}
      {(consulta.diagnostico || consulta.tratamiento || consulta.observaciones) && (
        <div className="space-y-4 border-t pt-6">
          <h2 className="text-2xl font-bold text-gray-900">📋 Información Médica</h2>

          {consulta.diagnostico && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">🩺 Diagnóstico</h3>
              <p className="text-gray-700">{consulta.diagnostico}</p>
            </div>
          )}

          {consulta.tratamiento && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">💊 Tratamiento</h3>
              <p className="text-gray-700">{consulta.tratamiento}</p>
            </div>
          )}

          {consulta.observaciones && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">📋 Observaciones</h3>
              <p className="text-gray-700">{consulta.observaciones}</p>
            </div>
          )}

          {consulta.Consulta_Insumo.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">💉 Insumos Utilizados</h3>
              <ul className="space-y-1">
                {consulta.Consulta_Insumo.map((ci) => (
                  <li key={ci.id_consulta_insumo} className="text-gray-700">
                    • {ci.Insumo.nombre} - Cantidad: {ci.cantidad}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {consulta.Consulta_Servicio.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">🏥 Servicios Aplicados</h3>
              <ul className="space-y-1">
                {consulta.Consulta_Servicio.map((cs) => (
                  <li key={cs.id_consulta_servicio} className="text-gray-700">
                    • {cs.Servicio.nombre} - ${Number(cs.subtotal).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Botón de cancelar */}
      {consulta.estado === "programada" && (
        <div className="border-t pt-6">
          {puedeCancelar() ? (
            <button
              onClick={handleCancelar}
              disabled={canceling}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {canceling ? "Cancelando..." : "❌ Cancelar Consulta"}
            </button>
          ) : (
            <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <p className="font-semibold">⚠️ No puedes cancelar esta consulta</p>
              <p className="text-sm mt-1">
                Debes cancelar con al menos 2 horas de anticipación.
              </p>
            </div>
          )}
        </div>
      )}

      {consulta.estado === "cancelada" && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-semibold">❌ Esta consulta ha sido cancelada</p>
        </div>
      )}

      {consulta.estado === "finalizada" && (
        <div className="bg-green-50 border-2 border-green-200 text-green-800 px-4 py-3 rounded-lg">
          <p className="font-semibold">✅ Esta consulta ha sido finalizada</p>
        </div>
      )}
    </div>
  );
}
