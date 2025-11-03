"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Caja {
  id_caja: number;
  fecha_apertura: string;
  fecha_cierre: string;
  saldo_inicial: number;
  saldo_final: number;
  observaciones: string | null;
  totalIngresos: number;
  totalEgresos: number;
  cantidadMovimientos: number;
  Caja_Movimiento: Movimiento[];
}

interface Movimiento {
  id_movimiento: number;
  fecha: string;
  concepto: string;
  monto: number;
  tipo: "Ingreso" | "Egreso";
}

export default function HistorialCajaView() {
  const [loading, setLoading] = useState(true);
  const [cajas, setCajas] = useState<Caja[]>([]);
  const [error, setError] = useState("");
  const [cajaExpandida, setCajaExpandida] = useState<number | null>(null);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/caja/historial?limite=20");
      const data = await response.json();

      if (response.ok) {
        setCajas(data.cajas);
      } else {
        setError(data.error || "Error al cargar historial");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botón volver */}
      <div className="flex justify-between items-center">
        <Link
          href="/veterinario/caja"
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-bold shadow-lg"
        >
          ← Volver a Caja Actual
        </Link>
        <p className="text-gray-600">
          Mostrando {cajas.length} caja{cajas.length !== 1 ? "s" : ""} cerrada
          {cajas.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Estadísticas generales */}
      {cajas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-green-700">
                Total Ingresos (todas las cajas)
              </span>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-3xl font-bold text-green-900">
              ${cajas.reduce((sum, c) => sum + c.totalIngresos, 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-red-700">
                Total Egresos (todas las cajas)
              </span>
              <span className="text-2xl">📉</span>
            </div>
            <p className="text-3xl font-bold text-red-900">
              ${cajas.reduce((sum, c) => sum + c.totalEgresos, 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-purple-700">
                Promedio por Caja
              </span>
              <span className="text-2xl">💎</span>
            </div>
            <p className="text-3xl font-bold text-purple-900">
              $
              {(
                cajas.reduce((sum, c) => sum + Number(c.saldo_final || 0), 0) /
                cajas.length
              ).toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Lista de cajas */}
      {cajas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <span className="text-6xl mb-4 block">📦</span>
          <p className="text-xl text-gray-600">No hay cajas cerradas aún</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cajas.map((caja) => (
            <div
              key={caja.id_caja}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Header de la caja */}
              <button
                onClick={() =>
                  setCajaExpandida(
                    cajaExpandida === caja.id_caja ? null : caja.id_caja
                  )
                }
                className="w-full px-6 py-4 bg-linear-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-gray-900">
                        Caja #{caja.id_caja}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(caja.fecha_apertura).toLocaleDateString(
                          "es-MX",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <div className="text-center px-4 py-2 bg-blue-100 rounded-lg">
                      <p className="text-xs text-blue-700 font-semibold">
                        Saldo Inicial
                      </p>
                      <p className="text-lg font-bold text-blue-900">
                        ${Number(caja.saldo_inicial).toFixed(2)}
                      </p>
                    </div>

                    <div className="text-center px-4 py-2 bg-green-100 rounded-lg">
                      <p className="text-xs text-green-700 font-semibold">
                        Ingresos
                      </p>
                      <p className="text-lg font-bold text-green-900">
                        ${caja.totalIngresos.toFixed(2)}
                      </p>
                    </div>

                    <div className="text-center px-4 py-2 bg-red-100 rounded-lg">
                      <p className="text-xs text-red-700 font-semibold">
                        Egresos
                      </p>
                      <p className="text-lg font-bold text-red-900">
                        ${caja.totalEgresos.toFixed(2)}
                      </p>
                    </div>

                    <div className="text-center px-4 py-2 bg-purple-100 rounded-lg">
                      <p className="text-xs text-purple-700 font-semibold">
                        Saldo Final
                      </p>
                      <p className="text-lg font-bold text-purple-900">
                        ${Number(caja.saldo_final).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="text-2xl">
                    {cajaExpandida === caja.id_caja ? "🔽" : "▶️"}
                  </div>
                </div>
              </button>

              {/* Detalles expandidos */}
              {cajaExpandida === caja.id_caja && (
                <div className="px-6 py-4 border-t border-gray-200">
                  {/* Información adicional */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Fecha de Apertura:</strong>
                      </p>
                      <p className="text-sm text-gray-900">
                        {new Date(caja.fecha_apertura).toLocaleString("es-MX")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Fecha de Cierre:</strong>
                      </p>
                      <p className="text-sm text-gray-900">
                        {new Date(caja.fecha_cierre).toLocaleString("es-MX")}
                      </p>
                    </div>
                    {caja.observaciones && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Observaciones:</strong>
                        </p>
                        <p className="text-sm text-gray-900">
                          {caja.observaciones}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Movimientos */}
                  {caja.Caja_Movimiento.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">
                        Movimientos ({caja.Caja_Movimiento.length})
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">
                                Fecha
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">
                                Concepto
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">
                                Tipo
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-bold text-gray-700">
                                Monto
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {caja.Caja_Movimiento.map((mov) => (
                              <tr
                                key={mov.id_movimiento}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-4 py-2 text-xs text-gray-600">
                                  {new Date(mov.fecha).toLocaleString("es-MX", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </td>
                                <td className="px-4 py-2 text-xs text-gray-900">
                                  {mov.concepto}
                                </td>
                                <td className="px-4 py-2">
                                  {mov.tipo === "Ingreso" ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                      📈
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                                      📉
                                    </span>
                                  )}
                                </td>
                                <td
                                  className={`px-4 py-2 text-right text-xs font-bold ${
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
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
