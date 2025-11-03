"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  cantidad_disponible: number | null;
  categoria: string | null;
}

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

export default function VentaProductosForm() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [metodoPago, setMetodoPago] = useState<
    "efectivo" | "tarjeta" | "transferencia"
  >("efectivo");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState<
    number | null
  >(null);
  const [cantidadAAgregar, setCantidadAAgregar] = useState(1);

  // Cargar productos al montar
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await fetch("/api/productos");
      if (!response.ok) throw new Error("Error al cargar productos");
      const data = await response.json();
      setProductos(data.productos || []);
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudieron cargar los productos");
    }
  };

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.categoria &&
        p.categoria.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const agregarAlCarrito = () => {
    if (!productoSeleccionado) {
      setError("Selecciona un producto");
      return;
    }

    const producto = productos.find(
      (p) => p.id_producto === productoSeleccionado
    );
    if (!producto) return;

    const stockDisponible = producto.cantidad_disponible || 0;
    const cantidadEnCarrito =
      carrito.find((item) => item.producto.id_producto === producto.id_producto)
        ?.cantidad || 0;

    if (cantidadAAgregar + cantidadEnCarrito > stockDisponible) {
      setError(
        `Stock insuficiente. Disponible: ${stockDisponible}, ya en carrito: ${cantidadEnCarrito}`
      );
      return;
    }

    if (cantidadAAgregar <= 0) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }

    const subtotal = Number(producto.precio) * cantidadAAgregar;

    // Verificar si ya está en el carrito
    const indiceExistente = carrito.findIndex(
      (item) => item.producto.id_producto === producto.id_producto
    );

    if (indiceExistente >= 0) {
      // Actualizar cantidad
      const nuevoCarrito = [...carrito];
      nuevoCarrito[indiceExistente].cantidad += cantidadAAgregar;
      nuevoCarrito[indiceExistente].subtotal =
        Number(producto.precio) * nuevoCarrito[indiceExistente].cantidad;
      setCarrito(nuevoCarrito);
    } else {
      // Agregar nuevo item
      setCarrito([
        ...carrito,
        { producto, cantidad: cantidadAAgregar, subtotal },
      ]);
    }

    // Reset
    setProductoSeleccionado(null);
    setCantidadAAgregar(1);
    setError("");
  };

  const eliminarDelCarrito = (idProducto: number) => {
    setCarrito(
      carrito.filter((item) => item.producto.id_producto !== idProducto)
    );
  };

  const actualizarCantidad = (idProducto: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(idProducto);
      return;
    }

    const item = carrito.find((i) => i.producto.id_producto === idProducto);
    if (!item) return;

    const stockDisponible = item.producto.cantidad_disponible || 0;
    if (nuevaCantidad > stockDisponible) {
      setError(
        `Stock insuficiente para ${item.producto.nombre}. Máximo: ${stockDisponible}`
      );
      return;
    }

    const nuevoCarrito = carrito.map((i) =>
      i.producto.id_producto === idProducto
        ? {
            ...i,
            cantidad: nuevaCantidad,
            subtotal: Number(i.producto.precio) * nuevaCantidad,
          }
        : i
    );
    setCarrito(nuevoCarrito);
    setError("");
  };

  const calcularTotal = () => {
    return carrito.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (carrito.length === 0) {
      setError("Agrega al menos un producto al carrito");
      return;
    }

    setCargando(true);
    setError("");

    try {
      const productosParaEnviar = carrito.map((item) => ({
        id_producto: item.producto.id_producto,
        cantidad: item.cantidad,
      }));

      const response = await fetch("/api/ventas/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productos: productosParaEnviar,
          metodo_pago: metodoPago,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar la venta");
      }

      alert(
        `✅ ${data.message}\n\n💰 Total: $${data.data.monto_total}\n📦 Productos: ${data.data.productos}`
      );

      // Limpiar formulario
      setCarrito([]);
      setMetodoPago("efectivo");
      cargarProductos(); // Recargar para actualizar stock

      // Opcional: redirigir al historial
      // router.push("/veterinario/ventas/historial");
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message || "Error al registrar la venta");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sección de Selección de Productos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          📦 Seleccionar Productos
        </h2>

        {/* Búsqueda */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="🔍 Buscar producto o categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>

        {/* Lista de Productos */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto mb-4">
          {productosFiltrados.length === 0 ? (
            <p className="text-gray-600 text-center py-4">
              {busqueda
                ? "No se encontraron productos"
                : "No hay productos disponibles"}
            </p>
          ) : (
            productosFiltrados.map((producto) => {
              const stock = producto.cantidad_disponible || 0;
              const enCarrito =
                carrito.find(
                  (i) => i.producto.id_producto === producto.id_producto
                )?.cantidad || 0;
              const stockRestante = stock - enCarrito;

              return (
                <div
                  key={producto.id_producto}
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    productoSeleccionado === producto.id_producto
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                  } ${stockRestante === 0 ? "opacity-50" : ""}`}
                  onClick={() => setProductoSeleccionado(producto.id_producto)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {producto.nombre}
                      </h3>
                      {producto.descripcion && (
                        <p className="text-sm text-gray-700 mt-1">
                          {producto.descripcion}
                        </p>
                      )}
                      {producto.categoria && (
                        <span className="inline-block bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded mt-2">
                          {producto.categoria}
                        </span>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-green-700">
                        ${Number(producto.precio).toFixed(2)}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          stockRestante > 0 ? "text-gray-700" : "text-red-700"
                        }`}
                      >
                        Stock: {stockRestante}
                        {enCarrito > 0 && ` (${enCarrito} en carrito)`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Agregar al carrito */}
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            value={cantidadAAgregar}
            onChange={(e) => setCantidadAAgregar(parseInt(e.target.value) || 1)}
            className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
          />
          <button
            type="button"
            onClick={agregarAlCarrito}
            disabled={!productoSeleccionado}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors shadow-sm"
          >
            ➕ Agregar al Carrito
          </button>
        </div>
      </div>

      {/* Carrito y Pago */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          🛒 Carrito de Compra
        </h2>

        {carrito.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p className="text-4xl mb-2">🛒</p>
            <p className="font-medium">El carrito está vacío</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Items del carrito */}
            <div className="space-y-3 mb-6 max-h-[350px] overflow-y-auto">
              {carrito.map((item) => (
                <div
                  key={item.producto.id_producto}
                  className="border-2 border-gray-300 rounded-lg p-3 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 flex-1">
                      {item.producto.nombre}
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        eliminarDelCarrito(item.producto.id_producto)
                      }
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded p-1 ml-2"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          actualizarCantidad(
                            item.producto.id_producto,
                            item.cantidad - 1
                          )
                        }
                        className="bg-gray-300 hover:bg-gray-400 w-8 h-8 rounded flex items-center justify-center font-bold shadow-sm"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-900">
                        {item.cantidad}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          actualizarCantidad(
                            item.producto.id_producto,
                            item.cantidad + 1
                          )
                        }
                        className="bg-gray-300 hover:bg-gray-400 w-8 h-8 rounded flex items-center justify-center font-bold shadow-sm"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-700 font-medium">
                        ${Number(item.producto.precio).toFixed(2)} c/u
                      </p>
                      <p className="font-bold text-green-700 text-lg">
                        ${item.subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t-2 border-gray-300 pt-4 mb-6">
              <div className="flex justify-between items-center text-2xl font-bold">
                <span className="text-gray-900">Total:</span>
                <span className="text-green-700">
                  ${calcularTotal().toFixed(2)}
                </span>
              </div>
            </div>

            {/* Método de pago */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                💳 Método de Pago
              </label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value as any)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium shadow-sm"
                required
              >
                <option value="efectivo">💵 Efectivo</option>
                <option value="tarjeta">💳 Tarjeta</option>
                <option value="transferencia">🏦 Transferencia</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-lg mb-4 font-medium shadow-sm">
                {error}
              </div>
            )}

            {/* Botón de venta */}
            <button
              type="submit"
              disabled={cargando || carrito.length === 0}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold text-lg transition-colors shadow-md hover:shadow-lg"
            >
              {cargando ? "Procesando..." : "✅ Registrar Venta"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
