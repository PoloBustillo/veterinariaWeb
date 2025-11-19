# 🐾 Clínica Veterinaria Dalton - Sistema de Gestión

Sistema web completo para la gestión de una clínica veterinaria, desarrollado con Next.js 16, React 19, TypeScript, Prisma y PostgreSQL. Permite la administración de consultas, mascotas, citas, ventas, inventario y caja.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades](#-funcionalidades)
- [API Endpoints](#-api-endpoints)
- [Base de Datos](#-base-de-datos)
- [Autenticación](#-autenticación)
- [Despliegue](#-despliegue)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características

### 👤 Para Clientes (Dueños de Mascotas)

#### 🔐 Sistema de Autenticación Segura

- **Registro de cuenta** con validación de datos en tiempo real
- **Inicio de sesión** con email y contraseña encriptada (bcryptjs)
- **Sesiones persistentes** con JWT que duran 30 días
- **Recuperación de contraseña** (próximamente)
- **Verificación de email** (próximamente)

#### 🐕 Gestión Completa de Mascotas

- **Registrar mascotas** con información detallada:
  - Nombre, especie (Perro, Gato, Ave, Reptil, etc.)
  - Raza específica y fecha de nacimiento
  - Sexo (Macho/Hembra)
  - Color del pelaje/plumaje
  - Señas particulares para identificación
- **Editar información** de mascotas existentes en cualquier momento
- **Visualizar lista** de todas tus mascotas con tarjetas informativas
- **Múltiples dueños**: Sistema de dueño principal y acreditados
- **Cálculo automático de edad** basado en fecha de nacimiento
- **Historial médico completo** de cada mascota (próximamente)

#### 📅 Sistema de Agendamiento de Citas

- **Agendar consultas** seleccionando:
  - Mascota a atender
  - Veterinario de preferencia (con especialidades)
  - Fecha y hora disponible
  - Motivo de la consulta
- **Confirmación instantánea** de la cita agendada
- **Prevención de conflictos** de horario automática
- **Notificaciones** por email (próximamente)
- **Recordatorios** 24 horas antes de la cita (próximamente)

#### 📋 Gestión de Historial de Citas

- **Visualizar todas las citas**:
  - 🟡 **Programadas**: Próximas citas confirmadas
  - 🔵 **En proceso**: Consultas actualmente en atención
  - � **Finalizadas**: Historial de consultas completadas con diagnósticos
  - 🔴 **Canceladas**: Citas que fueron canceladas
- **Detalles completos** de cada consulta:
  - Fecha y hora de la cita
  - Veterinario asignado con especialidad
  - Motivo de consulta original
  - Diagnóstico y tratamiento (después de la consulta)
  - Servicios aplicados con costos
  - Insumos utilizados
  - Recetas y observaciones médicas
- **Filtros y búsqueda** por fecha, estado o mascota

#### ❌ Cancelación de Consultas

- **Cancelar citas programadas** con un solo clic
- **Confirmación de seguridad** para evitar cancelaciones accidentales
- **Política de cancelación** claramente visible
- **Historial de cancelaciones** para referencia futura

#### 📊 Dashboard Personal

- **Resumen de actividad**:
  - Número total de mascotas registradas
  - Próximas citas programadas
  - Últimas consultas realizadas
  - Pagos pendientes
- **Acceso rápido** a funcionalidades principales
- **Alertas importantes**: Vacunas próximas, seguimientos pendientes

---

### 👨‍⚕️ Para Veterinarios

#### 🏥 Dashboard Administrativo Completo

- **Métricas en tiempo real**:
  - Consultas del día (programadas, en proceso, finalizadas)
  - Ingresos del día y del mes
  - Estado de la caja (abierta/cerrada, saldo actual)
  - Productos con stock bajo
  - Citas pendientes de la semana
- **Estadísticas visuales** con gráficos (próximamente)
- **Calendario de citas** con vista diaria, semanal y mensual
- **Alertas importantes**: Urgencias, pagos pendientes, inventario bajo

#### 👥 Gestión Avanzada de Consultas

- **Agenda digital** con todas las citas del día:
  - Vista cronológica ordenada por hora
  - Información del paciente y dueño
  - Motivo de la consulta
  - Tiempo estimado de cada consulta
- **Atención de consultas**:
  - Cambiar estado a "en proceso" al iniciar
  - Acceso rápido al historial médico de la mascota
  - Registro de signos vitales (próximamente)
  - Captura de diagnóstico con editor de texto enriquecido
  - Registro detallado del tratamiento prescrito
  - Observaciones y recomendaciones para el dueño
- **Asociar servicios**:
  - Selección múltiple de servicios del catálogo
  - Precios automáticos desde la base de datos
  - Cantidades personalizables
  - Cálculo automático de subtotales
- **Finalizar consultas**:
  - Resumen completo de la atención
  - Generación automática de receta (próximamente)
  - Cambio de estado a "finalizada"
  - Notificación al cliente

#### 💊 Control de Inventario de Insumos

- **Registro de uso de insumos** durante consultas:
  - Selección de insumos del catálogo
  - Cantidad utilizada
  - Actualización automática del stock
  - Trazabilidad completa (qué insumo, en qué consulta, cuándo)
- **Catálogo de insumos médicos**:
  - Vacunas (antirrábica, múltiple, etc.)
  - Medicamentos (antibióticos, antiinflamatorios, etc.)
  - Material quirúrgico (suturas, gasas, etc.)
  - Anestésicos y sedantes
  - Sueros y soluciones
- **Alertas de stock bajo**: Notificaciones cuando el inventario es crítico
- **Historial de movimientos**: Entradas y salidas de cada insumo

#### 🔬 Gestión de Servicios Veterinarios

- **Catálogo de servicios** con precios actualizados:
  - Consulta general ($300)
  - Vacunación ($250)
  - Desparasitación ($180)
  - Cirugía menor ($2,500)
  - Cirugía mayor ($5,000+)
  - Rayos X ($800)
  - Análisis de laboratorio ($400-$1,200)
  - Hospitalización (por día)
  - Estética y baño
  - Eutanasia humanitaria
- **Precios dinámicos**: Actualizables desde la base de datos
- **Paquetes de servicios**: Ofertas especiales (próximamente)

#### 💰 Sistema Completo de Gestión de Caja

- **Apertura de caja**:
  - Registro de saldo inicial (efectivo en caja)
  - Fecha y hora automática de apertura
  - Identificación del responsable
  - Observaciones iniciales opcionales
- **Control de movimientos**:
  - � **Ingresos**: Pagos de consultas, ventas de productos, otros
  - 🔴 **Egresos**: Compras, gastos operativos, pagos a proveedores
  - Registro con concepto detallado
  - Monto exacto con dos decimales
  - Timestamp automático
- **Cierre de caja**:
  - Cálculo automático del saldo final
  - Comparación con saldo esperado
  - Detección de diferencias (faltantes o sobrantes)
  - Observaciones del cierre
  - Generación de reporte PDF (próximamente)
- **Historial completo**:
  - Todas las cajas (abiertas/cerradas)
  - Fechas de apertura y cierre
  - Saldos iniciales y finales
  - Total de ingresos y egresos por día
  - Diferencias detectadas
  - Exportación a Excel (próximamente)

#### 💵 Sistema de Registro de Pagos

- **Múltiples métodos de pago**:
  - 💵 Efectivo (con cálculo de cambio)
  - � Tarjeta de crédito/débito
  - 🏦 Transferencia bancaria
  - 📄 Cheque (con número de referencia)
  - 💰 Depósito bancario
- **Asociación automática** a caja abierta
- **Gestión de pagos pendientes**:
  - Lista de consultas sin pagar
  - Ventas pendientes de cobro
  - Asociación posterior a caja
- **Comprobantes**:
  - Generación de ticket de pago
  - Envío por email (próximamente)
  - Facturación electrónica (próximamente)
- **Historial de pagos**: Búsqueda por fecha, método, monto

#### 🛒 Punto de Venta (POS) para Productos

- **Sistema de carrito**:
  - Búsqueda rápida de productos por nombre o código
  - Agregar múltiples productos
  - Ajustar cantidades
  - Eliminar productos del carrito
  - Vista previa del total
- **Catálogo de productos**:
  - Alimentos (perros, gatos, aves, peces)
  - Juguetes y accesorios
  - Productos de higiene (shampoos, cepillos)
  - Collares, correas y arneses
  - Medicamentos de venta libre
  - Suplementos vitamínicos
- **Gestión de inventario**:
  - Actualización automática al vender
  - Alertas de stock bajo
  - Productos agotados marcados claramente
  - Control de lotes y fechas de vencimiento (próximamente)
- **Proceso de venta**:
  - Cálculo automático de totales
  - Aplicación de descuentos (próximamente)
  - Selección de método de pago
  - Generación de ticket
  - Registro en caja automático

#### 📊 Sistema de Reportes y Estadísticas

- **Reporte de ventas**:
  - Ventas del día, semana, mes
  - Productos más vendidos
  - Ingresos por categoría
  - Comparativas con períodos anteriores
  - Gráficos de tendencias (próximamente)
- **Reporte de consultas**:
  - Número de consultas por período
  - Distribución por tipo de servicio
  - Veterinarios con más consultas
  - Tasa de cancelación
- **Reporte de caja**:
  - Resumen diario de movimientos
  - Comparativa de ingresos/egresos
  - Diferencias detectadas
  - Arqueos de caja
- **Exportación**: PDF, Excel, CSV (próximamente)

---

### 🌟 Características Generales del Sistema

#### 🎨 Interfaz de Usuario Moderna

- **Diseño Material Design** con Tailwind CSS 4
- **Paleta de colores** profesional y accesible:
  - Azul primario para acciones principales
  - Verde para éxitos y confirmaciones
  - Rojo para alertas y eliminaciones
  - Gris para información secundaria
- **Tipografía optimizada** para lectura prolongada
- **Iconos intuitivos** de Heroicons y Lucide React
- **Animaciones suaves** para transiciones
- **Dark mode** (próximamente)

#### 📱 Diseño 100% Responsive

- **Optimizado para móviles**:
  - Touch-friendly buttons (mínimo 44x44px)
  - Menú hamburguesa en pantallas pequeñas
  - Tablas responsive con scroll horizontal
  - Formularios adaptados a pantallas táctiles
- **Tablet-friendly**: Aprovecha espacio adicional
- **Desktop**: Layout completo con sidebar y múltiples columnas
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)

#### 🔒 Seguridad Robusta

- **Autenticación**:
  - NextAuth.js v5 con strategy JWT
  - Contraseñas hasheadas con bcrypt (salt rounds: 10)
  - Tokens seguros con HMAC-SHA256
  - Expiración automática de sesiones
- **Autorización**:
  - Middleware de protección de rutas
  - Control de acceso basado en roles (RBAC)
  - Validación de permisos en cada endpoint
- **Validación de datos**:
  - Zod schemas en todas las APIs
  - Sanitización de inputs contra XSS
  - Prevención de SQL injection (Prisma ORM)
  - Rate limiting (próximamente)
- **Headers de seguridad**:
  - X-Frame-Options: SAMEORIGIN
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: origin-when-cross-origin
  - CSP (Content Security Policy) (próximamente)

#### ⚡ Rendimiento Optimizado

- **Next.js 16**:
  - Server-side rendering (SSR)
  - Static site generation (SSG) donde aplica
  - Incremental static regeneration (ISR)
  - API routes optimizadas
- **React 19**:
  - Concurrent rendering
  - Automatic batching
  - Transitions para mejor UX
- **Optimizaciones de imágenes**:
  - Next.js Image con lazy loading
  - Formatos modernos (AVIF, WebP)
  - Responsive images automáticas
  - Blur placeholder mientras carga
- **Code splitting automático**
- **Tree shaking** para bundle más pequeño
- **Compresión gzip/brotli** en producción

#### 🗄️ Base de Datos PostgreSQL

##### Arquitectura de Base de Datos

- **15 tablas relacionales** diseñadas bajo las formas normales de Codd:
  - **Primera Forma Normal (1NF)**: Eliminación de grupos repetitivos, valores atómicos en cada campo
  - **Segunda Forma Normal (2NF)**: Sin dependencias parciales, todas las columnas dependen de la clave primaria completa
  - **Tercera Forma Normal (3NF)**: Sin dependencias transitivas, eliminando redundancia de datos
  - **Ventajas de la normalización**:
    - Eliminación de duplicación de datos
    - Integridad de datos mejorada
    - Actualizaciones más eficientes
    - Menor consumo de espacio en disco
    - Facilidad de mantenimiento

##### Tablas Principales del Sistema

1. **Entidades Centrales**:

   - `Dueno`: Información de clientes con 10+ campos (nombre, email único, teléfono, dirección, contraseña encriptada)
   - `Mascota`: Registro de pacientes veterinarios (8 atributos incluyendo especie, raza, sexo, señas particulares)
   - `Veterinario`: Profesionales de la salud animal (cédula profesional única, especialidad, credenciales)
   - `Consulta`: Registro médico completo (fecha, motivo, diagnóstico, tratamiento, estado, observaciones)

2. **Tablas de Relación (Intermedias)**:

   - `Relacion_Dueno_Mascota`: Implementa relación N:N permitiendo múltiples dueños por mascota (principal/acreditado)
   - `Consulta_Servicio`: Asocia servicios aplicados a cada consulta con cantidad y subtotal
   - `Consulta_Insumo`: Rastrea insumos médicos utilizados en cada atención con trazabilidad completa

3. **Catálogos y Configuración**:

   - `Servicio`: Catálogo de servicios veterinarios con precios y duración estimada
   - `Insumo`: Inventario de materiales médicos (vacunas, medicamentos, material quirúrgico)
   - `Producto`: Catálogo de productos para venta con categorización y control de stock

4. **Gestión Financiera**:

   - `Caja`: Control de efectivo diario (apertura, cierre, saldos inicial/final)
   - `Caja_Movimiento`: Registro detallado de ingresos y egresos con concepto y timestamp
   - `Pago`: Transacciones con múltiples métodos y estados (pendiente, pagado, cancelado)
   - `Venta_Producto`: Detalle de ventas con actualización automática de inventario

5. **Tablas Auxiliares**:
   - `Dueno_Facturacion`: Datos fiscales para facturación electrónica (RFC, régimen fiscal, uso CFDI)
   - `Movimiento_Insumo`: Trazabilidad de entradas/salidas de insumos médicos
   - `Movimiento`: Log general de operaciones del sistema para auditoría

##### Integridad Referencial con Foreign Keys

- **26+ relaciones de integridad referencial** implementadas:
  - `ON DELETE: NO ACTION`: Previene eliminación accidental de registros relacionados
  - `ON UPDATE: NO ACTION`: Mantiene consistencia en actualizaciones
  - **Cascadas controladas**: En desarrollo para eliminación lógica en lugar de física
- **Ejemplos de Foreign Keys críticas**:

  ```sql
  -- Consulta debe tener mascota y veterinario válidos
  ALTER TABLE Consulta
    ADD CONSTRAINT fk_consulta_mascota
    FOREIGN KEY (id_mascota) REFERENCES Mascota(id_mascota);

  -- Pago debe estar asociado a caja existente
  ALTER TABLE Pago
    ADD CONSTRAINT fk_pago_caja
    FOREIGN KEY (id_caja) REFERENCES Caja(id_caja);

  -- Venta debe referenciar producto válido
  ALTER TABLE Venta_Producto
    ADD CONSTRAINT fk_venta_producto
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto);
  ```

- **Beneficios de la integridad referencial**:
  - Consistencia de datos garantizada a nivel de base de datos
  - Prevención de registros huérfanos
  - Validación automática de relaciones
  - Documentación implícita del modelo de datos

##### Índices Optimizados para Consultas Frecuentes

- **Índices únicos** para búsquedas rápidas:

  ```sql
  -- Evita duplicados y acelera búsquedas
  CREATE UNIQUE INDEX idx_dueno_correo ON Dueno(correo);
  CREATE UNIQUE INDEX idx_veterinario_cedula ON Veterinario(cedula);
  CREATE UNIQUE INDEX idx_veterinario_correo ON Veterinario(correo);
  ```

- **Índices compuestos** para consultas complejas:

  ```sql
  -- Optimiza búsqueda de consultas por fecha y estado
  CREATE INDEX idx_consulta_fecha_estado ON Consulta(fecha DESC, estado);

  -- Acelera búsqueda de mascotas por dueño
  CREATE INDEX idx_relacion_dueno ON Relacion_Dueno_Mascota(id_dueno, rol);

  -- Optimiza reportes de ventas por período
  CREATE INDEX idx_venta_fecha ON Venta_Producto(fecha DESC);
  ```

- **Índices de búsqueda de texto**:

  ```sql
  -- Búsqueda rápida de clientes por nombre
  CREATE INDEX idx_dueno_nombre ON Dueno
    USING gin(to_tsvector('spanish', nombre_completo));

  -- Búsqueda de productos por nombre y descripción
  CREATE INDEX idx_producto_texto ON Producto USING gin(
    to_tsvector('spanish', nombre || ' ' || COALESCE(descripcion, ''))
  );
  ```

- **Estrategias de indexación**:
  - Índices en columnas de foreign keys para JOINs rápidos
  - Índices en campos de fechas para filtros temporales
  - Índices parciales para consultas específicas (`WHERE activo = true`)
  - B-tree para igualdad y rangos, GIN para búsquedas de texto completo
  - **Análisis periódico**: Estadísticas actualizadas con `ANALYZE` para plan óptimo de consultas

##### Triggers para Actualización Automática de Inventario

- **Trigger de Venta de Productos**:

  ```sql
  -- Actualiza stock automáticamente al registrar venta
  CREATE OR REPLACE FUNCTION actualizar_inventario_venta()
  RETURNS TRIGGER AS $$
  BEGIN
    UPDATE Producto
    SET cantidad_disponible = cantidad_disponible - NEW.cantidad
    WHERE id_producto = NEW.id_producto;

    -- Validación de stock
    IF (SELECT cantidad_disponible FROM Producto
        WHERE id_producto = NEW.id_producto) < 0 THEN
      RAISE EXCEPTION 'Stock insuficiente para producto ID: %', NEW.id_producto;
    END IF;

    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER trg_actualizar_inventario_venta
  BEFORE INSERT ON Venta_Producto
  FOR EACH ROW EXECUTE FUNCTION actualizar_inventario_venta();
  ```

- **Trigger de Uso de Insumos**:

  ```sql
  -- Descuenta insumos médicos al usar en consultas
  CREATE OR REPLACE FUNCTION actualizar_inventario_insumo()
  RETURNS TRIGGER AS $$
  BEGIN
    UPDATE Insumo
    SET cantidad_disponible = cantidad_disponible - NEW.cantidad
    WHERE id_insumo = NEW.id_insumo;

    -- Log de movimiento
    INSERT INTO Movimiento_Insumo (id_insumo, fecha, cantidad, tipo, motivo)
    VALUES (NEW.id_insumo, NOW(), NEW.cantidad, 'Salida',
            'Uso en consulta ID: ' || NEW.id_consulta);

    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER trg_actualizar_inventario_insumo
  AFTER INSERT ON Consulta_Insumo
  FOR EACH ROW EXECUTE FUNCTION actualizar_inventario_insumo();
  ```

- **Trigger de Auditoría**:

  ```sql
  -- Registra cambios importantes para trazabilidad
  CREATE OR REPLACE FUNCTION log_cambios_caja()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO Movimiento (fecha, tipo, concepto, monto, referencia_tabla, referencia_id)
    VALUES (NOW(), 'caja_' || TG_OP,
            'Operación de caja: ' || TG_OP,
            COALESCE(NEW.saldo_final, NEW.saldo_inicial),
            'Caja', NEW.id_caja);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER trg_log_caja
  AFTER INSERT OR UPDATE ON Caja
  FOR EACH ROW EXECUTE FUNCTION log_cambios_caja();
  ```

- **Triggers adicionales implementados**:
  - Validación de saldo de caja antes de cierre
  - Cálculo automático de subtotales en servicios
  - Actualización de timestamp en modificaciones
  - Prevención de eliminación de registros con dependencias
  - Notificaciones de stock bajo (próximamente)

##### Views para Consultas Complejas (Próximamente)

- **Vista de Historial Médico Completo**:

  ```sql
  -- Consolida toda la información médica de una mascota
  CREATE VIEW v_historial_medico AS
  SELECT
    m.id_mascota,
    m.nombre AS mascota,
    m.especie,
    c.fecha,
    v.nombre_completo AS veterinario,
    c.motivo,
    c.diagnostico,
    c.tratamiento,
    STRING_AGG(DISTINCT s.nombre, ', ') AS servicios_aplicados,
    STRING_AGG(DISTINCT i.nombre, ', ') AS insumos_utilizados,
    COALESCE(SUM(p.monto), 0) AS total_pagado
  FROM Mascota m
  LEFT JOIN Consulta c ON m.id_mascota = c.id_mascota
  LEFT JOIN Veterinario v ON c.id_veterinario = v.id_veterinario
  LEFT JOIN Consulta_Servicio cs ON c.id_consulta = cs.id_consulta
  LEFT JOIN Servicio s ON cs.id_servicio = s.id_servicio
  LEFT JOIN Consulta_Insumo ci ON c.id_consulta = ci.id_consulta
  LEFT JOIN Insumo i ON ci.id_insumo = i.id_insumo
  LEFT JOIN Pago p ON c.id_consulta = p.id_consulta
  GROUP BY m.id_mascota, c.id_consulta, v.nombre_completo
  ORDER BY c.fecha DESC;
  ```

- **Vista de Reporte de Caja Diario**:

  ```sql
  -- Resumen financiero por día
  CREATE VIEW v_reporte_caja_diario AS
  SELECT
    DATE(cj.fecha_apertura) AS fecha,
    cj.saldo_inicial,
    SUM(CASE WHEN cm.tipo = 'Ingreso' THEN cm.monto ELSE 0 END) AS total_ingresos,
    SUM(CASE WHEN cm.tipo = 'Egreso' THEN cm.monto ELSE 0 END) AS total_egresos,
    cj.saldo_final,
    cj.saldo_final - cj.saldo_inicial AS diferencia
  FROM Caja cj
  LEFT JOIN Caja_Movimiento cm ON cj.id_caja = cm.id_caja
  GROUP BY cj.id_caja, DATE(cj.fecha_apertura);
  ```

- **Vista de Productos Más Vendidos**:

  ```sql
  -- Top productos por volumen de ventas
  CREATE VIEW v_productos_top_ventas AS
  SELECT
    p.id_producto,
    p.nombre,
    p.categoria,
    COUNT(vp.id_venta) AS num_ventas,
    SUM(vp.cantidad) AS total_vendido,
    SUM(vp.subtotal) AS ingresos_generados
  FROM Producto p
  INNER JOIN Venta_Producto vp ON p.id_producto = vp.id_producto
  WHERE vp.fecha >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY p.id_producto
  ORDER BY total_vendido DESC;
  ```

- **Vista de Alertas de Inventario**:
  ```sql
  -- Productos e insumos con stock crítico
  CREATE VIEW v_alertas_stock AS
  SELECT 'Producto' AS tipo, nombre, cantidad_disponible,
         CASE
           WHEN cantidad_disponible = 0 THEN 'CRÍTICO'
           WHEN cantidad_disponible < 5 THEN 'MUY BAJO'
           WHEN cantidad_disponible < 10 THEN 'BAJO'
         END AS nivel_alerta
  FROM Producto
  WHERE cantidad_disponible < 10 AND activo = true
  UNION ALL
  SELECT 'Insumo' AS tipo, nombre, cantidad_disponible,
         CASE
           WHEN cantidad_disponible = 0 THEN 'CRÍTICO'
           WHEN cantidad_disponible < 10 THEN 'MUY BAJO'
           WHEN cantidad_disponible < 20 THEN 'BAJO'
         END AS nivel_alerta
  FROM Insumo
  WHERE cantidad_disponible < 20
  ORDER BY cantidad_disponible ASC;
  ```

##### Backups Automáticos Configurables

- **Estrategia de Backup Multinivel**:

  1. **Backup Diario Completo**:

     ```bash
     # Script automatizado con cron (Linux/macOS)
     0 2 * * * pg_dump -U postgres veterinaria_db | gzip > \
       /backup/veterinaria_full_$(date +\%Y\%m\%d).sql.gz

     # Windows Task Scheduler
     pg_dump -U postgres -Fc veterinaria_db > \
       C:\backup\veterinaria_full_%date:~-4,4%%date:~-7,2%%date:~-10,2%.dump
     ```

  2. **Backup Incremental por Tabla**:

     ```bash
     # Solo tablas transaccionales (más frecuentes)
     pg_dump -U postgres -t Consulta -t Pago -t Venta_Producto \
       veterinaria_db | gzip > /backup/transacciones_$(date +\%H\%M).sql.gz
     ```

  3. **Backup Continuo con WAL Archiving**:

     ```postgresql
     -- postgresql.conf
     wal_level = replica
     archive_mode = on
     archive_command = 'cp %p /backup/wal_archive/%f'

     -- Permite Point-in-Time Recovery (PITR)
     ```

  4. **Replicación en Tiempo Real**:

     ```sql
     -- Configuración de réplica en standby
     CREATE PUBLICATION veterinaria_pub FOR ALL TABLES;

     -- En servidor secundario
     CREATE SUBSCRIPTION veterinaria_sub
       CONNECTION 'host=primary_host dbname=veterinaria_db'
       PUBLICATION veterinaria_pub;
     ```

- **Políticas de Retención**:

  - Backups diarios: conservar últimos 7 días
  - Backups semanales: conservar último mes (4 backups)
  - Backups mensuales: conservar último año (12 backups)
  - Backups anuales: conservar indefinidamente

- **Verificación Automática de Backups**:

  ```bash
  #!/bin/bash
  # Script de verificación de integridad
  BACKUP_FILE=$1

  # Crear base de datos temporal
  createdb -U postgres test_restore

  # Intentar restaurar
  if pg_restore -U postgres -d test_restore $BACKUP_FILE; then
    echo "✅ Backup válido: $BACKUP_FILE"
    # Verificar conteo de tablas
    psql -U postgres test_restore -c "\dt" | grep "15 rows"
  else
    echo "❌ Backup corrupto: $BACKUP_FILE"
    # Enviar alerta
  fi

  # Limpiar
  dropdb -U postgres test_restore
  ```

- **Almacenamiento Multi-ubicación**:

  - Local: SSD rápido para backups recientes
  - NAS: Almacenamiento de red para backups semanales
  - Cloud: AWS S3, Azure Blob, Google Cloud Storage para backups críticos
  - Geográficamente distribuido: Protección contra desastres

- **Restauración Rápida**:

  ```bash
  # Restauración completa
  pg_restore -U postgres -d veterinaria_db -c backup.dump

  # Restauración solo de datos (preservar schema)
  pg_restore -U postgres -d veterinaria_db -a backup.dump

  # Restauración de tablas específicas
  pg_restore -U postgres -d veterinaria_db -t Consulta -t Pago backup.dump

  # Restauración a punto en el tiempo (PITR)
  recovery_target_time = '2025-11-19 14:30:00'
  ```

##### Características Adicionales de la Base de Datos

- **Transacciones ACID**:

  - Atomicidad: Todas las operaciones o ninguna
  - Consistencia: Estado válido antes y después
  - Aislamiento: Transacciones concurrentes sin interferencia
  - Durabilidad: Cambios confirmados persisten

- **Niveles de Aislamiento**:

  - `READ COMMITTED`: Nivel por defecto, evita dirty reads
  - `REPEATABLE READ`: Para reportes financieros consistentes
  - `SERIALIZABLE`: Máxima consistencia para operaciones críticas

- **Particionamiento de Tablas** (próximamente):

  - Particionamiento de `Consulta` por fecha (anual/mensual)
  - Mejora rendimiento de consultas históricas
  - Facilita archivado de datos antiguos

- **Monitoreo y Mantenimiento**:

  ```sql
  -- Análisis de rendimiento de consultas
  SELECT query, calls, total_time, mean_time
  FROM pg_stat_statements
  ORDER BY total_time DESC LIMIT 10;

  -- Detección de tablas sin analizar
  SELECT schemaname, tablename, last_analyze
  FROM pg_stat_user_tables
  WHERE last_analyze IS NULL OR last_analyze < NOW() - INTERVAL '7 days';

  -- Monitoreo de conexiones
  SELECT datname, count(*)
  FROM pg_stat_activity
  GROUP BY datname;
  ```

## 🛠️ Tecnologías

### Frontend

- **Next.js 16.0.1** - Framework React con SSR y SSG
- **React 19.2.0** - Biblioteca de interfaces de usuario
- **TypeScript 5** - Superset tipado de JavaScript
- **Tailwind CSS 4** - Framework CSS utility-first
- **Heroicons** - Iconos SVG de alta calidad
- **Lucide React** - Iconos adicionales

### Backend

- **Next.js API Routes** - Endpoints RESTful
- **Prisma 6.18.0** - ORM para PostgreSQL
- **NextAuth.js v5** - Autenticación y sesiones
- **Bcryptjs** - Encriptación de contraseñas
- **Zod 4.1.12** - Validación de esquemas

### Base de Datos

- **PostgreSQL** - Base de datos relacional

### Herramientas de Desarrollo

- **TSX** - Ejecutor TypeScript
- **PostCSS** - Procesador CSS
- **Bun** - Runtime y gestor de paquetes

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js 20+** o **Bun** (recomendado)
- **PostgreSQL 14+**
- **Git**

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/PoloBustillo/veterinariaWeb.git
cd veterinariaWeb
```

### 2. Instalar dependencias

Con npm:

```bash
npm install
```

Con Bun (recomendado):

```bash
bun install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/veterinaria_db?schema=public"

# NextAuth.js
AUTH_SECRET="tu-clave-secreta-muy-segura-aqui"
AUTH_URL="http://localhost:3000"

# Opcional: Para producción
# NEXTAUTH_URL="https://tu-dominio.com"
```

### 4. Configurar la base de datos

#### Opción A: Usar script de creación

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE veterinaria_db;

# Ejecutar el script de creación
psql -U postgres -d veterinaria_db -f scripts/creation.sql

# Opcional: Ejecutar script de datos de prueba
psql -U postgres -d veterinaria_db -f scripts/seed.sql
```

#### Opción B: Usar Prisma Migrate

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones (si existen)
npx prisma migrate deploy

# O crear la base de datos desde el schema
npx prisma db push
```

### 5. Iniciar el servidor de desarrollo

Con npm:

```bash
npm run dev
```

Con Bun:

```bash
bun run dev
```

La aplicación estará disponible en `http://localhost:3000`

## ⚙️ Configuración

### Generación de AUTH_SECRET

Para generar una clave secreta segura:

```bash
openssl rand -base64 32
```

O usando Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Configuración de Prisma

El archivo `prisma.config.ts` configura el cliente de Prisma:

```typescript
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

### Middleware de Autenticación

El archivo `middleware.ts` protege las rutas según el rol del usuario:

- Rutas `/veterinario/*` - Solo veterinarios autenticados
- Rutas `/agendar-cita`, `/mis-citas`, `/mis-mascotas` - Solo clientes autenticados
- Otras rutas - Públicas

## 📁 Estructura del Proyecto

```
veterinariaWeb/
├── app/                          # Directorio principal de Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Endpoints de autenticación
│   │   ├── agendar-cita/         # API para agendar citas
│   │   ├── caja/                 # API de gestión de caja
│   │   ├── clientes/             # API de clientes
│   │   ├── consultas/            # API de consultas
│   │   ├── insumos/              # API de insumos
│   │   ├── mascotas/             # API de mascotas
│   │   ├── productos/            # API de productos
│   │   ├── servicios/            # API de servicios
│   │   └── ventas/               # API de ventas
│   ├── agendar-cita/             # Página para agendar citas
│   ├── components/               # Componentes compartidos
│   ├── login/                    # Página de inicio de sesión
│   ├── mis-citas/                # Gestión de citas del cliente
│   ├── mis-mascotas/             # Gestión de mascotas del cliente
│   ├── registrar-mascota/        # Registro de nuevas mascotas
│   ├── registro/                 # Página de registro de usuarios
│   ├── veterinario/              # Panel de veterinario
│   │   ├── caja/                 # Gestión de caja
│   │   ├── consultas/            # Gestión de consultas
│   │   ├── dashboard/            # Dashboard principal
│   │   └── ventas/               # Punto de venta
│   ├── layout.tsx                # Layout principal
│   ├── page.tsx                  # Página principal (landing)
│   └── globals.css               # Estilos globales
├── lib/                          # Utilidades y configuraciones
│   └── prisma.ts                 # Cliente de Prisma
├── prisma/                       # Configuración de Prisma ORM
│   └── schema.prisma             # Schema de base de datos
├── public/                       # Archivos estáticos
│   └── imgs/                     # Imágenes
├── scripts/                      # Scripts SQL
│   ├── creation.sql              # Script de creación de BD
│   └── seed.sql                  # Datos de prueba
├── types/                        # Definiciones de tipos TypeScript
│   └── next-auth.d.ts            # Tipos extendidos de NextAuth
├── auth.config.ts                # Configuración de NextAuth
├── auth.ts                       # Funciones de autenticación
├── middleware.ts                 # Middleware de Next.js
├── next.config.ts                # Configuración de Next.js
├── package.json                  # Dependencias del proyecto
├── prisma.config.ts              # Configuración de Prisma
└── tsconfig.json                 # Configuración de TypeScript
```

## 🎯 Funcionalidades

### Sistema de Autenticación

El sistema utiliza **NextAuth.js v5** (beta) con autenticación basada en credenciales:

- **Registro de usuarios** (clientes)
- **Login con email y contraseña**
- **Sesiones JWT** con duración de 30 días
- **Roles de usuario**: `dueno` (cliente) y `veterinario`
- **Protección de rutas** mediante middleware

### Gestión de Mascotas

Los clientes pueden:

- Registrar nuevas mascotas con información detallada
- Editar información de mascotas existentes
- Visualizar lista de sus mascotas
- Información incluye: nombre, especie, raza, fecha de nacimiento, sexo, color y señas particulares

### Sistema de Citas

- **Agendar consultas** seleccionando veterinario, mascota y fecha
- **Visualizar citas** programadas, en proceso, finalizadas y canceladas
- **Cancelar citas** programadas
- **Estados de consulta**: programada, en_proceso, finalizada, cancelada

### Gestión de Consultas (Veterinarios)

Los veterinarios pueden:

- Ver lista de consultas asignadas
- Actualizar estado de consultas
- Registrar diagnóstico, tratamiento y observaciones
- Asociar servicios con precios
- Registrar uso de insumos
- Finalizar consultas

### Sistema de Caja

- **Apertura de caja** con saldo inicial
- **Registro de movimientos** (ingresos y egresos)
- **Asociar pagos** a caja abierta
- **Cerrar caja** con saldo final calculado
- **Historial de cajas** con detalles de movimientos
- **Pagos pendientes** para asociar a caja actual

### Punto de Venta

- **Venta de productos** con sistema de carrito
- **Actualización automática** de inventario
- **Métodos de pago**: efectivo, tarjeta, transferencia, cheque, depósito
- **Historial de ventas** con filtros y detalles
- **Cálculo automático** de totales

### Gestión de Inventario

- **Control de productos** con cantidades disponibles
- **Control de insumos** médicos
- **Movimientos de inventario** rastreados
- **Alertas de stock** bajo (futuro)

## 🔌 API Endpoints

### Autenticación

```
POST /api/auth/registro          # Registrar nuevo cliente
POST /api/auth/login             # Iniciar sesión
GET  /api/debug/session          # Ver sesión actual (debug)
POST /api/debug/refresh-session  # Refrescar sesión (debug)
```

### Mascotas

```
GET    /api/mascotas             # Obtener mascotas del cliente
POST   /api/mascotas             # Registrar nueva mascota
PUT    /api/mascotas             # Actualizar mascota
DELETE /api/mascotas             # Eliminar mascota
```

### Consultas

```
GET  /api/consultas              # Listar consultas (veterinario)
GET  /api/consultas/[id]         # Obtener consulta específica
PUT  /api/consultas/[id]         # Actualizar consulta
POST /api/agendar-cita           # Agendar nueva cita (cliente)
```

### Caja

```
GET  /api/caja                   # Obtener caja actual
POST /api/caja                   # Abrir nueva caja
POST /api/caja/cerrar            # Cerrar caja actual
GET  /api/caja/historial         # Historial de cajas
GET  /api/caja/movimientos       # Movimientos de caja actual
POST /api/caja/movimientos       # Registrar movimiento
GET  /api/caja/pagos-pendientes  # Obtener pagos sin caja
POST /api/caja/asociar-pagos     # Asociar pagos a caja
POST /api/caja/registrar-pago    # Registrar nuevo pago
```

### Ventas

```
POST /api/ventas/registrar       # Registrar venta de productos
GET  /api/ventas/historial       # Historial de ventas
```

### Catálogos

```
GET /api/clientes                # Listar clientes
GET /api/productos               # Listar productos disponibles
GET /api/servicios               # Listar servicios
GET /api/insumos                 # Listar insumos
```

### Formato de Respuesta API

Todas las APIs siguen un formato consistente:

**Éxito:**

```json
{
  "success": true,
  "data": {
    /* datos */
  }
}
```

**Error:**

```json
{
  "error": "Mensaje de error descriptivo"
}
```

## 🗄️ Base de Datos

### Diagrama ER (Principales Entidades)

```
Dueno (Cliente)
  ↓ (1:N)
Relacion_Dueno_Mascota
  ↓ (N:1)
Mascota
  ↓ (1:N)
Consulta
  ↑ (N:1)
Veterinario

Consulta (1:N) → Consulta_Servicio ← (N:1) Servicio
Consulta (1:N) → Consulta_Insumo ← (N:1) Insumo
Consulta (1:N) → Pago

Caja (1:N) → Pago
Caja (1:N) → Caja_Movimiento

Producto (1:N) → Venta_Producto ← (N:1) Pago
```

### Principales Modelos

#### Dueno (Cliente)

- Información personal del dueño de mascotas
- Autenticación con password encriptado
- Datos de facturación opcionales

#### Mascota

- Información de la mascota (nombre, especie, raza, etc.)
- Relación N:N con dueños a través de `Relacion_Dueno_Mascota`

#### Veterinario

- Información profesional (cédula, especialidad)
- Autenticación con password
- Gestiona consultas

#### Consulta

- Registro de atención veterinaria
- Estados: programada, en_proceso, finalizada, cancelada
- Asocia servicios e insumos utilizados

#### Caja

- Control de apertura y cierre de caja
- Saldo inicial y final
- Registro de movimientos

#### Pago

- Registro de pagos por consultas o ventas
- Métodos: efectivo, tarjeta, transferencia, cheque, depósito
- Estados: pendiente, pagado, cancelado

#### Producto e Insumo

- Control de inventario
- Productos para venta
- Insumos para uso en consultas

### Enumeraciones (Enums)

```typescript
enum EstadoConsulta {
  programada,
  en_proceso,
  finalizada,
  cancelada,
}

enum EstadoPago {
  pendiente,
  pagado,
  cancelado,
}

enum MetodoPago {
  efectivo,
  tarjeta,
  transferencia,
  cheque,
  deposito,
}

enum TipoMovimiento {
  Ingreso,
  Egreso,
}

enum SexoMascota {
  Macho,
  Hembra,
}
```

## 🔐 Autenticación

### Configuración de NextAuth

El sistema usa **NextAuth.js v5** con la siguiente configuración:

#### Estrategia de Sesión

- **Tipo**: JWT (JSON Web Tokens)
- **Duración**: 30 días
- **Renovación**: Automática en cada petición

#### Roles de Usuario

**Cliente (dueno)**:

- Puede agendar citas
- Gestiona sus mascotas
- Ve su historial de consultas

**Veterinario**:

- Accede al dashboard administrativo
- Gestiona consultas
- Maneja caja y ventas
- Administra inventario

#### Protección de Rutas

```typescript
// middleware.ts
export default auth((req) => {
  const { auth } = req;
  const { pathname } = req.nextUrl;

  // Veterinarios: solo acceden a /veterinario/*
  // Clientes: no pueden acceder a /veterinario/*
  // Rutas públicas: accesibles sin autenticación
});
```

### Extensión de Tipos

```typescript
// types/next-auth.d.ts
declare module "next-auth" {
  interface User {
    id: string;
    role: "dueno" | "veterinario";
  }

  interface Session {
    user: User & {
      name?: string;
      email?: string;
    };
  }
}
```

## 🚢 Despliegue

### Variables de Entorno en Producción

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="clave-produccion-segura"
AUTH_URL="https://tu-dominio.com"
NODE_ENV="production"
```

### Despliegue en Vercel

1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno
3. Vercel detectará automáticamente Next.js
4. Deploy automático en cada push

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Despliegue en Railway / Render

1. Conecta tu repositorio
2. Configura PostgreSQL (Railway lo provee automáticamente)
3. Establece las variables de entorno
4. Define el comando de inicio:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

### Docker (Opcional)

```dockerfile
FROM node:20-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

### Estructura de Tests (Futuro)

```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e
```

## 📝 Scripts Disponibles

```json
{
  "dev": "next dev --webpack", // Desarrollo
  "build": "next build --webpack", // Construir para producción
  "start": "next start", // Iniciar servidor producción
  "postinstall": "prisma generate" // Generar cliente Prisma
}
```

### Scripts SQL Auxiliares

En la carpeta `scripts/`:

- `creation.sql` - Creación completa de la base de datos
- `seed.sql` - Datos de prueba
- `add_password_field.sql` - Agregar campos de contraseña
- `verificar-mascotas-sin-dueno.sql` - Verificación de integridad

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de Código

- **TypeScript strict mode** habilitado
- **ESLint** para linting
- **Prettier** para formateo
- **Convenciones de nombres**:
  - Componentes: PascalCase
  - Funciones: camelCase
  - Constantes: UPPER_SNAKE_CASE
  - Archivos: kebab-case o PascalCase para componentes

## 📄 Licencia

Este proyecto es de uso educativo para la materia de Base de Datos de la BUAP.

## 👥 Autores

- **Polo Bustillo** - [GitHub](https://github.com/PoloBustillo)

## 🙏 Agradecimientos

- **BUAP** - Benemérita Universidad Autónoma de Puebla
- Facultad de Ciencias de la Computación
- Materia: Base de Datos

## 📞 Contacto

Para preguntas o soporte:

- **GitHub Issues**: [veterinariaWeb/issues](https://github.com/PoloBustillo/veterinariaWeb/issues)

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!

**Desarrollado con ❤️ para la BUAP**
