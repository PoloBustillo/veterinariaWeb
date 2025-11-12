"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Insumo {
  id_insumo: number;
  nombre: string;
  descripcion: string | null;
  unidad: string | null;
  cantidad_disponible: number | null;
  costo_unitario: number | null;
}

interface Servicio {
  id_servicio: number;
  nombre: string;
  descripcion: string | null;
  costo: number;
  duracion_estimada: number | null;
}

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
    Relacion_Dueno_Mascota: Array<{
      Dueno: {
        id_dueno: number;
        nombre_completo: string;
        telefono: string | null;
        correo: string | null;
      };
    }>;
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
      costo_unitario: number | null;
    };
  }>;
  Consulta_Servicio: Array<{
    id_consulta_servicio: number;
    cantidad: number | null;
    subtotal: number;
    Servicio: {
      id_servicio: number;
      nombre: string;
      costo: number;
    };
  }>;
  pagos: Array<{
    id_pago: number;
    monto: number;
    metodo: string;
    estado: string | null;
    fecha: string | null;
  }>;
}

interface GestionarConsultaFormProps {
  consultaId: string;
  userRole: string;
}

export default function GestionarConsultaForm({
  consultaId,
  userRole,
}: GestionarConsultaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [consulta, setConsulta] = useState<Consulta | null>(null);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);

  const [formData, setFormData] = useState({
    diagnostico: "",
    tratamiento: "",
    observaciones: "",
  });

  // Estados para pago
  const [mostrarFormPago, setMostrarFormPago] = useState(false);
  const [montoPago, setMontoPago] = useState("");
  const [metodoPago, setMetodoPago] = useState<string>("efectivo");
  const [procesandoPago, setProcesandoPago] = useState(false);

  const [insumosSeleccionados, setInsumosSeleccionados] = useState<
    Array<{ id_insumo: number; cantidad: number }>
  >([]);

  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<
    Array<{ id_servicio: number; cantidad: number }>
  >([]);

  // Cargar consulta, insumos y servicios
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Cargar consulta
        const consultaRes = await fetch(`/api/consultas/${consultaId}`);
        const consultaData = await consultaRes.json();

        if (consultaRes.ok) {
          // Normalizar keys que pueden venir en PascalCase desde el API
          const normalizeConsulta = (raw: any) => {
            if (!raw) return raw;
            const normalized = { ...raw };
            if (raw.Mascota && !raw.mascota) normalized.mascota = raw.Mascota;
            if (raw.Veterinario && !raw.veterinario)
              normalized.veterinario = raw.Veterinario;
            if (raw.Pago && !raw.pagos) normalized.pagos = raw.Pago;
            return normalized;
          };

          const consultaNorm = normalizeConsulta(consultaData.consulta);

          // Log para debug - verificar estructura de datos
          console.log("📋 Consulta cargada:", {
            id: consultaNorm.id_consulta,
            tiene_mascota: !!consultaNorm.mascota,
            tiene_relaciones: !!consultaNorm.mascota?.Relacion_Dueno_Mascota,
            num_relaciones:
              consultaNorm.mascota?.Relacion_Dueno_Mascota?.length || 0,
            tiene_dueno:
              !!consultaNorm.mascota?.Relacion_Dueno_Mascota?.[0]?.Dueno,
          });

          setConsulta(consultaNorm);
          setFormData({
            diagnostico: consultaNorm.diagnostico || "",
            tratamiento: consultaNorm.tratamiento || "",
            observaciones: consultaNorm.observaciones || "",
          });

          // Cargar insumos y servicios ya asociados a la consulta
          if (consultaNorm.Consulta_Insumo) {
            const insumosExistentes = consultaNorm.Consulta_Insumo.map(
              (ci: any) => ({
                id_insumo: ci.id_insumo,
                cantidad: ci.cantidad,
              })
            );
            setInsumosSeleccionados(insumosExistentes);
          }

          if (consultaNorm.Consulta_Servicio) {
            const serviciosExistentes = consultaNorm.Consulta_Servicio.map(
              (cs: any) => ({
                id_servicio: cs.id_servicio,
                cantidad: cs.cantidad || 1,
              })
            );
            setServiciosSeleccionados(serviciosExistentes);
          }
        } else {
          setError(consultaData.error);
        }

        // Cargar insumos disponibles (solo veterinario)
        if (userRole === "veterinario") {
          const insumosRes = await fetch("/api/insumos");
          const insumosData = await insumosRes.json();
          if (insumosRes.ok) {
            setInsumos(insumosData.insumos);
          }

          // Cargar servicios disponibles
          const serviciosRes = await fetch("/api/servicios");
          const serviciosData = await serviciosRes.json();
          if (serviciosRes.ok) {
            setServicios(serviciosData.servicios);
          }
        }
      } catch (err) {
        setError("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [consultaId, userRole]);

  const handleIniciarConsulta = async () => {
    setUpdating(true);
    setError("");

    try {
      const response = await fetch(`/api/consultas/${consultaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "en_proceso" }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Consulta iniciada exitosamente");
        setConsulta(data.consulta);
        router.refresh();
      } else {
        setError(data.error || "Error al iniciar consulta");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setUpdating(false);
    }
  };

  const handleFinalizarConsulta = async () => {
    if (!formData.diagnostico || !formData.tratamiento) {
      setError("Debes completar diagnóstico y tratamiento para finalizar");
      return;
    }

    setUpdating(true);
    setError("");

    try {
      const response = await fetch(`/api/consultas/${consultaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: "finalizada",
          diagnostico: formData.diagnostico,
          tratamiento: formData.tratamiento,
          observaciones: formData.observaciones,
          insumos: insumosSeleccionados.filter((i) => i.cantidad > 0),
          servicios: serviciosSeleccionados.filter((s) => s.cantidad > 0),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Consulta finalizada exitosamente");
        setConsulta(data.consulta);
        router.refresh();
        setTimeout(() => router.push("/veterinario/consultas"), 2000);
      } else {
        setError(data.error || "Error al finalizar consulta");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setUpdating(false);
    }
  };

  const handleGuardarCambios = async () => {
    setUpdating(true);
    setError("");

    try {
      const response = await fetch(`/api/consultas/${consultaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagnostico: formData.diagnostico,
          tratamiento: formData.tratamiento,
          observaciones: formData.observaciones,
          insumos: insumosSeleccionados.filter((i) => i.cantidad > 0),
          servicios: serviciosSeleccionados.filter((s) => s.cantidad > 0),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Cambios guardados exitosamente");
        // Recargar consulta
        const consultaRes = await fetch(`/api/consultas/${consultaId}`);
        const consultaData = await consultaRes.json();
        if (consultaRes.ok) {
          setConsulta(consultaData.consulta);

          // Actualizar los estados con los insumos y servicios guardados
          if (consultaData.consulta.Consulta_Insumo) {
            const insumosExistentes = consultaData.consulta.Consulta_Insumo.map(
              (ci: any) => ({
                id_insumo: ci.id_insumo,
                cantidad: ci.cantidad,
              })
            );
            setInsumosSeleccionados(insumosExistentes);
          } else {
            setInsumosSeleccionados([]);
          }

          if (consultaData.consulta.Consulta_Servicio) {
            const serviciosExistentes =
              consultaData.consulta.Consulta_Servicio.map((cs: any) => ({
                id_servicio: cs.id_servicio,
                cantidad: cs.cantidad || 1,
              }));
            setServiciosSeleccionados(serviciosExistentes);
          } else {
            setServiciosSeleccionados([]);
          }
        }
        router.refresh();
      } else {
        setError(data.error || "Error al guardar cambios");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setUpdating(false);
    }
  };

  const handleRegistrarPago = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!montoPago || parseFloat(montoPago) <= 0) {
      setError("El monto debe ser mayor a 0");
      return;
    }

    setProcesandoPago(true);
    setError("");

    try {
      const response = await fetch("/api/caja/registrar-pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_consulta: consultaId,
          monto: parseFloat(montoPago),
          metodo: metodoPago,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Pago registrado exitosamente en caja");
        setMontoPago("");
        setMostrarFormPago(false);
        // Recargar consulta para mostrar el pago
        const consultaRes = await fetch(`/api/consultas/${consultaId}`);
        const consultaData = await consultaRes.json();
        if (consultaRes.ok) {
          setConsulta(consultaData.consulta);
        }
        router.refresh();
      } else {
        setError(data.error || "Error al registrar pago");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setProcesandoPago(false);
    }
  };

  const calcularTotalConsulta = () => {
    if (!consulta) return 0;

    const totalServicios = consulta.Consulta_Servicio.reduce(
      (sum, cs) => sum + Number(cs.subtotal),
      0
    );

    const totalInsumos = consulta.Consulta_Insumo.reduce((sum, ci) => {
      const costo = ci.Insumo.costo_unitario || 0;
      return sum + Number(costo) * ci.cantidad;
    }, 0);

    return totalServicios + totalInsumos;
  };

  const totalPagado =
    consulta?.pagos?.reduce((sum, p) => sum + Number(p.monto), 0) || 0;

  const agregarInsumo = (id_insumo: number) => {
    if (!insumosSeleccionados.find((i) => i.id_insumo === id_insumo)) {
      setInsumosSeleccionados([
        ...insumosSeleccionados,
        { id_insumo, cantidad: 1 },
      ]);
    }
  };

  const actualizarCantidadInsumo = (id_insumo: number, cantidad: number) => {
    setInsumosSeleccionados(
      insumosSeleccionados.map((i) =>
        i.id_insumo === id_insumo ? { ...i, cantidad } : i
      )
    );
  };

  const eliminarInsumo = (id_insumo: number) => {
    setInsumosSeleccionados(
      insumosSeleccionados.filter((i) => i.id_insumo !== id_insumo)
    );
  };

  const agregarServicio = (id_servicio: number) => {
    if (!serviciosSeleccionados.find((s) => s.id_servicio === id_servicio)) {
      setServiciosSeleccionados([
        ...serviciosSeleccionados,
        { id_servicio, cantidad: 1 },
      ]);
    }
  };

  const actualizarCantidadServicio = (
    id_servicio: number,
    cantidad: number
  ) => {
    setServiciosSeleccionados(
      serviciosSeleccionados.map((s) =>
        s.id_servicio === id_servicio ? { ...s, cantidad } : s
      )
    );
  };

  const eliminarServicio = (id_servicio: number) => {
    setServiciosSeleccionados(
      serviciosSeleccionados.filter((s) => s.id_servicio !== id_servicio)
    );
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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

  if (!consulta.mascota) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: Mascota no encontrada</p>
        <p className="text-sm text-gray-600 mt-2">
          Esta consulta no tiene una mascota asociada. Por favor, contacta al
          administrador.
        </p>
      </div>
    );
  }

  // Obtener dueño (puede ser undefined si la mascota no tiene dueño registrado)
  const dueno = consulta.mascota.Relacion_Dueno_Mascota?.[0]?.Dueno;
  const puedeEditar =
    consulta.estado === "programada" || consulta.estado === "en_proceso";
  const esConsultaFinalizada =
    consulta.estado === "finalizada" || consulta.estado === "cancelada";

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
          <p className="text-lg font-semibold text-gray-800">
            {consulta.mascota.nombre}
          </p>
          <p className="text-sm text-gray-600">
            {consulta.mascota.especie}{" "}
            {consulta.mascota.raza && `- ${consulta.mascota.raza}`}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">👤 Dueño</h3>
          {dueno ? (
            <>
              <p className="text-lg font-semibold text-gray-800">
                {dueno.nombre_completo}
              </p>
              {dueno.telefono && (
                <p className="text-sm text-gray-600">📞 {dueno.telefono}</p>
              )}
              {dueno.correo && (
                <p className="text-sm text-gray-600">✉️ {dueno.correo}</p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No hay dueño registrado para esta mascota
            </p>
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
          <h3 className="font-bold text-gray-900 mb-2">
            💬 Motivo de la consulta
          </h3>
          <p className="text-gray-700">{consulta.motivo}</p>
        </div>
      )}

      {/* Botones de acción según estado */}
      {userRole === "veterinario" && !esConsultaFinalizada && (
        <div className="flex gap-4">
          {consulta.estado === "programada" && (
            <button
              onClick={handleIniciarConsulta}
              disabled={updating}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {updating ? "Iniciando..." : "▶️ Iniciar Consulta"}
            </button>
          )}
        </div>
      )}

      {/* Formulario de consulta (solo si está en proceso o programada) */}
      {userRole === "veterinario" && puedeEditar && (
        <div className="space-y-6 border-t pt-6">
          <h2 className="text-2xl font-bold text-gray-900">
            📝 Información Médica
          </h2>

          {/* Diagnóstico */}
          <div>
            <label
              htmlFor="diagnostico"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              🩺 Diagnóstico {consulta.estado === "en_proceso" && "*"}
            </label>
            <textarea
              id="diagnostico"
              value={formData.diagnostico}
              onChange={(e) =>
                setFormData({ ...formData, diagnostico: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Describe el diagnóstico de la mascota..."
            />
          </div>

          {/* Tratamiento */}
          <div>
            <label
              htmlFor="tratamiento"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              💊 Tratamiento {consulta.estado === "en_proceso" && "*"}
            </label>
            <textarea
              id="tratamiento"
              value={formData.tratamiento}
              onChange={(e) =>
                setFormData({ ...formData, tratamiento: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Indica el tratamiento a seguir..."
            />
          </div>

          {/* Observaciones */}
          <div>
            <label
              htmlFor="observaciones"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              📋 Observaciones
            </label>
            <textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) =>
                setFormData({ ...formData, observaciones: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Observaciones adicionales..."
            />
          </div>

          {/* Insumos */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              💉 Insumos Utilizados
            </h3>

            {/* Insumos ya agregados */}
            {consulta.Consulta_Insumo.length > 0 && (
              <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Insumos registrados:
                </p>
                <ul className="space-y-1">
                  {consulta.Consulta_Insumo.map((ci) => (
                    <li
                      key={ci.id_consulta_insumo}
                      className="text-sm text-gray-600"
                    >
                      • {ci.Insumo.nombre} - Cantidad: {ci.cantidad}
                      {ci.Insumo.costo_unitario &&
                        ` - $${(
                          Number(ci.Insumo.costo_unitario) * ci.cantidad
                        ).toFixed(2)}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Agregar nuevos insumos */}
            <div className="space-y-2">
              <select
                onChange={(e) => {
                  const id = parseInt(e.target.value);
                  if (id) {
                    agregarInsumo(id);
                    e.target.value = "";
                  }
                }}
                className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
              >
                <option value="">➕ Agregar insumo...</option>
                {insumos
                  .filter(
                    (i) =>
                      !insumosSeleccionados.find(
                        (is) => is.id_insumo === i.id_insumo
                      )
                  )
                  .map((insumo) => (
                    <option key={insumo.id_insumo} value={insumo.id_insumo}>
                      {insumo.nombre} - Disponible: {insumo.cantidad_disponible}
                      {insumo.costo_unitario &&
                        ` - $${Number(insumo.costo_unitario).toFixed(2)}`}
                    </option>
                  ))}
              </select>

              {insumosSeleccionados.length > 0 && (
                <div className="space-y-2">
                  {insumosSeleccionados.map((insumoSel) => {
                    const insumo = insumos.find(
                      (i) => i.id_insumo === insumoSel.id_insumo
                    );
                    return (
                      <div
                        key={insumoSel.id_insumo}
                        className="flex items-center gap-3 bg-green-50 p-3 rounded-lg"
                      >
                        <span className="flex-1 font-medium text-gray-800">
                          {insumo?.nombre}
                        </span>
                        <input
                          type="number"
                          min="1"
                          max={insumo?.cantidad_disponible || 1}
                          value={insumoSel.cantidad}
                          onChange={(e) =>
                            actualizarCantidadInsumo(
                              insumoSel.id_insumo,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-20 px-2 py-1 border-2 border-gray-400 rounded bg-white text-gray-900"
                        />
                        <button
                          onClick={() => eliminarInsumo(insumoSel.id_insumo)}
                          className="text-red-600 hover:text-red-700 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              🏥 Servicios Aplicados
            </h3>

            {/* Servicios ya agregados */}
            {consulta.Consulta_Servicio.length > 0 && (
              <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Servicios registrados:
                </p>
                <ul className="space-y-1">
                  {consulta.Consulta_Servicio.map((cs) => (
                    <li
                      key={cs.id_consulta_servicio}
                      className="text-sm text-gray-600"
                    >
                      • {cs.Servicio.nombre} - Cantidad: {cs.cantidad} -
                      Subtotal: ${Number(cs.subtotal).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Agregar nuevos servicios */}
            <div className="space-y-2">
              <select
                onChange={(e) => {
                  const id = parseInt(e.target.value);
                  if (id) {
                    agregarServicio(id);
                    e.target.value = "";
                  }
                }}
                className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
              >
                <option value="">➕ Agregar servicio...</option>
                {servicios
                  .filter(
                    (s) =>
                      !serviciosSeleccionados.find(
                        (ss) => ss.id_servicio === s.id_servicio
                      )
                  )
                  .map((servicio) => (
                    <option
                      key={servicio.id_servicio}
                      value={servicio.id_servicio}
                    >
                      {servicio.nombre} - ${Number(servicio.costo).toFixed(2)}
                    </option>
                  ))}
              </select>

              {serviciosSeleccionados.length > 0 && (
                <div className="space-y-2">
                  {serviciosSeleccionados.map((servicioSel) => {
                    const servicio = servicios.find(
                      (s) => s.id_servicio === servicioSel.id_servicio
                    );
                    return (
                      <div
                        key={servicioSel.id_servicio}
                        className="flex items-center gap-3 bg-green-50 p-3 rounded-lg"
                      >
                        <span className="flex-1 font-medium text-gray-800">
                          {servicio?.nombre}
                        </span>
                        <span className="text-sm text-gray-600">
                          $
                          {servicio &&
                            (
                              Number(servicio.costo) * servicioSel.cantidad
                            ).toFixed(2)}
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={servicioSel.cantidad}
                          onChange={(e) =>
                            actualizarCantidadServicio(
                              servicioSel.id_servicio,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-20 px-2 py-1 border-2 border-gray-400 rounded bg-white text-gray-900"
                        />
                        <button
                          onClick={() =>
                            eliminarServicio(servicioSel.id_servicio)
                          }
                          className="text-red-600 hover:text-red-700 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              onClick={handleGuardarCambios}
              disabled={updating}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {updating ? "Guardando..." : "💾 Guardar Cambios"}
            </button>

            {consulta.estado === "en_proceso" && (
              <button
                onClick={handleFinalizarConsulta}
                disabled={updating}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {updating ? "Finalizando..." : "✅ Finalizar Consulta"}
              </button>
            )}

            {consulta.estado === "finalizada" && (
              <button
                onClick={() => setMostrarFormPago(!mostrarFormPago)}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition"
              >
                {mostrarFormPago ? "❌ Cancelar Pago" : "💰 Registrar Pago"}
              </button>
            )}
          </div>

          {/* Resumen de costos y pagos */}
          {consulta.estado === "finalizada" && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h3 className="font-bold text-gray-900 mb-3">
                💵 Resumen Financiero
              </h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Total de la consulta:</span>
                  <span className="font-semibold">
                    ${calcularTotalConsulta().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total pagado:</span>
                  <span className="font-semibold text-green-600">
                    ${totalPagado.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-300">
                  <span className="font-bold">Saldo pendiente:</span>
                  <span
                    className={`font-bold ${
                      calcularTotalConsulta() - totalPagado > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    ${(calcularTotalConsulta() - totalPagado).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Pagos registrados */}
              {consulta.pagos.length > 0 && (
                <div className="mt-4 pt-4 border-t border-blue-300">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    📜 Pagos Registrados:
                  </h4>
                  <div className="space-y-2">
                    {consulta.pagos.map((pago) => (
                      <div
                        key={pago.id_pago}
                        className="flex justify-between items-center text-sm bg-white p-2 rounded"
                      >
                        <div>
                          <span className="font-medium">{pago.metodo}</span>
                          <span className="text-gray-500 ml-2">
                            {pago.fecha
                              ? new Date(pago.fecha).toLocaleDateString("es-MX")
                              : "Sin fecha"}
                          </span>
                        </div>
                        <span className="font-semibold text-green-600">
                          ${Number(pago.monto).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Formulario de registro de pago */}
          {mostrarFormPago && consulta.estado === "finalizada" && (
            <form
              onSubmit={handleRegistrarPago}
              className="mt-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300"
            >
              <h3 className="font-bold text-gray-900 mb-4">
                💰 Registrar Nuevo Pago
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Monto a pagar:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={montoPago}
                    onChange={(e) => setMontoPago(e.target.value)}
                    placeholder="0.00"
                    required
                    className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 placeholder-gray-500"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Saldo pendiente: $
                    {(calcularTotalConsulta() - totalPagado).toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Método de pago:
                  </label>
                  <select
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900"
                  >
                    <option value="efectivo">💵 Efectivo</option>
                    <option value="tarjeta">💳 Tarjeta</option>
                    <option value="transferencia">🏦 Transferencia</option>
                    <option value="cheque">📝 Cheque</option>
                    <option value="deposito">🏧 Depósito</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={procesandoPago}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                  >
                    {procesandoPago ? "Procesando..." : "✅ Confirmar Pago"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarFormPago(false);
                      setMontoPago("");
                    }}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Vista de consulta finalizada o cancelada */}
      {esConsultaFinalizada && (
        <div className="space-y-4 border-t pt-6">
          <h2 className="text-2xl font-bold text-gray-900">
            📋 Información de la Consulta
          </h2>

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
              <h3 className="font-bold text-gray-900 mb-2">
                💉 Insumos Utilizados
              </h3>
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
              <h3 className="font-bold text-gray-900 mb-2">
                🏥 Servicios Aplicados
              </h3>
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
    </div>
  );
}
