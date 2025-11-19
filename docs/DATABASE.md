# 🗄️ Documentación de Base de Datos - Clínica Veterinaria Dalton

## 📋 Índice

- [Descripción General](#descripción-general)
- [Diagrama ER](#diagrama-er)
- [Tablas Principales](#tablas-principales)
- [Relaciones](#relaciones)
- [Enumeraciones (Enums)](#enumeraciones-enums)
- [Índices y Constraints](#índices-y-constraints)
- [Consultas Útiles](#consultas-útiles)
- [Procedimientos Almacenados](#procedimientos-almacenados)
- [Mantenimiento](#mantenimiento)

---

## 📖 Descripción General

La base de datos está diseñada para gestionar todas las operaciones de una clínica veterinaria, incluyendo:

- Gestión de clientes (dueños) y sus mascotas
- Agendamiento y seguimiento de consultas
- Control de inventario (productos e insumos)
- Sistema de caja y pagos
- Ventas de productos
- Registro de servicios veterinarios

### Características Técnicas

- **Motor:** PostgreSQL 14+
- **ORM:** Prisma 6.18.0
- **Codificación:** UTF-8
- **Zona Horaria:** UTC (timestamps con timezone)
- **Schemas:** public (default)

---

## 📊 Diagrama ER

### Diagrama Simplificado

```
┌─────────────┐         ┌──────────────────────┐         ┌──────────────┐
│    Dueno    │────────▶│ Relacion_Dueno_Masc. │◀────────│   Mascota    │
└─────────────┘         └──────────────────────┘         └──────────────┘
                                                                 │
                                                                 │
                                                                 ▼
                                                          ┌──────────────┐
                                                          │   Consulta   │
                                                          └──────────────┘
                                                                 │
                        ┌────────────────────────────────────────┼────────────────┐
                        │                                        │                │
                        ▼                                        ▼                ▼
              ┌─────────────────┐                      ┌─────────────┐    ┌──────────┐
              │ Consulta_Servic.│                      │ Consulta_In.│    │   Pago   │
              └─────────────────┘                      └─────────────┘    └──────────┘
                        │                                        │                │
                        ▼                                        ▼                ▼
              ┌─────────────────┐                      ┌─────────────┐    ┌──────────┐
              │    Servicio     │                      │   Insumo    │    │   Caja   │
              └─────────────────┘                      └─────────────┘    └──────────┘
                                                                                  │
                                                                                  ▼
                                                                       ┌─────────────────┐
                                                                       │ Caja_Movimiento │
                                                                       └─────────────────┘

┌──────────────┐         ┌─────────────────┐
│   Producto   │◀────────│ Venta_Producto  │
└──────────────┘         └─────────────────┘
                                  │
                                  ▼
                          ┌──────────┐
                          │   Pago   │
                          └──────────┘

┌──────────────┐
│ Veterinario  │──────────▶ Consulta
└──────────────┘
```

---

## 🗂️ Tablas Principales

### 1. Dueno (Clientes)

Almacena información de los dueños de mascotas.

**Tabla:** `Dueno`

| Campo           | Tipo         | Descripción           | Constraints                 |
| --------------- | ------------ | --------------------- | --------------------------- |
| id_dueno        | INT          | ID único (PK)         | PRIMARY KEY, AUTO_INCREMENT |
| nombre_completo | VARCHAR(150) | Nombre completo       | NOT NULL                    |
| telefono        | VARCHAR(30)  | Teléfono de contacto  | -                           |
| correo          | VARCHAR(150) | Email único           | UNIQUE                      |
| direccion       | VARCHAR(255) | Dirección física      | -                           |
| fecha_registro  | TIMESTAMP    | Fecha de registro     | DEFAULT NOW()               |
| activo          | BOOLEAN      | Estado activo         | DEFAULT TRUE                |
| password        | VARCHAR(255) | Contraseña encriptada | -                           |

**Relaciones:**

- 1:N con `Relacion_Dueno_Mascota`
- 1:N con `Dueno_Facturacion`

**Índices:**

- PRIMARY KEY: `id_dueno`
- UNIQUE: `correo`

---

### 2. Mascota

Información de las mascotas atendidas en la clínica.

**Tabla:** `Mascota`

| Campo               | Tipo         | Descripción                 | Constraints                 |
| ------------------- | ------------ | --------------------------- | --------------------------- |
| id_mascota          | INT          | ID único (PK)               | PRIMARY KEY, AUTO_INCREMENT |
| nombre              | VARCHAR(100) | Nombre de la mascota        | NOT NULL                    |
| especie             | VARCHAR(50)  | Especie (Perro, Gato, etc.) | NOT NULL                    |
| raza                | VARCHAR(100) | Raza específica             | -                           |
| fecha_nacimiento    | DATE         | Fecha de nacimiento         | -                           |
| sexo                | ENUM         | Macho o Hembra              | -                           |
| color               | VARCHAR(50)  | Color del pelaje            | -                           |
| senias_particulares | TEXT         | Características únicas      | -                           |

**Relaciones:**

- 1:N con `Relacion_Dueno_Mascota`
- 1:N con `Consulta`

**Índices:**

- PRIMARY KEY: `id_mascota`

---

### 3. Relacion_Dueno_Mascota

Tabla intermedia que relaciona dueños con mascotas (N:N).

**Tabla:** `Relacion_Dueno_Mascota`

| Campo       | Tipo | Descripción            | Constraints                 |
| ----------- | ---- | ---------------------- | --------------------------- |
| id_relacion | INT  | ID único (PK)          | PRIMARY KEY, AUTO_INCREMENT |
| id_dueno    | INT  | ID del dueño (FK)      | NOT NULL, FOREIGN KEY       |
| id_mascota  | INT  | ID de la mascota (FK)  | NOT NULL, FOREIGN KEY       |
| rol         | ENUM | principal o acreditado | NOT NULL                    |

**Relaciones:**

- N:1 con `Dueno`
- N:1 con `Mascota`

---

### 4. Veterinario

Información de los veterinarios que trabajan en la clínica.

**Tabla:** `Veterinario`

| Campo           | Tipo         | Descripción           | Constraints                 |
| --------------- | ------------ | --------------------- | --------------------------- |
| id_veterinario  | INT          | ID único (PK)         | PRIMARY KEY, AUTO_INCREMENT |
| nombre_completo | VARCHAR(150) | Nombre completo       | NOT NULL                    |
| cedula          | VARCHAR(50)  | Cédula profesional    | UNIQUE                      |
| especialidad    | VARCHAR(100) | Especialidad médica   | -                           |
| telefono        | VARCHAR(30)  | Teléfono              | -                           |
| correo          | VARCHAR(150) | Email único           | UNIQUE                      |
| activo          | BOOLEAN      | Estado activo         | DEFAULT TRUE                |
| password        | VARCHAR(255) | Contraseña encriptada | -                           |
| rol             | VARCHAR(50)  | Rol en el sistema     | DEFAULT 'veterinario'       |

**Relaciones:**

- 1:N con `Consulta`

**Índices:**

- PRIMARY KEY: `id_veterinario`
- UNIQUE: `cedula`, `correo`

---

### 5. Consulta

Registro de consultas veterinarias.

**Tabla:** `Consulta`

| Campo          | Tipo      | Descripción                 | Constraints                 |
| -------------- | --------- | --------------------------- | --------------------------- |
| id_consulta    | INT       | ID único (PK)               | PRIMARY KEY, AUTO_INCREMENT |
| id_mascota     | INT       | ID de la mascota (FK)       | NOT NULL, FOREIGN KEY       |
| id_veterinario | INT       | ID del veterinario (FK)     | NOT NULL, FOREIGN KEY       |
| fecha          | TIMESTAMP | Fecha y hora de la consulta | -                           |
| motivo         | TEXT      | Motivo de la consulta       | -                           |
| diagnostico    | TEXT      | Diagnóstico del veterinario | -                           |
| tratamiento    | TEXT      | Tratamiento prescrito       | -                           |
| estado         | ENUM      | Estado de la consulta       | DEFAULT 'programada'        |
| observaciones  | TEXT      | Observaciones adicionales   | -                           |

**Estados:**

- `programada`: Cita agendada
- `en_proceso`: Consulta en curso
- `finalizada`: Consulta completada
- `cancelada`: Cita cancelada

**Relaciones:**

- N:1 con `Mascota`
- N:1 con `Veterinario`
- 1:N con `Consulta_Servicio`
- 1:N con `Consulta_Insumo`
- 1:N con `Pago`

---

### 6. Servicio

Catálogo de servicios veterinarios disponibles.

**Tabla:** `Servicio`

| Campo             | Tipo          | Descripción           | Constraints                 |
| ----------------- | ------------- | --------------------- | --------------------------- |
| id_servicio       | INT           | ID único (PK)         | PRIMARY KEY, AUTO_INCREMENT |
| nombre            | VARCHAR(150)  | Nombre del servicio   | NOT NULL                    |
| descripcion       | TEXT          | Descripción detallada | -                           |
| costo             | DECIMAL(10,2) | Costo del servicio    | NOT NULL                    |
| duracion_estimada | INT           | Duración en minutos   | -                           |

**Ejemplos:**

- Consulta General - $300
- Vacunación - $250
- Cirugía Menor - $2500
- Rayos X - $800

---

### 7. Consulta_Servicio

Servicios aplicados en una consulta específica.

**Tabla:** `Consulta_Servicio`

| Campo                | Tipo          | Descripción            | Constraints                 |
| -------------------- | ------------- | ---------------------- | --------------------------- |
| id_consulta_servicio | INT           | ID único (PK)          | PRIMARY KEY, AUTO_INCREMENT |
| id_consulta          | INT           | ID de la consulta (FK) | NOT NULL, FOREIGN KEY       |
| id_servicio          | INT           | ID del servicio (FK)   | NOT NULL, FOREIGN KEY       |
| cantidad             | INT           | Cantidad de servicios  | DEFAULT 1                   |
| subtotal             | DECIMAL(10,2) | Costo total            | NOT NULL                    |

---

### 8. Insumo

Catálogo de insumos médicos utilizados en la clínica.

**Tabla:** `Insumo`

| Campo               | Tipo          | Descripción       | Constraints                 |
| ------------------- | ------------- | ----------------- | --------------------------- |
| id_insumo           | INT           | ID único (PK)     | PRIMARY KEY, AUTO_INCREMENT |
| nombre              | VARCHAR(150)  | Nombre del insumo | NOT NULL                    |
| descripcion         | TEXT          | Descripción       | -                           |
| unidad              | VARCHAR(50)   | Unidad de medida  | -                           |
| cantidad_disponible | INT           | Stock actual      | DEFAULT 0                   |
| costo_unitario      | DECIMAL(10,2) | Costo por unidad  | -                           |
| fecha_registro      | TIMESTAMP     | Fecha de registro | DEFAULT NOW()               |

**Ejemplos:**

- Vacuna Antirrábica (dosis)
- Suero Fisiológico (ml)
- Anestesia (ml)
- Vendas (unidad)

---

### 9. Consulta_Insumo

Insumos utilizados en una consulta específica.

**Tabla:** `Consulta_Insumo`

| Campo              | Tipo | Descripción            | Constraints                 |
| ------------------ | ---- | ---------------------- | --------------------------- |
| id_consulta_insumo | INT  | ID único (PK)          | PRIMARY KEY, AUTO_INCREMENT |
| id_consulta        | INT  | ID de la consulta (FK) | NOT NULL, FOREIGN KEY       |
| id_insumo          | INT  | ID del insumo (FK)     | NOT NULL, FOREIGN KEY       |
| cantidad           | INT  | Cantidad utilizada     | NOT NULL                    |

---

### 10. Producto

Catálogo de productos a la venta.

**Tabla:** `Producto`

| Campo               | Tipo          | Descripción            | Constraints                 |
| ------------------- | ------------- | ---------------------- | --------------------------- |
| id_producto         | INT           | ID único (PK)          | PRIMARY KEY, AUTO_INCREMENT |
| nombre              | VARCHAR(150)  | Nombre del producto    | NOT NULL                    |
| descripcion         | TEXT          | Descripción            | -                           |
| precio              | DECIMAL(10,2) | Precio de venta        | NOT NULL                    |
| cantidad_disponible | INT           | Stock actual           | DEFAULT 0                   |
| categoria           | VARCHAR(50)   | Categoría del producto | -                           |
| fecha_registro      | TIMESTAMP     | Fecha de registro      | DEFAULT NOW()               |
| activo              | BOOLEAN       | Estado activo          | DEFAULT TRUE                |

**Categorías comunes:**

- Alimento
- Juguetes
- Higiene
- Accesorios
- Medicamentos

---

### 11. Venta_Producto

Registro de ventas de productos.

**Tabla:** `Venta_Producto`

| Campo       | Tipo          | Descripción          | Constraints                 |
| ----------- | ------------- | -------------------- | --------------------------- |
| id_venta    | INT           | ID único (PK)        | PRIMARY KEY, AUTO_INCREMENT |
| id_producto | INT           | ID del producto (FK) | NOT NULL, FOREIGN KEY       |
| fecha       | TIMESTAMP     | Fecha de venta       | DEFAULT NOW()               |
| cantidad    | INT           | Cantidad vendida     | NOT NULL                    |
| subtotal    | DECIMAL(10,2) | Total de la venta    | NOT NULL                    |
| id_pago     | INT           | ID del pago (FK)     | FOREIGN KEY                 |

---

### 12. Pago

Registro de pagos (consultas y ventas).

**Tabla:** `Pago`

| Campo       | Tipo          | Descripción                   | Constraints                 |
| ----------- | ------------- | ----------------------------- | --------------------------- |
| id_pago     | INT           | ID único (PK)                 | PRIMARY KEY, AUTO_INCREMENT |
| id_consulta | INT           | ID de consulta (FK, opcional) | FOREIGN KEY                 |
| fecha       | TIMESTAMP     | Fecha del pago                | DEFAULT NOW()               |
| monto       | DECIMAL(10,2) | Monto total                   | NOT NULL                    |
| metodo      | ENUM          | Método de pago                | NOT NULL                    |
| estado      | ENUM          | Estado del pago               | DEFAULT 'pendiente'         |
| id_caja     | INT           | ID de la caja (FK)            | FOREIGN KEY                 |

**Métodos de Pago:**

- efectivo
- tarjeta
- transferencia
- cheque
- deposito

**Estados:**

- pendiente
- pagado
- cancelado

---

### 13. Caja

Control de caja diaria.

**Tabla:** `Caja`

| Campo          | Tipo          | Descripción       | Constraints                 |
| -------------- | ------------- | ----------------- | --------------------------- |
| id_caja        | INT           | ID único (PK)     | PRIMARY KEY, AUTO_INCREMENT |
| fecha_apertura | TIMESTAMP     | Fecha de apertura | DEFAULT NOW()               |
| fecha_cierre   | TIMESTAMP     | Fecha de cierre   | -                           |
| saldo_inicial  | DECIMAL(10,2) | Saldo al abrir    | NOT NULL                    |
| saldo_final    | DECIMAL(10,2) | Saldo al cerrar   | -                           |
| observaciones  | TEXT          | Notas adicionales | -                           |

**Relaciones:**

- 1:N con `Pago`
- 1:N con `Caja_Movimiento`

---

### 14. Caja_Movimiento

Movimientos de efectivo (ingresos y egresos).

**Tabla:** `Caja_Movimiento`

| Campo         | Tipo          | Descripción          | Constraints                 |
| ------------- | ------------- | -------------------- | --------------------------- |
| id_movimiento | INT           | ID único (PK)        | PRIMARY KEY, AUTO_INCREMENT |
| id_caja       | INT           | ID de la caja (FK)   | NOT NULL, FOREIGN KEY       |
| fecha         | TIMESTAMP     | Fecha del movimiento | DEFAULT NOW()               |
| concepto      | VARCHAR(150)  | Descripción          | NOT NULL                    |
| monto         | DECIMAL(10,2) | Cantidad             | NOT NULL                    |
| tipo          | ENUM          | Ingreso o Egreso     | NOT NULL                    |

---

### 15. Dueno_Facturacion

Datos fiscales de clientes para facturación.

**Tabla:** `Dueno_Facturacion`

| Campo          | Tipo         | Descripción       | Constraints                 |
| -------------- | ------------ | ----------------- | --------------------------- |
| id_facturacion | INT          | ID único (PK)     | PRIMARY KEY, AUTO_INCREMENT |
| id_dueno       | INT          | ID del dueño (FK) | NOT NULL, FOREIGN KEY       |
| rfc            | VARCHAR(13)  | RFC               | NOT NULL                    |
| razon_social   | VARCHAR(180) | Razón social      | NOT NULL                    |
| tipo_persona   | ENUM         | física o moral    | NOT NULL                    |
| regimen_fiscal | VARCHAR(100) | Régimen fiscal    | NOT NULL                    |
| uso_cfdi       | VARCHAR(50)  | Uso del CFDI      | NOT NULL                    |

---

## 🔗 Relaciones

### Relaciones Uno a Muchos (1:N)

1. **Dueno → Relacion_Dueno_Mascota**

   - Un dueño puede tener múltiples mascotas

2. **Mascota → Relacion_Dueno_Mascota**

   - Una mascota puede tener múltiples dueños (principal y acreditados)

3. **Mascota → Consulta**

   - Una mascota puede tener múltiples consultas

4. **Veterinario → Consulta**

   - Un veterinario atiende múltiples consultas

5. **Consulta → Consulta_Servicio**

   - Una consulta puede incluir múltiples servicios

6. **Consulta → Consulta_Insumo**

   - Una consulta puede usar múltiples insumos

7. **Consulta → Pago**

   - Una consulta puede tener múltiples pagos (parcialidades)

8. **Caja → Pago**

   - Una caja registra múltiples pagos

9. **Caja → Caja_Movimiento**

   - Una caja tiene múltiples movimientos

10. **Producto → Venta_Producto**
    - Un producto puede ser vendido múltiples veces

### Relaciones Muchos a Muchos (N:N)

1. **Dueno ←→ Mascota** (a través de Relacion_Dueno_Mascota)

   - Un dueño puede tener varias mascotas
   - Una mascota puede tener varios dueños

2. **Consulta ←→ Servicio** (a través de Consulta_Servicio)

   - Una consulta puede incluir varios servicios
   - Un servicio puede ser usado en varias consultas

3. **Consulta ←→ Insumo** (a través de Consulta_Insumo)
   - Una consulta puede usar varios insumos
   - Un insumo puede ser usado en varias consultas

---

## 📝 Enumeraciones (Enums)

### EstadoConsulta

```sql
CREATE TYPE EstadoConsulta AS ENUM (
  'programada',
  'en_proceso',
  'finalizada',
  'cancelada'
);
```

### EstadoPago

```sql
CREATE TYPE EstadoPago AS ENUM (
  'pendiente',
  'pagado',
  'cancelado'
);
```

### MetodoPago

```sql
CREATE TYPE MetodoPago AS ENUM (
  'efectivo',
  'tarjeta',
  'transferencia',
  'cheque',
  'deposito'
);
```

### TipoMovimiento

```sql
CREATE TYPE TipoMovimiento AS ENUM (
  'Ingreso',
  'Egreso'
);
```

### SexoMascota

```sql
CREATE TYPE SexoMascota AS ENUM (
  'Macho',
  'Hembra'
);
```

### RolDueno

```sql
CREATE TYPE RolDueno AS ENUM (
  'principal',
  'acreditado'
);
```

### TipoPersona

```sql
CREATE TYPE TipoPersona AS ENUM (
  'fisica',
  'moral'
);
```

---

## 🔑 Índices y Constraints

### Índices Principales

```sql
-- Índices únicos
CREATE UNIQUE INDEX idx_dueno_correo ON Dueno(correo);
CREATE UNIQUE INDEX idx_veterinario_cedula ON Veterinario(cedula);
CREATE UNIQUE INDEX idx_veterinario_correo ON Veterinario(correo);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_consulta_fecha ON Consulta(fecha);
CREATE INDEX idx_consulta_estado ON Consulta(estado);
CREATE INDEX idx_consulta_mascota ON Consulta(id_mascota);
CREATE INDEX idx_consulta_veterinario ON Consulta(id_veterinario);
CREATE INDEX idx_pago_fecha ON Pago(fecha);
CREATE INDEX idx_pago_estado ON Pago(estado);
CREATE INDEX idx_pago_caja ON Pago(id_caja);
CREATE INDEX idx_venta_fecha ON Venta_Producto(fecha);
CREATE INDEX idx_caja_fecha ON Caja(fecha_apertura);
```

### Foreign Keys

Todas las relaciones están aseguradas con foreign keys con las siguientes reglas:

- `ON DELETE`: NO ACTION (previene eliminación accidental)
- `ON UPDATE`: NO ACTION

---

## 🔍 Consultas Útiles

### 1. Mascotas de un Cliente con sus Consultas

```sql
SELECT
  m.nombre AS mascota,
  m.especie,
  m.raza,
  COUNT(c.id_consulta) AS total_consultas,
  MAX(c.fecha) AS ultima_consulta
FROM Dueno d
INNER JOIN Relacion_Dueno_Mascota rdm ON d.id_dueno = rdm.id_dueno
INNER JOIN Mascota m ON rdm.id_mascota = m.id_mascota
LEFT JOIN Consulta c ON m.id_mascota = c.id_mascota
WHERE d.correo = 'juan@ejemplo.com'
GROUP BY m.id_mascota, m.nombre, m.especie, m.raza
ORDER BY ultima_consulta DESC;
```

### 2. Agenda del Veterinario por Fecha

```sql
SELECT
  c.fecha,
  c.estado,
  m.nombre AS mascota,
  m.especie,
  d.nombre_completo AS dueno,
  d.telefono,
  c.motivo
FROM Consulta c
INNER JOIN Mascota m ON c.id_mascota = m.id_mascota
INNER JOIN Relacion_Dueno_Mascota rdm ON m.id_mascota = rdm.id_mascota AND rdm.rol = 'principal'
INNER JOIN Dueno d ON rdm.id_dueno = d.id_dueno
WHERE c.id_veterinario = 1
  AND c.fecha::DATE = '2025-11-20'
ORDER BY c.fecha;
```

### 3. Reporte de Caja Diaria

```sql
SELECT
  cj.id_caja,
  cj.fecha_apertura,
  cj.fecha_cierre,
  cj.saldo_inicial,
  cj.saldo_final,
  SUM(CASE WHEN cm.tipo = 'Ingreso' THEN cm.monto ELSE 0 END) AS total_ingresos,
  SUM(CASE WHEN cm.tipo = 'Egreso' THEN cm.monto ELSE 0 END) AS total_egresos,
  (cj.saldo_final - cj.saldo_inicial) AS diferencia
FROM Caja cj
LEFT JOIN Caja_Movimiento cm ON cj.id_caja = cm.id_caja
WHERE cj.fecha_apertura::DATE = CURRENT_DATE
GROUP BY cj.id_caja;
```

### 4. Productos Más Vendidos

```sql
SELECT
  p.nombre,
  p.categoria,
  SUM(vp.cantidad) AS total_vendido,
  SUM(vp.subtotal) AS ingresos_totales
FROM Producto p
INNER JOIN Venta_Producto vp ON p.id_producto = vp.id_producto
WHERE vp.fecha >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY p.id_producto, p.nombre, p.categoria
ORDER BY total_vendido DESC
LIMIT 10;
```

### 5. Ingresos por Tipo (Consultas vs Ventas)

```sql
SELECT
  'Consultas' AS tipo,
  COUNT(*) AS cantidad,
  SUM(p.monto) AS total
FROM Pago p
WHERE p.id_consulta IS NOT NULL
  AND p.fecha >= CURRENT_DATE - INTERVAL '30 days'
  AND p.estado = 'pagado'

UNION ALL

SELECT
  'Ventas' AS tipo,
  COUNT(DISTINCT vp.id_pago) AS cantidad,
  SUM(vp.subtotal) AS total
FROM Venta_Producto vp
INNER JOIN Pago p ON vp.id_pago = p.id_pago
WHERE vp.fecha >= CURRENT_DATE - INTERVAL '30 days'
  AND p.estado = 'pagado';
```

### 6. Inventario con Alertas de Stock Bajo

```sql
-- Productos
SELECT
  'Producto' AS tipo,
  nombre,
  cantidad_disponible,
  CASE
    WHEN cantidad_disponible = 0 THEN 'SIN STOCK'
    WHEN cantidad_disponible < 10 THEN 'STOCK BAJO'
    ELSE 'OK'
  END AS estado
FROM Producto
WHERE cantidad_disponible < 20
  AND activo = TRUE
ORDER BY cantidad_disponible ASC;

-- Insumos
SELECT
  'Insumo' AS tipo,
  nombre,
  cantidad_disponible,
  unidad,
  CASE
    WHEN cantidad_disponible = 0 THEN 'SIN STOCK'
    WHEN cantidad_disponible < 10 THEN 'STOCK BAJO'
    ELSE 'OK'
  END AS estado
FROM Insumo
WHERE cantidad_disponible < 20
ORDER BY cantidad_disponible ASC;
```

### 7. Historial Completo de una Mascota

```sql
SELECT
  c.fecha,
  c.estado,
  v.nombre_completo AS veterinario,
  c.motivo,
  c.diagnostico,
  c.tratamiento,
  STRING_AGG(DISTINCT s.nombre, ', ') AS servicios,
  STRING_AGG(DISTINCT ins.nombre, ', ') AS insumos_usados,
  COALESCE(SUM(DISTINCT p.monto), 0) AS total_pagado
FROM Consulta c
INNER JOIN Veterinario v ON c.id_veterinario = v.id_veterinario
LEFT JOIN Consulta_Servicio cs ON c.id_consulta = cs.id_consulta
LEFT JOIN Servicio s ON cs.id_servicio = s.id_servicio
LEFT JOIN Consulta_Insumo ci ON c.id_consulta = ci.id_consulta
LEFT JOIN Insumo ins ON ci.id_insumo = ins.id_insumo
LEFT JOIN Pago p ON c.id_consulta = p.id_consulta AND p.estado = 'pagado'
WHERE c.id_mascota = 1
GROUP BY c.id_consulta, v.nombre_completo
ORDER BY c.fecha DESC;
```

---

## 🛠️ Procedimientos Almacenados

### Función: Calcular Edad de Mascota

```sql
CREATE OR REPLACE FUNCTION calcular_edad_mascota(fecha_nac DATE)
RETURNS VARCHAR AS $$
DECLARE
  anos INT;
  meses INT;
BEGIN
  anos := EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_nac));
  meses := EXTRACT(MONTH FROM AGE(CURRENT_DATE, fecha_nac));

  IF anos > 0 THEN
    RETURN anos || ' año(s) ' || meses || ' mes(es)';
  ELSE
    RETURN meses || ' mes(es)';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Uso
SELECT nombre, calcular_edad_mascota(fecha_nacimiento) AS edad
FROM Mascota;
```

### Trigger: Actualizar Inventario en Venta

```sql
CREATE OR REPLACE FUNCTION actualizar_inventario_venta()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE Producto
  SET cantidad_disponible = cantidad_disponible - NEW.cantidad
  WHERE id_producto = NEW.id_producto;

  IF (SELECT cantidad_disponible FROM Producto WHERE id_producto = NEW.id_producto) < 0 THEN
    RAISE EXCEPTION 'Stock insuficiente para el producto %', NEW.id_producto;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_inventario_venta
BEFORE INSERT ON Venta_Producto
FOR EACH ROW
EXECUTE FUNCTION actualizar_inventario_venta();
```

### Trigger: Actualizar Inventario en Uso de Insumo

```sql
CREATE OR REPLACE FUNCTION actualizar_inventario_insumo()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE Insumo
  SET cantidad_disponible = cantidad_disponible - NEW.cantidad
  WHERE id_insumo = NEW.id_insumo;

  IF (SELECT cantidad_disponible FROM Insumo WHERE id_insumo = NEW.id_insumo) < 0 THEN
    RAISE EXCEPTION 'Stock insuficiente para el insumo %', NEW.id_insumo;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_inventario_insumo
BEFORE INSERT ON Consulta_Insumo
FOR EACH ROW
EXECUTE FUNCTION actualizar_inventario_insumo();
```

---

## 🧹 Mantenimiento

### Backup de Base de Datos

```bash
# Backup completo
pg_dump -U postgres veterinaria_db > backup_$(date +%Y%m%d).sql

# Backup con compresión
pg_dump -U postgres -Fc veterinaria_db > backup_$(date +%Y%m%d).dump

# Backup solo de datos
pg_dump -U postgres --data-only veterinaria_db > datos_$(date +%Y%m%d).sql

# Backup de una tabla específica
pg_dump -U postgres -t Consulta veterinaria_db > consultas_backup.sql
```

### Restaurar Base de Datos

```bash
# Desde SQL
psql -U postgres veterinaria_db < backup_20251119.sql

# Desde dump comprimido
pg_restore -U postgres -d veterinaria_db backup_20251119.dump
```

### Optimización

```sql
-- Analizar y optimizar estadísticas
ANALYZE;

-- Reindexar base de datos
REINDEX DATABASE veterinaria_db;

-- Vacuum para limpiar espacio
VACUUM ANALYZE;

-- Vacuum full (requiere más tiempo)
VACUUM FULL ANALYZE;
```

### Monitoreo de Tamaño

```sql
-- Tamaño de la base de datos
SELECT pg_size_pretty(pg_database_size('veterinaria_db'));

-- Tamaño de cada tabla
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Verificación de Integridad

```sql
-- Mascotas sin dueño
SELECT m.*
FROM Mascota m
LEFT JOIN Relacion_Dueno_Mascota rdm ON m.id_mascota = rdm.id_mascota
WHERE rdm.id_relacion IS NULL;

-- Pagos sin caja (pendientes de asignar)
SELECT p.*
FROM Pago p
WHERE p.id_caja IS NULL
  AND p.estado = 'pagado'
ORDER BY p.fecha DESC;

-- Consultas sin pago
SELECT c.*
FROM Consulta c
LEFT JOIN Pago p ON c.id_consulta = p.id_consulta AND p.estado = 'pagado'
WHERE c.estado = 'finalizada'
  AND p.id_pago IS NULL
ORDER BY c.fecha DESC;
```

---

## 📊 Estadísticas Útiles

### Dashboard de Administración

```sql
-- Resumen general
SELECT
  (SELECT COUNT(*) FROM Dueno WHERE activo = TRUE) AS clientes_activos,
  (SELECT COUNT(*) FROM Mascota) AS mascotas_registradas,
  (SELECT COUNT(*) FROM Veterinario WHERE activo = TRUE) AS veterinarios_activos,
  (SELECT COUNT(*) FROM Consulta WHERE fecha::DATE = CURRENT_DATE) AS consultas_hoy,
  (SELECT COUNT(*) FROM Consulta WHERE estado = 'programada' AND fecha > NOW()) AS citas_pendientes,
  (SELECT COALESCE(SUM(monto), 0) FROM Pago WHERE fecha::DATE = CURRENT_DATE AND estado = 'pagado') AS ingresos_hoy;
```

---

**Última actualización:** 19 de noviembre de 2025
