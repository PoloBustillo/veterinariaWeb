"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Caja {
  id_caja: number;
  fecha_apertura: string;
  fecha_cierre: string | null;
  saldo_inicial: number;
  saldo_final: number | null;
  observaciones: string | null;
  Caja_Movimiento: Movimiento[];
}

interface Movimiento {
  id_movimiento: number;
  fecha: string;
  concepto: string;
  monto: number;
  tipo: "Ingreso" | "Egreso";
}

export default function GestionCajaForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [caja, setCaja] = useState<Caja | null>(null);
  const [saldoActual, setSaldoActual] = useState(0);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalEgresos, setTotalEgresos] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Estados para abrir caja
  const [saldoInicial, setSaldoInicial] = useState("");
  const [observacionesApertura, setObservacionesApertura] = useState("");

  // Estados para nuevo movimiento
  const [mostrarFormMovimiento, setMostrarFormMovimiento] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState<"Ingreso" | "Egreso">(
    "Ingreso"
  );
  const [conceptoMovimiento, setConceptoMovimiento] = useState("");
  const [montoMovimiento, setMontoMovimiento] = useState("");

  // Estados para cerrar caja
  const [mostrarFormCierre, setMostrarFormCierre] = useState(false);
  const [observacionesCierre, setObservacionesCierre] = useState("");

  useEffect(() => {
    cargarCaja();
  }, []);

  const cargarCaja = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/caja");
      const data = await response.json();

      if (response.ok) {
        setCaja(data.caja);
        setSaldoActual(data.saldoActual || 0);
        setTotalIngresos(data.totalIngresos || 0);
        setTotalEgresos(data.totalEgresos || 0);
      } else {
        setError(data.error || "Error al cargar caja");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirCaja = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/caja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saldo_inicial: parseFloat(saldoInicial) || 0,
          observaciones: observacionesApertura,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Caja abierta exitosamente");
        setSaldoInicial("");
        setObservacionesApertura("");
        await cargarCaja();
      } else {
        setError(data.error || "Error al abrir caja");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };

  const handleRegistrarMovimiento = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/caja/movimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concepto: conceptoMovimiento,
          monto: parseFloat(montoMovimiento),
          tipo: tipoMovimiento,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Movimiento registrado exitosamente");
        setConceptoMovimiento("");
        setMontoMovimiento("");
        setMostrarFormMovimiento(false);
        await cargarCaja();
      } else {
        setError(data.error || "Error al registrar movimiento");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };

  const handleCerrarCaja = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirm("¿Estás seguro de que deseas cerrar la caja?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/caja/cerrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          observaciones: observacionesCierre,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Caja cerrada. Saldo final: $${data.saldoFinal.toFixed(2)}`);
        setMostrarFormCierre(false);
        setObservacionesCierre("");
        await cargarCaja();
      } else {
        setError(data.error || "Error al cerrar caja");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botón ver historial */}
      <div className="flex justify-end">
        <Link
          href="/veterinario/caja/historial"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-bold shadow-lg inline-flex items-center gap-2"
        >
          📊 Ver Historial de Cajas
        </Link>
      </div>

      {/* Mensajes */}
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

      {/* Si no hay caja abierta */}
      {!caja && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🔓 Abrir Caja
          </h2>
          <form onSubmit={handleAbrirCaja} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                💵 Saldo Inicial
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={saldoInicial}
                onChange={(e) => setSaldoInicial(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                📝 Observaciones (opcional)
              </label>
              <textarea
                rows={3}
                value={observacionesApertura}
                onChange={(e) => setObservacionesApertura(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-500"
                placeholder="Notas sobre la apertura de caja..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg shadow-lg"
            >
              Abrir Caja
            </button>
          </form>
        </div>
      )}

      {/* Si hay caja abierta */}
      {caja && (
        <>
          {/* Resumen de caja */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-blue-700">
                  Saldo Inicial
                </span>
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-3xl font-bold text-blue-900">
                ${Number(caja.saldo_inicial).toFixed(2)}
              </p>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-green-700">
                  Total Ingresos
                </span>
                <span className="text-2xl">📈</span>
              </div>
              <p className="text-3xl font-bold text-green-900">
                ${totalIngresos.toFixed(2)}
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-red-700">
                  Total Egresos
                </span>
                <span className="text-2xl">📉</span>
              </div>
              <p className="text-3xl font-bold text-red-900">
                ${totalEgresos.toFixed(2)}
              </p>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-purple-700">
                  Saldo Actual
                </span>
                <span className="text-2xl">💎</span>
              </div>
              <p className="text-3xl font-bold text-purple-900">
                ${saldoActual.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Información de apertura */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              📅 Información de Apertura
            </h3>
            <div className="text-sm text-gray-700">
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(caja.fecha_apertura).toLocaleString("es-MX")}
              </p>
              {caja.observaciones && (
                <p className="mt-2">
                  <strong>Observaciones:</strong> {caja.observaciones}
                </p>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setMostrarFormMovimiento(!mostrarFormMovimiento)}
              className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-lg"
            >
              {mostrarFormMovimiento ? "❌ Cancelar" : "➕ Nuevo Movimiento"}
            </button>

            <button
              onClick={() => setMostrarFormCierre(!mostrarFormCierre)}
              className="flex-1 bg-orange-600 text-white py-4 px-6 rounded-lg hover:bg-orange-700 transition-colors font-bold shadow-lg"
            >
              {mostrarFormCierre ? "❌ Cancelar" : "🔒 Cerrar Caja"}
            </button>
          </div>

          {/* Form de nuevo movimiento */}
          {mostrarFormMovimiento && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                ➕ Registrar Movimiento
              </h2>
              <form onSubmit={handleRegistrarMovimiento} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    📊 Tipo de Movimiento
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setTipoMovimiento("Ingreso")}
                      className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
                        tipoMovimiento === "Ingreso"
                          ? "bg-green-600 text-white shadow-lg"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      📈 Ingreso
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipoMovimiento("Egreso")}
                      className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
                        tipoMovimiento === "Egreso"
                          ? "bg-red-600 text-white shadow-lg"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      📉 Egreso
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    📝 Concepto *
                  </label>
                  <input
                    type="text"
                    required
                    value={conceptoMovimiento}
                    onChange={(e) => setConceptoMovimiento(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Descripción del movimiento..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    💵 Monto *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={montoMovimiento}
                    onChange={(e) => setMontoMovimiento(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="0.00"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg"
                >
                  Registrar Movimiento
                </button>
              </form>
            </div>
          )}

          {/* Form de cierre de caja */}
          {mostrarFormCierre && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🔒 Cerrar Caja
              </h2>
              <form onSubmit={handleCerrarCaja} className="space-y-6">
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h3 className="font-bold text-gray-900 mb-2">
                    Resumen Final
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saldo Inicial:</span>
                      <span className="font-bold">
                        ${Number(caja.saldo_inicial).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-green-700">
                      <span>Total Ingresos:</span>
                      <span className="font-bold">
                        +${totalIngresos.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-red-700">
                      <span>Total Egresos:</span>
                      <span className="font-bold">
                        -${totalEgresos.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                      <span className="font-bold text-gray-900">
                        Saldo Final:
                      </span>
                      <span className="font-bold text-purple-900 text-lg">
                        ${saldoActual.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    📝 Observaciones de Cierre (opcional)
                  </label>
                  <textarea
                    rows={3}
                    value={observacionesCierre}
                    onChange={(e) => setObservacionesCierre(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Notas sobre el cierre de caja..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg hover:bg-orange-700 transition-colors font-bold text-lg shadow-lg"
                >
                  Cerrar Caja
                </button>
              </form>
            </div>
          )}

          {/* Listado de movimientos */}
          {caja.Caja_Movimiento && caja.Caja_Movimiento.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📋 Movimientos de Caja
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                        Concepto
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                        Tipo
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">
                        Monto
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {caja.Caja_Movimiento.map((mov) => (
                      <tr
                        key={mov.id_movimiento}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(mov.fecha).toLocaleString("es-MX", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {mov.concepto}
                        </td>
                        <td className="px-4 py-3">
                          {mov.tipo === "Ingreso" ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                              📈 Ingreso
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                              📉 Egreso
                            </span>
                          )}
                        </td>
                        <td
                          className={`px-4 py-3 text-right text-sm font-bold ${
                            mov.tipo === "Ingreso"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {mov.tipo === "Ingreso" ? "+" : "-"}$
                          {Number(mov.monto).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
