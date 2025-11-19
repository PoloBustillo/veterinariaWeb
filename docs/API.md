# 📡 Documentación de API - Clínica Veterinaria Dalton

Esta documentación describe todos los endpoints disponibles en la API del sistema de gestión veterinaria.

## 📋 Índice

- [Autenticación](#autenticación)
- [Mascotas](#mascotas)
- [Consultas](#consultas)
- [Caja](#caja)
- [Ventas](#ventas)
- [Catálogos](#catálogos)
- [Códigos de Estado](#códigos-de-estado)
- [Manejo de Errores](#manejo-de-errores)

---

## 🔐 Autenticación

### Registrar Usuario (Cliente)

**Endpoint:** `POST /api/auth/registro`

**Descripción:** Registra un nuevo cliente en el sistema.

**Request Body:**

```json
{
  "nombre_completo": "Juan Pérez García",
  "correo": "juan@ejemplo.com",
  "password": "password123",
  "telefono": "+52 222 123 4567",
  "direccion": "Calle Principal #123, Col. Centro"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id_dueno": 1,
    "nombre_completo": "Juan Pérez García",
    "correo": "juan@ejemplo.com",
    "telefono": "+52 222 123 4567",
    "direccion": "Calle Principal #123, Col. Centro",
    "fecha_registro": "2025-11-19T12:00:00.000Z",
    "activo": true
  }
}
```

**Errores:**

- `400` - Datos incompletos
- `409` - Correo ya registrado

---

### Iniciar Sesión

**Endpoint:** `POST /api/auth/login`

**Descripción:** Autentica un usuario y devuelve información de sesión.

**Request Body:**

```json
{
  "email": "juan@ejemplo.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "user": {
    "id": "1",
    "name": "Juan Pérez García",
    "email": "juan@ejemplo.com",
    "role": "dueno"
  }
}
```

**Errores:**

- `401` - Credenciales inválidas
- `404` - Usuario no encontrado

---

## 🐕 Mascotas

### Obtener Mascotas del Cliente

**Endpoint:** `GET /api/mascotas`

**Descripción:** Obtiene todas las mascotas del cliente autenticado.

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id_mascota": 1,
      "nombre": "Max",
      "especie": "Perro",
      "raza": "Labrador",
      "fecha_nacimiento": "2020-05-15",
      "sexo": "Macho",
      "color": "Dorado",
      "senias_particulares": "Mancha blanca en el pecho"
    }
  ]
}
```

---

### Registrar Nueva Mascota

**Endpoint:** `POST /api/mascotas`

**Descripción:** Registra una nueva mascota asociada al cliente autenticado.

**Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "nombre": "Max",
  "especie": "Perro",
  "raza": "Labrador",
  "fecha_nacimiento": "2020-05-15",
  "sexo": "Macho",
  "color": "Dorado",
  "senias_particulares": "Mancha blanca en el pecho"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id_mascota": 1,
    "nombre": "Max",
    "especie": "Perro",
    "raza": "Labrador",
    "fecha_nacimiento": "2020-05-15T00:00:00.000Z",
    "sexo": "Macho",
    "color": "Dorado",
    "senias_particulares": "Mancha blanca en el pecho"
  }
}
```

**Errores:**

- `400` - Datos incompletos o inválidos
- `401` - No autenticado

---

### Actualizar Mascota

**Endpoint:** `PUT /api/mascotas`

**Descripción:** Actualiza información de una mascota existente.

**Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "id_mascota": 1,
  "nombre": "Max Jr.",
  "raza": "Labrador Retriever",
  "color": "Dorado claro",
  "senias_particulares": "Mancha blanca en pecho y patas"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id_mascota": 1,
    "nombre": "Max Jr.",
    "raza": "Labrador Retriever",
    "color": "Dorado claro",
    "senias_particulares": "Mancha blanca en pecho y patas"
  }
}
```

**Errores:**

- `404` - Mascota no encontrada
- `403` - No autorizado para modificar esta mascota

---

### Eliminar Mascota

**Endpoint:** `DELETE /api/mascotas?id={id_mascota}`

**Descripción:** Elimina una mascota del sistema.

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `id` (required): ID de la mascota a eliminar

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Mascota eliminada correctamente"
}
```

**Errores:**

- `404` - Mascota no encontrada
- `403` - No autorizado

---

## 📅 Consultas

### Agendar Cita

**Endpoint:** `POST /api/agendar-cita`

**Descripción:** Agenda una nueva consulta veterinaria.

**Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "id_mascota": 1,
  "id_veterinario": 2,
  "fecha": "2025-11-25T10:00:00.000Z",
  "motivo": "Vacunación anual y chequeo general"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id_consulta": 15,
    "id_mascota": 1,
    "id_veterinario": 2,
    "fecha": "2025-11-25T10:00:00.000Z",
    "motivo": "Vacunación anual y chequeo general",
    "estado": "programada",
    "observaciones": null
  }
}
```

**Errores:**

- `400` - Datos incompletos
- `404` - Mascota o veterinario no encontrado
- `409` - Conflicto de horario

---

### Obtener Consultas (Veterinario)

**Endpoint:** `GET /api/consultas`

**Descripción:** Obtiene las consultas asignadas al veterinario autenticado.

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `estado` (optional): Filtrar por estado (programada, en_proceso, finalizada, cancelada)
- `fecha` (optional): Filtrar por fecha específica

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id_consulta": 15,
      "fecha": "2025-11-25T10:00:00.000Z",
      "motivo": "Vacunación anual",
      "estado": "programada",
      "mascota": {
        "id_mascota": 1,
        "nombre": "Max",
        "especie": "Perro",
        "raza": "Labrador"
      },
      "dueno": {
        "nombre_completo": "Juan Pérez",
        "telefono": "+52 222 123 4567"
      }
    }
  ]
}
```

---

### Obtener Consulta por ID

**Endpoint:** `GET /api/consultas/[id]`

**Descripción:** Obtiene los detalles completos de una consulta específica.

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id_consulta": 15,
    "fecha": "2025-11-25T10:00:00.000Z",
    "motivo": "Vacunación anual",
    "diagnostico": "Animal sano",
    "tratamiento": "Vacuna antirrábica",
    "estado": "finalizada",
    "observaciones": "Próxima cita en 1 año",
    "mascota": {
      "id_mascota": 1,
      "nombre": "Max",
      "especie": "Perro",
      "raza": "Labrador",
      "edad": "5 años"
    },
    "veterinario": {
      "id_veterinario": 2,
      "nombre_completo": "Dra. María López",
      "especialidad": "Medicina General"
    },
    "servicios": [
      {
        "id_servicio": 1,
        "nombre": "Consulta General",
        "cantidad": 1,
        "subtotal": "300.00"
      }
    ],
    "insumos": [
      {
        "id_insumo": 5,
        "nombre": "Vacuna Antirrábica",
        "cantidad": 1
      }
    ],
    "pagos": [
      {
        "id_pago": 20,
        "monto": "300.00",
        "metodo": "efectivo",
        "estado": "pagado"
      }
    ]
  }
}
```

---

### Actualizar Consulta

**Endpoint:** `PUT /api/consultas/[id]`

**Descripción:** Actualiza el estado y detalles de una consulta.

**Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "estado": "finalizada",
  "diagnostico": "Animal en buen estado de salud",
  "tratamiento": "Vacuna antirrábica aplicada",
  "observaciones": "Próxima cita en 1 año para refuerzo",
  "servicios": [
    {
      "id_servicio": 1,
      "cantidad": 1
    }
  ],
  "insumos": [
    {
      "id_insumo": 5,
      "cantidad": 1
    }
  ]
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id_consulta": 15,
    "estado": "finalizada",
    "diagnostico": "Animal en buen estado de salud",
    "tratamiento": "Vacuna antirrábica aplicada",
    "observaciones": "Próxima cita en 1 año para refuerzo"
  }
}
```

---

## 💰 Caja

### Obtener Caja Actual

**Endpoint:** `GET /api/caja`

**Descripción:** Obtiene la información de la caja actualmente abierta.

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id_caja": 10,
    "fecha_apertura": "2025-11-19T08:00:00.000Z",
    "saldo_inicial": "5000.00",
    "saldo_actual": "8750.00",
    "total_ingresos": "4500.00",
    "total_egresos": "750.00",
    "observaciones": null
  }
}
```

---

### Abrir Caja

**Endpoint:** `POST /api/caja`

**Descripción:** Abre una nueva caja para el día.

**Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "saldo_inicial": 5000.0,
  "observaciones": "Apertura de caja - turno matutino"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id_caja": 11,
    "fecha_apertura": "2025-11-19T08:00:00.000Z",
    "saldo_inicial": "5000.00",
    "observaciones": "Apertura de caja - turno matutino"
  }
}
```

**Errores:**

- `400` - Ya existe una caja abierta
- `400` - Saldo inicial inválido

---

### Cerrar Caja

**Endpoint:** `POST /api/caja/cerrar`

**Descripción:** Cierra la caja actual y calcula el saldo final.

**Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "observaciones": "Cierre de caja - turno matutino completado"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id_caja": 11,
    "fecha_apertura": "2025-11-19T08:00:00.000Z",
    "fecha_cierre": "2025-11-19T16:00:00.000Z",
    "saldo_inicial": "5000.00",
    "saldo_final": "8750.00",
    "total_ingresos": "4500.00",
    "total_egresos": "750.00",
    "observaciones": "Cierre de caja - turno matutino completado"
  }
}
```

---

### Registrar Movimiento de Caja

**Endpoint:** `POST /api/caja/movimientos`

**Descripción:** Registra un ingreso o egreso en la caja actual.

**Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "concepto": "Compra de materiales de limpieza",
  "monto": 250.0,
  "tipo": "Egreso"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id_movimiento": 45,
    "id_caja": 11,
    "fecha": "2025-11-19T12:00:00.000Z",
    "concepto": "Compra de materiales de limpieza",
    "monto": "250.00",
    "tipo": "Egreso"
  }
}
```

---

### Obtener Historial de Cajas

**Endpoint:** `GET /api/caja/historial`

**Descripción:** Obtiene el historial de cajas cerradas.

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `fecha_inicio` (optional): Filtrar desde esta fecha
- `fecha_fin` (optional): Filtrar hasta esta fecha
- `limit` (optional): Límite de resultados (default: 50)

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id_caja": 10,
      "fecha_apertura": "2025-11-18T08:00:00.000Z",
      "fecha_cierre": "2025-11-18T16:00:00.000Z",
      "saldo_inicial": "5000.00",
      "saldo_final": "7850.00",
      "total_ingresos": "3500.00",
      "total_egresos": "650.00",
      "diferencia": "2850.00"
    }
  ]
}
```

---

### Registrar Pago

**Endpoint:** `POST /api/caja/registrar-pago`

**Descripción:** Registra un pago asociado a una consulta o venta.

**Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "id_consulta": 15,
  "monto": 300.0,
  "metodo": "efectivo"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id_pago": 20,
    "id_consulta": 15,
    "fecha": "2025-11-19T12:00:00.000Z",
    "monto": "300.00",
    "metodo": "efectivo",
    "estado": "pagado",
    "id_caja": 11
  }
}
```

---

## 🛒 Ventas

### Registrar Venta de Productos

**Endpoint:** `POST /api/ventas/registrar`

**Descripción:** Registra una venta de productos con actualización de inventario.

**Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "productos": [
    {
      "id_producto": 3,
      "cantidad": 2
    },
    {
      "id_producto": 7,
      "cantidad": 1
    }
  ],
  "metodo_pago": "tarjeta"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id_pago": 21,
    "fecha": "2025-11-19T14:00:00.000Z",
    "monto_total": "850.00",
    "metodo": "tarjeta",
    "estado": "pagado",
    "ventas": [
      {
        "id_venta": 30,
        "id_producto": 3,
        "cantidad": 2,
        "subtotal": "500.00"
      },
      {
        "id_venta": 31,
        "id_producto": 7,
        "cantidad": 1,
        "subtotal": "350.00"
      }
    ]
  }
}
```

**Errores:**

- `400` - Productos insuficientes en inventario
- `404` - Producto no encontrado

---

### Historial de Ventas

**Endpoint:** `GET /api/ventas/historial`

**Descripción:** Obtiene el historial de ventas de productos.

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `fecha_inicio` (optional): Fecha de inicio
- `fecha_fin` (optional): Fecha de fin
- `limit` (optional): Límite de resultados (default: 50)

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id_venta": 30,
      "fecha": "2025-11-19T14:00:00.000Z",
      "producto": {
        "id_producto": 3,
        "nombre": "Alimento Premium Perro Adulto 15kg",
        "precio": "250.00"
      },
      "cantidad": 2,
      "subtotal": "500.00",
      "pago": {
        "id_pago": 21,
        "metodo": "tarjeta",
        "monto_total": "850.00"
      }
    }
  ]
}
```

---

## 📚 Catálogos

### Listar Clientes

**Endpoint:** `GET /api/clientes`

**Descripción:** Obtiene lista de clientes registrados.

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `activo` (optional): Filtrar por estado (true/false)
- `buscar` (optional): Buscar por nombre o email

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id_dueno": 1,
      "nombre_completo": "Juan Pérez García",
      "correo": "juan@ejemplo.com",
      "telefono": "+52 222 123 4567",
      "activo": true,
      "total_mascotas": 2
    }
  ]
}
```

---

### Listar Productos

**Endpoint:** `GET /api/productos`

**Descripción:** Obtiene lista de productos disponibles para venta.

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `categoria` (optional): Filtrar por categoría
- `disponibles` (optional): Solo productos con stock (true/false)

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id_producto": 3,
      "nombre": "Alimento Premium Perro Adulto 15kg",
      "descripcion": "Alimento balanceado para perros adultos",
      "precio": "250.00",
      "cantidad_disponible": 45,
      "categoria": "Alimento",
      "activo": true
    }
  ]
}
```

---

### Listar Servicios

**Endpoint:** `GET /api/servicios`

**Descripción:** Obtiene lista de servicios veterinarios disponibles.

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id_servicio": 1,
      "nombre": "Consulta General",
      "descripcion": "Consulta veterinaria general",
      "costo": "300.00",
      "duracion_estimada": 30
    }
  ]
}
```

---

### Listar Insumos

**Endpoint:** `GET /api/insumos`

**Descripción:** Obtiene lista de insumos médicos.

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id_insumo": 5,
      "nombre": "Vacuna Antirrábica",
      "descripcion": "Vacuna contra la rabia",
      "unidad": "dosis",
      "cantidad_disponible": 120,
      "costo_unitario": "85.00"
    }
  ]
}
```

---

## 📊 Códigos de Estado

| Código | Descripción                                             |
| ------ | ------------------------------------------------------- |
| 200    | OK - Solicitud exitosa                                  |
| 201    | Created - Recurso creado exitosamente                   |
| 400    | Bad Request - Datos inválidos o incompletos             |
| 401    | Unauthorized - No autenticado                           |
| 403    | Forbidden - No autorizado                               |
| 404    | Not Found - Recurso no encontrado                       |
| 409    | Conflict - Conflicto de recursos (ej: correo duplicado) |
| 500    | Internal Server Error - Error del servidor              |

---

## ⚠️ Manejo de Errores

Todos los errores siguen el siguiente formato:

```json
{
  "error": "Mensaje descriptivo del error",
  "details": "Información adicional (opcional)"
}
```

### Ejemplos de Errores Comunes

**401 Unauthorized:**

```json
{
  "error": "No autorizado. Inicie sesión para continuar."
}
```

**404 Not Found:**

```json
{
  "error": "Mascota no encontrada con ID: 999"
}
```

**400 Bad Request:**

```json
{
  "error": "Datos incompletos",
  "details": "Los campos 'nombre' y 'especie' son requeridos"
}
```

**409 Conflict:**

```json
{
  "error": "El correo electrónico ya está registrado"
}
```

---

## 🔒 Autenticación y Seguridad

### Headers Requeridos

Todas las rutas protegidas requieren el header de sesión de NextAuth:

```
Cookie: next-auth.session-token={token}
```

O en desarrollo:

```
Cookie: __Secure-next-auth.session-token={token}
```

### Renovación de Sesión

Las sesiones se renuevan automáticamente con cada petición. La duración por defecto es de 30 días.

### CORS

La API permite peticiones desde:

- `http://localhost:3000` (desarrollo)
- Tu dominio en producción

---

## 📝 Notas Adicionales

### Paginación (Futuro)

Para endpoints que retornen muchos resultados, se implementará paginación:

```
GET /api/consultas?page=1&limit=20
```

### Rate Limiting (Futuro)

Se implementarán límites de peticiones:

- 100 peticiones por minuto para usuarios autenticados
- 20 peticiones por minuto para usuarios no autenticados

### Webhooks (Futuro)

Próximamente se podrán configurar webhooks para eventos como:

- Nueva cita agendada
- Consulta finalizada
- Pago recibido

---

**Última actualización:** 19 de noviembre de 2025
