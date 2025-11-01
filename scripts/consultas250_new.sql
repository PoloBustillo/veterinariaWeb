
-- 1. Listar todas las mascotas con información del dueño
SELECT m.id_mascota, m.nombre, m.especie, m.raza, d.nombre_completo, d.telefono, d.correo
FROM "dalton"."Mascota" m
INNER JOIN "dalton"."Relacion_Dueno_Mascota" rdm ON m.id_mascota = rdm.id_mascota
INNER JOIN "dalton"."Dueno" d ON rdm.id_dueno = d.id_dueno
ORDER BY d.nombre_completo, m.nombre;

-- 2. Consultas realizadas con información del veterinario y mascota
SELECT c.id_consulta, c.fecha, m.nombre AS mascota, m.especie, v.nombre_completo AS veterinario, 
       v.especialidad, c.motivo, c.diagnostico, c.estado
FROM "dalton"."Consulta" c
INNER JOIN "dalton"."Mascota" m ON c.id_mascota = m.id_mascota
INNER JOIN "dalton"."Veterinario" v ON c.id_veterinario = v.id_veterinario
ORDER BY c.fecha DESC;

-- 3. Servicios prestados en cada consulta con costos
SELECT c.id_consulta, m.nombre AS mascota, c.fecha, s.nombre AS servicio, 
       cs.cantidad, s.costo, (cs.cantidad * s.costo) AS subtotal
FROM "dalton"."Consulta_Servicio" cs
INNER JOIN "dalton"."Consulta" c ON cs.id_consulta = c.id_consulta
INNER JOIN "dalton"."Mascota" m ON c.id_mascota = m.id_mascota
INNER JOIN "dalton"."Servicio" s ON cs.id_servicio = s.id_servicio
ORDER BY c.fecha DESC;

-- 4. Insumos utilizados por consulta
SELECT c.id_consulta, m.nombre AS mascota, c.fecha, i.nombre AS insumo, 
       ci.cantidad, i.costo_unitario, (ci.cantidad * i.costo_unitario) AS costo_total
FROM "dalton"."Consulta_Insumo" ci
INNER JOIN "dalton"."Consulta" c ON ci.id_consulta = c.id_consulta
INNER JOIN "dalton"."Mascota" m ON c.id_mascota = m.id_mascota
INNER JOIN "dalton"."Insumo" i ON ci.id_insumo = i.id_insumo
ORDER BY c.fecha DESC;

-- 5. Pagos realizados con detalles de consulta
SELECT p.id_pago, p.fecha, d.nombre_completo AS dueño, m.nombre AS mascota, 
       p.monto, p.metodo, p.estado, c.motivo
FROM "dalton"."Pago" p
INNER JOIN "dalton"."Consulta" c ON p.id_consulta = c.id_consulta
INNER JOIN "dalton"."Mascota" m ON c.id_mascota = m.id_mascota
INNER JOIN "dalton"."Relacion_Dueno_Mascota" rdm ON m.id_mascota = rdm.id_mascota
INNER JOIN "dalton"."Dueno" d ON rdm.id_dueno = d.id_dueno
ORDER BY p.fecha DESC;

-- 6. Productos vendidos con dueños
SELECT vp.id_pago, p.nombre AS producto, vp.cantidad, p.precio, vp.subtotal, 
       vp.fecha, d.nombre_completo AS cliente
FROM "dalton"."Venta_Producto" vp
INNER JOIN "dalton"."Producto" p ON vp.id_producto = p.id_producto
LEFT JOIN "dalton"."Pago" pa ON vp.id_pago = pa.id_pago
LEFT JOIN "dalton"."Consulta" c ON pa.id_consulta = c.id_consulta
LEFT JOIN "dalton"."Mascota" m ON c.id_mascota = m.id_mascota
LEFT JOIN "dalton"."Relacion_Dueno_Mascota" rdm ON m.id_mascota = rdm.id_mascota
LEFT JOIN "dalton"."Dueno" d ON rdm.id_dueno = d.id_dueno
ORDER BY vp.fecha DESC;

-- 7. Movimientos de caja con detalles
SELECT cm.id_caja, cm.fecha, cm.concepto, cm.monto, cm.tipo, 
       c.saldo_inicial, c.saldo_final
FROM "dalton"."Caja_Movimiento" cm
INNER JOIN "dalton"."Caja" c ON cm.id_caja = c.id_caja
ORDER BY cm.fecha DESC;

-- 8. Movimientos de insumo con trazabilidad
SELECT mi.id_insumo, i.nombre, mi.fecha, mi.cantidad, mi.tipo, 
       mi.motivo, mi.referencia, i.cantidad_disponible
FROM "dalton"."Movimiento_Insumo" mi
INNER JOIN "dalton"."Insumo" i ON mi.id_insumo = i.id_insumo
ORDER BY mi.fecha DESC;

-- 9. Historial completo de mascotas (consultas y servicios)
SELECT m.id_mascota, m.nombre, m.especie, m.raza, c.fecha, 
       v.nombre_completo AS veterinario, c.motivo, c.diagnostico, c.estado
FROM "dalton"."Mascota" m
LEFT JOIN "dalton"."Consulta" c ON m.id_mascota = c.id_mascota
LEFT JOIN "dalton"."Veterinario" v ON c.id_veterinario = v.id_veterinario
ORDER BY m.nombre, c.fecha DESC;

-- 10. Dueños con todas sus mascotas y contacto
SELECT d.id_dueno, d.nombre_completo, d.telefono, d.correo, d.direccion,
       STRING_AGG(m.nombre, ', ') AS mascotas
FROM "dalton"."Dueno" d
LEFT JOIN "dalton"."Relacion_Dueno_Mascota" rdm ON d.id_dueno = rdm.id_dueno
LEFT JOIN "dalton"."Mascota" m ON rdm.id_mascota = m.id_mascota
GROUP BY d.id_dueno, d.nombre_completo, d.telefono, d.correo, d.direccion
ORDER BY d.nombre_completo;

-- ==========================================
-- SECCIÓN 2: AGREGACIONES Y ESTADÍSTICAS (11-20)
-- ==========================================

-- 11. Total de consultas por veterinario
SELECT v.id_veterinario, v.nombre_completo, v.especialidad, 
       COUNT(c.id_consulta) AS total_consultas
FROM "dalton"."Veterinario" v
LEFT JOIN "dalton"."Consulta" c ON v.id_veterinario = c.id_veterinario
GROUP BY v.id_veterinario, v.nombre_completo, v.especialidad
ORDER BY total_consultas DESC;

-- 12. Ingresos totales por servicio
SELECT s.id_servicio, s.nombre, COUNT(cs.id_consulta) AS veces_realizado,
       SUM(cs.subtotal) AS ingreso_total, AVG(s.costo) AS costo_promedio
FROM "dalton"."Servicio" s
LEFT JOIN "dalton"."Consulta_Servicio" cs ON s.id_servicio = cs.id_servicio
GROUP BY s.id_servicio, s.nombre
ORDER BY ingreso_total DESC NULLS LAST;

-- 13. Consumo de insumos por tipo
SELECT i.nombre, i.unidad, i.cantidad_disponible, i.costo_unitario,
       SUM(mi.cantidad) AS cantidad_consumida
FROM "dalton"."Insumo" i
LEFT JOIN "dalton"."Movimiento_Insumo" mi ON i.id_insumo = mi.id_insumo 
  AND mi.tipo = 'Salida'
GROUP BY i.id_insumo, i.nombre, i.unidad, i.cantidad_disponible, i.costo_unitario
ORDER BY cantidad_consumida DESC NULLS LAST;

-- 14. Pagos por método de pago
SELECT p.metodo, p.estado, COUNT(p.id_pago) AS cantidad,
       SUM(p.monto) AS monto_total, AVG(p.monto) AS monto_promedio
FROM "dalton"."Pago" p
GROUP BY p.metodo, p.estado
ORDER BY monto_total DESC;

-- 15. Mascotas por especie y raza
SELECT m.especie, m.raza, COUNT(m.id_mascota) AS cantidad
FROM "dalton"."Mascota" m
GROUP BY m.especie, m.raza
ORDER BY cantidad DESC;

-- 16. Ingresos por mes (últimos 30 días)
SELECT DATE_TRUNC('day', p.fecha)::date AS fecha, 
       COUNT(p.id_pago) AS transacciones,
       SUM(p.monto) AS ingreso_diario
FROM "dalton"."Pago" p
WHERE p.estado = 'pagado'
GROUP BY DATE_TRUNC('day', p.fecha)
ORDER BY fecha DESC;

-- 17. Productos más vendidos
SELECT p.nombre, p.categoria, SUM(vp.cantidad) AS cantidad_vendida,
       SUM(vp.subtotal) AS ingresos_totales, p.precio
FROM "dalton"."Producto" p
LEFT JOIN "dalton"."Venta_Producto" vp ON p.id_producto = vp.id_producto
GROUP BY p.id_producto, p.nombre, p.categoria, p.precio
ORDER BY cantidad_vendida DESC NULLS LAST;

-- 18. Dueños con mayor gasto en consultas
SELECT d.id_dueno, d.nombre_completo, d.telefono,
       COUNT(DISTINCT c.id_consulta) AS total_consultas,
       SUM(p.monto) AS gasto_total, AVG(p.monto) AS gasto_promedio
FROM "dalton"."Dueno" d
INNER JOIN "dalton"."Relacion_Dueno_Mascota" rdm ON d.id_dueno = rdm.id_dueno
INNER JOIN "dalton"."Mascota" m ON rdm.id_mascota = m.id_mascota
INNER JOIN "dalton"."Consulta" c ON m.id_mascota = c.id_mascota
INNER JOIN "dalton"."Pago" p ON c.id_consulta = p.id_consulta
GROUP BY d.id_dueno, d.nombre_completo, d.telefono
ORDER BY gasto_total DESC;

-- 19. Estado de pagos pendientes
SELECT COUNT(p.id_pago) AS pagos_pendientes,
       SUM(p.monto) AS monto_pendiente,
       AVG(p.monto) AS monto_promedio_pendiente
FROM "dalton"."Pago" p
WHERE p.estado = 'pendiente';

-- 20. Especialidades más demandadas
SELECT v.especialidad, COUNT(c.id_consulta) AS consultas_realizadas,
       COUNT(DISTINCT v.id_veterinario) AS veterinarios
FROM "dalton"."Veterinario" v
LEFT JOIN "dalton"."Consulta" c ON v.id_veterinario = c.id_veterinario
GROUP BY v.especialidad
ORDER BY consultas_realizadas DESC;

-- ==========================================
-- SECCIÓN 3: CONSULTAS CON SUBCONSULTAS (21-30)
-- ==========================================

-- 21. Mascotas sin consultas en los últimos 30 días
SELECT m.id_mascota, m.nombre, m.especie, d.nombre_completo
FROM "dalton"."Mascota" m
INNER JOIN "dalton"."Relacion_Dueno_Mascota" rdm ON m.id_mascota = rdm.id_mascota
INNER JOIN "dalton"."Dueno" d ON rdm.id_dueno = d.id_dueno
WHERE m.id_mascota NOT IN (
    SELECT DISTINCT id_mascota FROM "dalton"."Consulta"
    WHERE fecha >= NOW() - INTERVAL '30 days'
)
ORDER BY m.nombre;

-- 22. Veterinarios con especialidad en Cirugía que han realizado más de 2 consultas
SELECT v.id_veterinario, v.nombre_completo, v.especialidad,
       COUNT(c.id_consulta) AS total_consultas
FROM "dalton"."Veterinario" v
LEFT JOIN "dalton"."Consulta" c ON v.id_veterinario = c.id_veterinario
WHERE v.especialidad = 'Cirugía'
GROUP BY v.id_veterinario, v.nombre_completo, v.especialidad
HAVING COUNT(c.id_consulta) > 2
ORDER BY total_consultas DESC;

-- 23. Dueños que nunca han pagado con tarjeta
SELECT DISTINCT d.id_dueno, d.nombre_completo, d.correo
FROM "dalton"."Dueno" d
INNER JOIN "dalton"."Relacion_Dueno_Mascota" rdm ON d.id_dueno = rdm.id_dueno
INNER JOIN "dalton"."Mascota" m ON rdm.id_mascota = m.id_mascota
INNER JOIN "dalton"."Consulta" c ON m.id_mascota = c.id_mascota
INNER JOIN "dalton"."Pago" p ON c.id_consulta = p.id_consulta
WHERE p.id_pago NOT IN (
    SELECT id_pago FROM "dalton"."Pago" WHERE metodo = 'tarjeta'
);

-- 24. Servicios que generan más ingresos por unidad vendida
SELECT s.nombre, 
       COUNT(cs.id_consulta) AS veces_usado,
       s.costo,
       SUM(cs.cantidad * s.costo) AS ingreso_total,
       (SUM(cs.cantidad * s.costo) / COUNT(cs.id_consulta)) AS ingreso_promedio
FROM "dalton"."Servicio" s
INNER JOIN "dalton"."Consulta_Servicio" cs ON s.id_servicio = cs.id_servicio
GROUP BY s.id_servicio, s.nombre, s.costo
HAVING COUNT(cs.id_consulta) > 0
ORDER BY ingreso_total DESC;

-- 25. Consultas en estado 'en_proceso' con información del dueño
SELECT c.id_consulta, c.fecha, m.nombre AS mascota, d.nombre_completo AS dueño,
       d.telefono, v.nombre_completo AS veterinario, c.diagnostico
FROM "dalton"."Consulta" c
INNER JOIN "dalton"."Mascota" m ON c.id_mascota = m.id_mascota
INNER JOIN "dalton"."Veterinario" v ON c.id_veterinario = v.id_veterinario
INNER JOIN "dalton"."Relacion_Dueno_Mascota" rdm ON m.id_mascota = rdm.id_mascota
INNER JOIN "dalton"."Dueno" d ON rdm.id_dueno = d.id_dueno
WHERE c.estado = 'en_proceso'
ORDER BY c.fecha;

-- 26. Insumos con bajo stock (menos de 30 unidades)
SELECT i.id_insumo, i.nombre, i.cantidad_disponible, i.unidad, 
       i.costo_unitario, (i.cantidad_disponible * i.costo_unitario) AS valor_stock
FROM "dalton"."Insumo" i
WHERE i.cantidad_disponible < 30
ORDER BY i.cantidad_disponible ASC;

-- 27. Transacciones de efectivo en los últimos 7 días
SELECT cm.fecha, cm.concepto, cm.monto, cm.tipo,
       c.saldo_inicial, c.saldo_final
FROM "dalton"."Caja_Movimiento" cm
INNER JOIN "dalton"."Caja" c ON cm.id_caja = c.id_caja
WHERE cm.fecha >= NOW() - INTERVAL '7 days'
  AND cm.tipo = 'Ingreso'
ORDER BY cm.fecha DESC;

-- 28. Consultas con servicios y costo total
SELECT c.id_consulta, c.fecha, m.nombre, c.diagnostico,
       COUNT(cs.id_servicio) AS servicios_prestados,
       SUM(cs.cantidad * s.costo) AS costo_total
FROM "dalton"."Consulta" c
INNER JOIN "dalton"."Mascota" m ON c.id_mascota = m.id_mascota
LEFT JOIN "dalton"."Consulta_Servicio" cs ON c.id_consulta = cs.id_consulta
LEFT JOIN "dalton"."Servicio" s ON cs.id_servicio = s.id_servicio
GROUP BY c.id_consulta, c.fecha, m.nombre, c.diagnostico
ORDER BY c.fecha DESC;

-- 29. Mascotas por categoría de edad
SELECT m.id_mascota, m.nombre, m.especie,
       DATE_PART('year', AGE(m.fecha_nacimiento))::INT AS edad_años,
       CASE 
           WHEN DATE_PART('year', AGE(m.fecha_nacimiento)) < 1 THEN 'Cachorro'
           WHEN DATE_PART('year', AGE(m.fecha_nacimiento)) < 7 THEN 'Adulto'
           ELSE 'Adulto Mayor'
       END AS categoria_edad
FROM "dalton"."Mascota" m
ORDER BY categoria_edad, m.nombre;

-- 30. Dueños activos (con consultas en últimos 30 días)
SELECT d.id_dueno, d.nombre_completo, d.telefono,
       COUNT(DISTINCT c.id_consulta) AS consultas_recientes,
       MAX(c.fecha) AS ultima_consulta
FROM "dalton"."Dueno" d
INNER JOIN "dalton"."Relacion_Dueno_Mascota" rdm ON d.id_dueno = rdm.id_dueno
INNER JOIN "dalton"."Mascota" m ON rdm.id_mascota = m.id_mascota
INNER JOIN "dalton"."Consulta" c ON m.id_mascota = c.id_mascota
WHERE c.fecha >= NOW() - INTERVAL '30 days'
GROUP BY d.id_dueno, d.nombre_completo, d.telefono
ORDER BY consultas_recientes DESC;

-- ==========================================
-- SECCIÓN 4: LEFT JOIN Y OUTER JOIN (31-40)
-- ==========================================

-- 31. Todos los dueños con o sin mascotas registradas
SELECT d.id_dueno, d.nombre_completo, d.telefono,
       COUNT(m.id_mascota) AS cantidad_mascotas
FROM "dalton"."Dueno" d
LEFT JOIN "dalton"."Relacion_Dueno_Mascota" rdm ON d.id_dueno = rdm.id_dueno
LEFT JOIN "dalton"."Mascota" m ON rdm.id_mascota = m.id_mascota
GROUP BY d.id_dueno, d.nombre_completo, d.telefono
ORDER BY cantidad_mascotas DESC;

-- 32. Todos los servicios con número de consultas asociadas
SELECT s.id_servicio, s.nombre, s.descripcion, s.costo,
       COUNT(cs.id_consulta) AS veces_usado
FROM "dalton"."Servicio" s
LEFT JOIN "dalton"."Consulta_Servicio" cs ON s.id_servicio = cs.id_servicio
GROUP BY s.id_servicio, s.nombre, s.descripcion, s.costo
ORDER BY veces_usado DESC;

-- 33. Todos los insumos con su movimiento (entrada/salida)
SELECT i.id_insumo, i.nombre, i.cantidad_disponible,
       SUM(CASE WHEN mi.tipo = 'Entrada' THEN mi.cantidad ELSE 0 END) AS entradas,
       SUM(CASE WHEN mi.tipo = 'Salida' THEN mi.cantidad ELSE 0 END) AS salidas
FROM "dalton"."Insumo" i
LEFT JOIN "dalton"."Movimiento_Insumo" mi ON i.id_insumo = mi.id_insumo
GROUP BY i.id_insumo, i.nombre, i.cantidad_disponible
ORDER BY i.nombre;

-- 34. Veterinarios con y sin consultas asignadas
SELECT v.id_veterinario, v.nombre_completo, v.especialidad, v.activo,
       COUNT(c.id_consulta) AS total_consultas,
       COALESCE(MAX(c.fecha), 'Sin registros'::VARCHAR) AS ultima_consulta
FROM "dalton"."Veterinario" v
LEFT JOIN "dalton"."Consulta" c ON v.id_veterinario = c.id_veterinario
GROUP BY v.id_veterinario, v.nombre_completo, v.especialidad, v.activo
ORDER BY total_consultas DESC;

-- 35. Consultas con y sin pagos registrados
SELECT c.id_consulta, c.fecha, m.nombre, c.diagnostico,
       COUNT(p.id_pago) AS pagos_realizados,
       SUM(p.monto) AS total_pagado,
       COALESCE(p.estado, 'Sin pago') AS estado_pago
FROM "dalton"."Consulta" c
INNER JOIN "dalton"."Mascota" m ON c.id_mascota = m.id_mascota
LEFT JOIN "dalton"."Pago" p ON c.id_consulta = p.id_consulta
GROUP BY c.id_consulta, c.fecha, m.nombre, c.diagnostico, p.estado
ORDER BY c.fecha DESC;

-- 36. Productos activos y no activos con inventario
SELECT p.id_producto, p.nombre, p.categoria, p.activo,
       p.cantidad_disponible, p.precio,
       (p.cantidad_disponible * p.precio) AS valor_inventario
FROM "dalton"."Producto" p
ORDER BY p.activo DESC, p.cantidad_disponible DESC;

-- 37. Cajas de cada día con movimientos totales
SELECT c.id_caja, c.fecha_apertura::date AS fecha,
       COUNT(cm.id_caja) AS total_movimientos,
       SUM(CASE WHEN cm.tipo = 'Ingreso' THEN cm.monto ELSE 0 END) AS ingresos,
       SUM(CASE WHEN cm.tipo = 'Egreso' THEN cm.monto ELSE 0 END) AS egresos,
       c.saldo_final - c.saldo_inicial AS diferencia
FROM "dalton"."Caja" c
LEFT JOIN "dalton"."Caja_Movimiento" cm ON c.id_caja = cm.id_caja
GROUP BY c.id_caja, c.fecha_apertura, c.saldo_inicial, c.saldo_final
ORDER BY c.fecha_apertura DESC;

-- 38. Movimientos totales registrados por tipo
SELECT m.tipo, COUNT(m.id_movimiento) AS cantidad,
       SUM(m.monto) AS monto_total,
       AVG(m.monto) AS monto_promedio
FROM "dalton"."Movimiento" m
GROUP BY m.tipo
ORDER BY cantidad DESC;

-- 39. Dueños con facturación y sus datos fiscales
SELECT d.id_dueno, d.nombre_completo, d.correo,
       df.rfc, df.razon_social, df.tipo_persona, df.regimen_fiscal
FROM "dalton"."Dueno" d
LEFT JOIN "dalton"."Dueno_Facturacion" df ON d.id_dueno = df.id_dueno
ORDER BY d.nombre_completo;

-- 40. Relación de dueños y mascotas con roles
SELECT rdm.id_dueno, d.nombre_completo, rdm.id_mascota, m.nombre,
       m.especie, rdm.rol
FROM "dalton"."Relacion_Dueno_Mascota" rdm
LEFT JOIN "dalton"."Dueno" d ON rdm.id_dueno = d.id_dueno
LEFT JOIN "dalton"."Mascota" m ON rdm.id_mascota = m.id_mascota
ORDER BY d.nombre_completo, m.nombre;

-- ==========================================
-- SECCIÓN 5: CONSULTAS COMPLEJAS (41-50)
-- ==========================================

-- 41. Análisis de rentabilidad por mascota (consultas + productos vendidos)
SELECT m.id_mascota, m.nombre, m.especie,
       COUNT(DISTINCT c.id_consulta) AS consultas,
       COALESCE(SUM(DISTINCT p.monto), 0) AS ingresos_consultas,
       COALESCE(SUM(DISTINCT vp.subtotal), 0) AS ingresos_productos,
       COALESCE(SUM(DISTINCT p.monto), 0) + COALESCE(SUM(DISTINCT vp.subtotal), 0) AS ingreso_total
FROM "dalton"."Mascota" m
LEFT JOIN "dalton"."Consulta" c ON m.id_mascota = c.id_mascota
LEFT JOIN "dalton"."Pago" p ON c.id_consulta = p.id_consulta
LEFT JOIN "dalton"."Venta_Producto" vp ON p.id_pago = vp.id_pago
GROUP BY m.id_mascota, m.nombre, m.especie
ORDER BY ingreso_total DESC;

-- 42. Dashboard: Resumen diario de operaciones
SELECT DATE_TRUNC('day', NOW())::date AS fecha_reporte,
       (SELECT COUNT(*) FROM "dalton"."Consulta" WHERE fecha::date = DATE_TRUNC('day', NOW())::date) AS consultas_hoy,
       (SELECT SUM(monto) FROM "dalton"."Pago" WHERE fecha::date = DATE_TRUNC('day', NOW())::date AND estado = 'pagado') AS ingresos_hoy,
       (SELECT COUNT(DISTINCT id_veterinario) FROM "dalton"."Consulta" WHERE fecha::date = DATE_TRUNC('day', NOW())::date) AS veterinarios_activos;

-- 43. Top 5 servicios más rentables
SELECT s.id_servicio, s.nombre, COUNT(cs.id_consulta) AS veces_usado,
       SUM(cs.cantidad * s.costo) AS ingreso_total
FROM "dalton"."Servicio" s
INNER JOIN "dalton"."Consulta_Servicio" cs ON s.id_servicio = cs.id_servicio
GROUP BY s.id_servicio, s.nombre
ORDER BY ingreso_total DESC
LIMIT 5;

-- 44. Consultas pendientes de pago (adeudos)
SELECT c.id_consulta, c.fecha, m.nombre AS mascota, d.nombre_completo AS dueño,
       d.telefono, d.correo,
       COALESCE(SUM(cs.cantidad * s.costo), 0) AS monto_adeudado,
       COALESCE(p.monto, 0) AS monto_pagado,
       COALESCE(SUM(cs.cantidad * s.costo), 0) - COALESCE(p.monto, 0) AS saldo_pendiente
FROM "dalton"."Consulta" c
INNER JOIN "dalton"."Mascota" m ON c.id_mascota = m.id_mascota
INNER JOIN "dalton"."Relacion_Dueno_Mascota" rdm ON m.id_mascota = rdm.id_mascota
INNER JOIN "dalton"."Dueno" d ON rdm.id_dueno = d.id_dueno
LEFT JOIN "dalton"."Consulta_Servicio" cs ON c.id_consulta = cs.id_consulta
LEFT JOIN "dalton"."Servicio" s ON cs.id_servicio = s.id_servicio
LEFT JOIN "dalton"."Pago" p ON c.id_consulta = p.id_consulta
WHERE p.estado IS NULL OR p.estado = 'pendiente'
GROUP BY c.id_consulta, c.fecha, m.nombre, d.nombre_completo, d.telefono, d.correo, p.monto, p.estado
ORDER BY saldo_pendiente DESC;

-- 45. Veterinarios con especialidad y productividad
SELECT v.id_veterinario, v.nombre_completo, v.especialidad, v.cedula,
       COUNT(c.id_consulta) AS consultas_realizadas,
       AVG(EXTRACT(DAY FROM c.fecha))::INT AS dias_promedio_consulta,
       MAX(c.fecha) AS ultima_consulta
FROM "dalton"."Veterinario" v
LEFT JOIN "dalton"."Consulta" c ON v.id_veterinario = c.id_veterinario
GROUP BY v.id_veterinario, v.nombre_completo, v.especialidad, v.cedula
ORDER BY consultas_realizadas DESC;

-- 46. Historial de movimientos de caja por mes
SELECT DATE_TRUNC('month', cm.fecha)::date AS mes,
       COUNT(cm.id_caja) AS movimientos,
       SUM(CASE WHEN cm.tipo = 'Ingreso' THEN cm.monto ELSE 0 END) AS total_ingresos,
       SUM(CASE WHEN cm.tipo = 'Egreso' THEN cm.monto ELSE 0 END) AS total_egresos
FROM "dalton"."Caja_Movimiento" cm
GROUP BY DATE_TRUNC('month', cm.fecha)
ORDER BY mes DESC;

-- 47. Análisis de gasto por insumo (costo operativo)
SELECT i.nombre, i.unidad,
       SUM(mi.cantidad) AS cantidad_total_consumida,
       i.costo_unitario,
       SUM(mi.cantidad * i.costo_unitario) AS costo_total_operativo
FROM "dalton"."Insumo" i
LEFT JOIN "dalton"."Movimiento_Insumo" mi ON i.id_insumo = mi.id_insumo
WHERE mi.tipo = 'Salida'
GROUP BY i.id_insumo, i.nombre, i.unidad, i.costo_unitario
ORDER BY costo_total_operativo DESC;

-- 48. Diagnósticos más comunes y su frecuencia
SELECT c.diagnostico, COUNT(c.id_consulta) AS frecuencia,
       COUNT(DISTINCT c.id_mascota) AS mascotas_afectadas,
       COUNT(DISTINCT c.id_veterinario) AS veterinarios_trataron
FROM "dalton"."Consulta" c
WHERE c.diagnostico IS NOT NULL AND c.diagnostico != ''
GROUP BY c.diagnostico
ORDER BY frecuencia DESC;

-- 49. Comparativa de métodos de pago por mes
SELECT DATE_TRUNC('month', p.fecha)::date AS mes, p.metodo,
       COUNT(p.id_pago) AS cantidad, SUM(p.monto) AS monto_total
FROM "dalton"."Pago" p
WHERE p.estado = 'pagado'
GROUP BY DATE_TRUNC('month', p.fecha), p.metodo
ORDER BY mes DESC, monto_total DESC;

-- 50. Reporte de actividad veterinaria (últimos 7 días)
SELECT v.nombre_completo, v.especialidad,
       COUNT(c.id_consulta) AS consultas_7dias,
       SUM(CASE WHEN c.estado = 'finalizada' THEN 1 ELSE 0 END) AS finalizadas,
       SUM(CASE WHEN c.estado = 'en_proceso' THEN 1 ELSE 0 END) AS en_proceso,
       SUM(CASE WHEN c.estado = 'programada' THEN 1 ELSE 0 END) AS programadas
FROM "dalton"."Veterinario" v
LEFT JOIN "dalton"."Consulta" c ON v.id_veterinario = c.id_veterinario
  AND c.fecha >= NOW() - INTERVAL '7 days'
GROUP BY v.id_veterinario, v.nombre_completo, v.especialidad
ORDER BY consultas_7dias DESC;

-- ====================================================
-- SECCIÓN 6: 50 CONSULTAS SENCILLAS ADICIONALES (51-100)
-- ====================================================

-- 51. Listar todas las mascotas ordenadas por nombre
SELECT id_mascota, nombre, especie, raza FROM "dalton"."Mascota"
ORDER BY nombre;

-- 52. Listar todos los dueños activos
SELECT id_dueno, nombre_completo, telefono, correo FROM "dalton"."Dueno"
WHERE activo = true
ORDER BY nombre_completo;

-- 53. Listar todos los veterinarios activos
SELECT id_veterinario, nombre_completo, especialidad FROM "dalton"."Veterinario"
WHERE activo = true
ORDER BY nombre_completo;

-- 54. Obtener todos los servicios ordenados por costo
SELECT id_servicio, nombre, descripcion, costo FROM "dalton"."Servicio"
ORDER BY costo DESC;

-- 55. Consultas realizadas en los últimos 5 días
SELECT id_consulta, fecha, motivo, diagnostico FROM "dalton"."Consulta"
WHERE fecha >= NOW() - INTERVAL '5 days'
ORDER BY fecha DESC;

-- 56. Consultas finalizadas
SELECT id_consulta, fecha, motivo, diagnostico FROM "dalton"."Consulta"
WHERE estado = 'finalizada'
ORDER BY fecha DESC;

-- 57. Consultas en proceso
SELECT id_consulta, fecha, motivo, diagnostico FROM "dalton"."Consulta"
WHERE estado = 'en_proceso'
ORDER BY fecha DESC;

-- 58. Pagos pagados en los últimos 10 días
SELECT id_pago, fecha, monto, metodo FROM "dalton"."Pago"
WHERE estado = 'pagado' AND fecha >= NOW() - INTERVAL '10 days'
ORDER BY fecha DESC;

-- 59. Pagos pendientes
SELECT id_pago, fecha, monto, metodo FROM "dalton"."Pago"
WHERE estado = 'pendiente'
ORDER BY fecha DESC;

-- 60. Productos disponibles en stock
SELECT id_producto, nombre, categoria, cantidad_disponible, precio FROM "dalton"."Producto"
WHERE activo = true
ORDER BY nombre;

-- 61. Insumos disponibles en stock
SELECT id_insumo, nombre, unidad, cantidad_disponible, costo_unitario FROM "dalton"."Insumo"
ORDER BY nombre;

-- 62. Perros registrados
SELECT id_mascota, nombre, raza, sexo FROM "dalton"."Mascota"
WHERE especie = 'Perro'
ORDER BY nombre;

-- 63. Gatos registrados
SELECT id_mascota, nombre, raza, sexo FROM "dalton"."Mascota"
WHERE especie = 'Gato'
ORDER BY nombre;

-- 64. Mascotas macho
SELECT id_mascota, nombre, especie, raza FROM "dalton"."Mascota"
WHERE sexo = 'Macho'
ORDER BY nombre;

-- 65. Mascotas hembra
SELECT id_mascota, nombre, especie, raza FROM "dalton"."Mascota"
WHERE sexo = 'Hembra'
ORDER BY nombre;

-- 66. Veterinarios especialista en Cirugía
SELECT id_veterinario, nombre_completo, telefono FROM "dalton"."Veterinario"
WHERE especialidad = 'Cirugía'
ORDER BY nombre_completo;

-- 67. Veterinarios especialista en Dermatología
SELECT id_veterinario, nombre_completo, telefono FROM "dalton"."Veterinario"
WHERE especialidad = 'Dermatología'
ORDER BY nombre_completo;

-- 68. Servicios de consulta general
SELECT id_servicio, nombre, costo FROM "dalton"."Servicio"
WHERE nombre LIKE '%Consulta%'
ORDER BY costo;

-- 69. Servicios quirúrgicos
SELECT id_servicio, nombre, costo, duracion_estimada FROM "dalton"."Servicio"
WHERE nombre LIKE '%Cirugía%' OR nombre LIKE '%Esterilización%'
ORDER BY costo DESC;

-- 70. Productos de alimentación
SELECT id_producto, nombre, precio FROM "dalton"."Producto"
WHERE categoria = 'Alimento'
ORDER BY precio DESC;

-- 71. Productos de higiene
SELECT id_producto, nombre, precio FROM "dalton"."Producto"
WHERE categoria = 'Higiene'
ORDER BY nombre;

-- 72. Productos antiparasitarios
SELECT id_producto, nombre, precio FROM "dalton"."Producto"
WHERE categoria = 'Antiparasitarios'
ORDER BY precio;

-- 73. Suplementos para mascotas
SELECT id_producto, nombre, precio FROM "dalton"."Producto"
WHERE categoria = 'Suplementos'
ORDER BY nombre;

-- 74. Accesorios disponibles
SELECT id_producto, nombre, cantidad_disponible, precio FROM "dalton"."Producto"
WHERE categoria = 'Accesorios'
ORDER BY nombre;

-- 75. Ventas de productos realizadas
SELECT id_pago, fecha, cantidad, subtotal FROM "dalton"."Venta_Producto"
ORDER BY fecha DESC;

-- 76. Pagos en efectivo
SELECT id_pago, fecha, monto FROM "dalton"."Pago"
WHERE metodo = 'efectivo'
ORDER BY fecha DESC;

-- 77. Pagos con tarjeta
SELECT id_pago, fecha, monto FROM "dalton"."Pago"
WHERE metodo = 'tarjeta'
ORDER BY fecha DESC;

-- 78. Pagos por transferencia
SELECT id_pago, fecha, monto FROM "dalton"."Pago"
WHERE metodo = 'transferencia'
ORDER BY fecha DESC;

-- 79. Movimientos de caja (ingresos)
SELECT id_caja, fecha, concepto, monto FROM "dalton"."Caja_Movimiento"
WHERE tipo = 'Ingreso'
ORDER BY fecha DESC;

-- 80. Movimientos de caja (egresos)
SELECT id_caja, fecha, concepto, monto FROM "dalton"."Caja_Movimiento"
WHERE tipo = 'Egreso'
ORDER BY fecha DESC;

-- 81. Cajas abiertas en los últimos 20 días
SELECT id_caja, fecha_apertura, fecha_cierre, saldo_final FROM "dalton"."Caja"
ORDER BY fecha_apertura DESC;

-- 82. Movimientos de entrada de insumos
SELECT id_insumo, fecha, cantidad, motivo FROM "dalton"."Movimiento_Insumo"
WHERE tipo = 'Entrada'
ORDER BY fecha DESC;

-- 83. Movimientos de salida de insumos
SELECT id_insumo, fecha, cantidad, motivo FROM "dalton"."Movimiento_Insumo"
WHERE tipo = 'Salida'
ORDER BY fecha DESC;

-- 84. Movimientos generales del sistema
SELECT id_movimiento, fecha, tipo, concepto, monto FROM "dalton"."Movimiento"
WHERE activo = true
ORDER BY fecha DESC;

-- 85. Movimientos de pago de consulta
SELECT id_movimiento, fecha, monto FROM "dalton"."Movimiento"
WHERE tipo = 'pago_consulta'
ORDER BY fecha DESC;

-- 86. Movimientos de venta de producto
SELECT id_movimiento, fecha, monto FROM "dalton"."Movimiento"
WHERE tipo = 'venta_producto'
ORDER BY fecha DESC;

-- 87. Relación dueño-mascota con rol principal
SELECT id_dueno, id_mascota FROM "dalton"."Relacion_Dueno_Mascota"
WHERE rol = 'principal'
ORDER BY id_dueno;

-- 88. Relación dueño-mascota con rol acreditado
SELECT id_dueno, id_mascota FROM "dalton"."Relacion_Dueno_Mascota"
WHERE rol = 'acreditado'
ORDER BY id_dueno;

-- 89. Datos de facturación de dueños
SELECT id_dueno, rfc, razon_social, tipo_persona FROM "dalton"."Dueno_Facturacion"
ORDER BY razon_social;

-- 90. Consultas programadas
SELECT id_consulta, fecha, motivo FROM "dalton"."Consulta"
WHERE estado = 'programada'
ORDER BY fecha;

-- 91. Servicios con duración estimada menor a 30 minutos
SELECT nombre, costo, duracion_estimada FROM "dalton"."Servicio"
WHERE duracion_estimada < 30
ORDER BY duracion_estimada;

-- 92. Servicios con duración estimada mayor a 60 minutos
SELECT nombre, costo, duracion_estimada FROM "dalton"."Servicio"
WHERE duracion_estimada > 60
ORDER BY duracion_estimada DESC;

-- 93. Productos con precio menor a 200
SELECT nombre, categoria, precio FROM "dalton"."Producto"
WHERE precio < 200
ORDER BY precio;

-- 94. Productos con precio mayor a 400
SELECT nombre, categoria, precio FROM "dalton"."Producto"
WHERE precio > 400
ORDER BY precio DESC;

-- 95. Insumos con cantidad disponible menor a 50
SELECT nombre, unidad, cantidad_disponible FROM "dalton"."Insumo"
WHERE cantidad_disponible < 50
ORDER BY cantidad_disponible;

-- 96. Insumos con costo unitario mayor a 20
SELECT nombre, costo_unitario FROM "dalton"."Insumo"
WHERE costo_unitario > 20
ORDER BY costo_unitario DESC;

-- 97. Mascotas nacidas en 2020
SELECT nombre, especie, raza, fecha_nacimiento FROM "dalton"."Mascota"
WHERE EXTRACT(YEAR FROM fecha_nacimiento) = 2020
ORDER BY nombre;

-- 98. Mascotas nacidas en 2021
SELECT nombre, especie, raza, fecha_nacimiento FROM "dalton"."Mascota"
WHERE EXTRACT(YEAR FROM fecha_nacimiento) = 2021
ORDER BY nombre;

-- 99. Dueños registrados en los últimos 30 días
SELECT nombre_completo, telefono, correo, fecha_registro FROM "dalton"."Dueno"
WHERE fecha_registro >= NOW() - INTERVAL '30 days'
ORDER BY fecha_registro DESC;

-- 100. Productos registrados recientemente
SELECT nombre, categoria, precio, fecha_registro FROM "dalton"."Producto"
WHERE fecha_registro >= NOW() - INTERVAL '30 days'
ORDER BY fecha_registro DESC;

-- ====================================================
-- SECCIÓN 7: 50 CONSULTAS SELECT ADICIONALES (101-150)
-- ====================================================

-- 101. Contar total de mascotas por especie
SELECT especie, COUNT(*) AS total FROM "dalton"."Mascota"
GROUP BY especie;

-- 102. Contar total de consultas por estado
SELECT estado, COUNT(*) AS total FROM "dalton"."Consulta"
GROUP BY estado;

-- 103. Contar total de pagos por estado
SELECT estado, COUNT(*) AS total FROM "dalton"."Pago"
GROUP BY estado;

-- 104. Promedio de costo de servicios
SELECT AVG(costo) AS costo_promedio FROM "dalton"."Servicio";

-- 105. Servicio más caro
SELECT nombre, costo FROM "dalton"."Servicio"
WHERE costo = (SELECT MAX(costo) FROM "dalton"."Servicio");

-- 106. Servicio más barato
SELECT nombre, costo FROM "dalton"."Servicio"
WHERE costo = (SELECT MIN(costo) FROM "dalton"."Servicio");

-- 107. Mascota más vieja
SELECT nombre, especie, fecha_nacimiento FROM "dalton"."Mascota"
WHERE fecha_nacimiento = (SELECT MIN(fecha_nacimiento) FROM "dalton"."Mascota");

-- 108. Mascota más joven
SELECT nombre, especie, fecha_nacimiento FROM "dalton"."Mascota"
WHERE fecha_nacimiento = (SELECT MAX(fecha_nacimiento) FROM "dalton"."Mascota");

-- 109. Producto más caro
SELECT nombre, precio FROM "dalton"."Producto"
WHERE precio = (SELECT MAX(precio) FROM "dalton"."Producto");

-- 110. Producto más barato
SELECT nombre, precio FROM "dalton"."Producto"
WHERE precio = (SELECT MIN(precio) FROM "dalton"."Producto");

-- 111. Total de dueños registrados
SELECT COUNT(*) AS total_duenos FROM "dalton"."Dueno";

-- 112. Total de veterinarios
SELECT COUNT(*) AS total_veterinarios FROM "dalton"."Veterinario";

-- 113. Total de mascotas registradas
SELECT COUNT(*) AS total_mascotas FROM "dalton"."Mascota";

-- 114. Total de consultas realizadas
SELECT COUNT(*) AS total_consultas FROM "dalton"."Consulta";

-- 115. Total de servicios disponibles
SELECT COUNT(*) AS total_servicios FROM "dalton"."Servicio";

-- 116. Total de productos en inventario
SELECT COUNT(*) AS total_productos FROM "dalton"."Producto";

-- 117. Total de insumos disponibles
SELECT COUNT(*) AS total_insumos FROM "dalton"."Insumo";

-- 118. Cantidad total de mascotas activas (con dueño principal)
SELECT COUNT(*) AS mascotas_activas FROM "dalton"."Relacion_Dueno_Mascota"
WHERE rol = 'principal';

-- 119. Cantidad total de mascotas acreditadas
SELECT COUNT(*) AS mascotas_acreditadas FROM "dalton"."Relacion_Dueno_Mascota"
WHERE rol = 'acreditado';

-- 120. Ingreso total por pagos
SELECT SUM(monto) AS ingreso_total FROM "dalton"."Pago"
WHERE estado = 'pagado';

-- 121. Monto promedio por pago
SELECT AVG(monto) AS promedio_pago FROM "dalton"."Pago"
WHERE estado = 'pagado';

-- 122. Monto total pendiente de pago
SELECT SUM(monto) AS pendiente_total FROM "dalton"."Pago"
WHERE estado = 'pendiente';

-- 123. Cantidad de pagos efectuados
SELECT COUNT(*) AS pagos_realizados FROM "dalton"."Pago"
WHERE estado = 'pagado';

-- 124. Cantidad de pagos pendientes
SELECT COUNT(*) AS pagos_pendientes FROM "dalton"."Pago"
WHERE estado = 'pendiente';

-- 125. Mascotas sin consultas registradas
SELECT m.id_mascota, m.nombre, m.especie FROM "dalton"."Mascota" m
WHERE NOT EXISTS (SELECT 1 FROM "dalton"."Consulta" c WHERE c.id_mascota = m.id_mascota);

-- 126. Veterinarios sin consultas asignadas
SELECT v.id_veterinario, v.nombre_completo, v.especialidad FROM "dalton"."Veterinario" v
WHERE NOT EXISTS (SELECT 1 FROM "dalton"."Consulta" c WHERE c.id_veterinario = v.id_veterinario);

-- 127. Servicios nunca utilizados
SELECT s.id_servicio, s.nombre FROM "dalton"."Servicio" s
WHERE NOT EXISTS (SELECT 1 FROM "dalton"."Consulta_Servicio" cs WHERE cs.id_servicio = s.id_servicio);

-- 128. Productos sin ventas
SELECT p.id_producto, p.nombre FROM "dalton"."Producto" p
WHERE NOT EXISTS (SELECT 1 FROM "dalton"."Venta_Producto" vp WHERE vp.id_producto = p.id_producto);

-- 129. Insumos sin movimientos
SELECT i.id_insumo, i.nombre FROM "dalton"."Insumo" i
WHERE NOT EXISTS (SELECT 1 FROM "dalton"."Movimiento_Insumo" mi WHERE mi.id_insumo = i.id_insumo);

-- 130. Dueños sin mascotas registradas
SELECT d.id_dueno, d.nombre_completo FROM "dalton"."Dueno" d
WHERE NOT EXISTS (SELECT 1 FROM "dalton"."Relacion_Dueno_Mascota" rdm WHERE rdm.id_dueno = d.id_dueno);

-- 131. Consultas con diagnostico nulo
SELECT id_consulta, fecha, motivo FROM "dalton"."Consulta"
WHERE diagnostico IS NULL OR diagnostico = '';

-- 132. Consultas con tratamiento nulo
SELECT id_consulta, fecha, motivo FROM "dalton"."Consulta"
WHERE tratamiento IS NULL OR tratamiento = '';

-- 133. Mascotas por color (agrupadas)
SELECT color, COUNT(*) AS cantidad FROM "dalton"."Mascota"
GROUP BY color
ORDER BY cantidad DESC;

-- 134. Dueños por ciudad (extrayendo de dirección)
SELECT SUBSTRING(direccion, POSITION(',' IN direccion) + 2) AS ciudad, COUNT(*) AS cantidad
FROM "dalton"."Dueno"
GROUP BY SUBSTRING(direccion, POSITION(',' IN direccion) + 2)
ORDER BY cantidad DESC;

-- 135. Mascotas por raza (Top 10)
SELECT raza, COUNT(*) AS cantidad FROM "dalton"."Mascota"
GROUP BY raza
ORDER BY cantidad DESC
LIMIT 10;

-- 136. Veterinarios por especialidad (ordenado)
SELECT especialidad, COUNT(*) AS cantidad FROM "dalton"."Veterinario"
GROUP BY especialidad
ORDER BY cantidad DESC;

-- 137. Productos por categoría
SELECT categoria, COUNT(*) AS cantidad, SUM(cantidad_disponible) AS stock_total
FROM "dalton"."Producto"
GROUP BY categoria
ORDER BY cantidad DESC;

-- 138. Valor total en inventario de productos
SELECT SUM(cantidad_disponible * precio) AS valor_inventario FROM "dalton"."Producto";

-- 139. Valor total en inventario de insumos
SELECT SUM(cantidad_disponible * costo_unitario) AS valor_insumos FROM "dalton"."Insumo";

-- 140. Caja con mayor saldo final
SELECT id_caja, fecha_apertura, saldo_final FROM "dalton"."Caja"
WHERE saldo_final = (SELECT MAX(saldo_final) FROM "dalton"."Caja");

-- 141. Caja con menor saldo final
SELECT id_caja, fecha_apertura, saldo_final FROM "dalton"."Caja"
WHERE saldo_final = (SELECT MIN(saldo_final) FROM "dalton"."Caja");

-- 142. Promedio de saldo final diario
SELECT AVG(saldo_final) AS promedio_saldo FROM "dalton"."Caja";

-- 143. Concepto de movimiento de caja más frecuente
SELECT concepto, COUNT(*) AS frecuencia FROM "dalton"."Caja_Movimiento"
GROUP BY concepto
ORDER BY frecuencia DESC;

-- 144. Tipo de movimiento más común
SELECT tipo, COUNT(*) AS frecuencia FROM "dalton"."Caja_Movimiento"
GROUP BY tipo
ORDER BY frecuencia DESC;

-- 145. Motivo de consulta más común
SELECT motivo, COUNT(*) AS frecuencia FROM "dalton"."Consulta"
GROUP BY motivo
ORDER BY frecuencia DESC;

-- 146. Tratamiento más aplicado
SELECT tratamiento, COUNT(*) AS frecuencia FROM "dalton"."Consulta"
WHERE tratamiento IS NOT NULL AND tratamiento != ''
GROUP BY tratamiento
ORDER BY frecuencia DESC;

-- 147. Mascotas por edad (agrupadas en rangos)
SELECT 
    CASE 
        WHEN DATE_PART('year', AGE(fecha_nacimiento)) < 1 THEN 'Menor a 1 año'
        WHEN DATE_PART('year', AGE(fecha_nacimiento)) < 3 THEN '1-3 años'
        WHEN DATE_PART('year', AGE(fecha_nacimiento)) < 7 THEN '3-7 años'
        ELSE 'Mayor a 7 años'
    END AS rango_edad,
    COUNT(*) AS cantidad
FROM "dalton"."Mascota"
GROUP BY rango_edad;

-- 148. Últimas 10 consultas registradas
SELECT id_consulta, fecha, motivo, estado FROM "dalton"."Consulta"
ORDER BY fecha DESC
LIMIT 10;

-- 149. Últimas 10 transacciones de caja
SELECT fecha, concepto, monto, tipo FROM "dalton"."Caja_Movimiento"
ORDER BY fecha DESC
LIMIT 10;

-- 150. Últimas 10 ventas de productos
SELECT vp.id_pago, p.nombre, vp.cantidad, vp.subtotal, vp.fecha FROM "dalton"."Venta_Producto" vp
INNER JOIN "dalton"."Producto" p ON vp.id_producto = p.id_producto
ORDER BY vp.fecha DESC
LIMIT 10;

-- ====================================================
-- SECCIÓN 8: 50 CONSULTAS MÁS SENCILLAS (151-200)
-- ====================================================

-- 151. Todos los nombres de mascotas
SELECT nombre FROM "dalton"."Mascota";

-- 152. Todos los nombres de dueños
SELECT nombre_completo FROM "dalton"."Dueno";

-- 153. Todos los nombres de veterinarios
SELECT nombre_completo FROM "dalton"."Veterinario";

-- 154. Todos los nombres de servicios
SELECT nombre FROM "dalton"."Servicio";

-- 155. Todos los nombres de productos
SELECT nombre FROM "dalton"."Producto";

-- 156. Todos los nombres de insumos
SELECT nombre FROM "dalton"."Insumo";

-- 157. Todas las especies de mascotas
SELECT DISTINCT especie FROM "dalton"."Mascota";

-- 158. Todas las razas de mascotas
SELECT DISTINCT raza FROM "dalton"."Mascota";

-- 159. Todos los colores de mascotas
SELECT DISTINCT color FROM "dalton"."Mascota";

-- 160. Todas las especialidades de veterinarios
SELECT DISTINCT especialidad FROM "dalton"."Veterinario";

-- 161. Todas las categorías de productos
SELECT DISTINCT categoria FROM "dalton"."Producto";

-- 162. Todos los métodos de pago
SELECT DISTINCT metodo FROM "dalton"."Pago";

-- 163. Todos los estados de consulta
SELECT DISTINCT estado FROM "dalton"."Consulta";

-- 164. Todos los estados de pago
SELECT DISTINCT estado FROM "dalton"."Pago";

-- 165. Todos los tipos de movimiento
SELECT DISTINCT tipo FROM "dalton"."Movimiento_Insumo";

-- 166. Todos los roles de relación dueño-mascota
SELECT DISTINCT rol FROM "dalton"."Relacion_Dueno_Mascota";

-- 167. Todos los teléfonos de dueños
SELECT telefono FROM "dalton"."Dueno";

-- 168. Todos los correos de dueños
SELECT correo FROM "dalton"."Dueno";

-- 169. Todos los teléfonos de veterinarios
SELECT telefono FROM "dalton"."Veterinario";

-- 170. Todos los correos de veterinarios
SELECT correo FROM "dalton"."Veterinario";

-- 171. Todas las direcciones de dueños
SELECT direccion FROM "dalton"."Dueno";

-- 172. Todas las cédulas de veterinarios
SELECT cedula FROM "dalton"."Veterinario";

-- 173. Todas las unidades de insumo
SELECT DISTINCT unidad FROM "dalton"."Insumo";

-- 174. Todos los RFC de facturación
SELECT rfc FROM "dalton"."Dueno_Facturacion";

-- 175. Todos los motivos de consulta
SELECT DISTINCT motivo FROM "dalton"."Consulta" WHERE motivo IS NOT NULL;

-- 176. Todos los diagnósticos registrados
SELECT DISTINCT diagnostico FROM "dalton"."Consulta" WHERE diagnostico IS NOT NULL;

-- 177. Todos los tratamientos registrados
SELECT DISTINCT tratamiento FROM "dalton"."Consulta" WHERE tratamiento IS NOT NULL;

-- 178. Todos los observaciones de mascotas
SELECT seNias_particulares FROM "dalton"."Mascota";

-- 179. Todos los observaciones de consulta
SELECT observaciones FROM "dalton"."Consulta";

-- 180. Todos los conceptos de movimiento de caja
SELECT DISTINCT concepto FROM "dalton"."Caja_Movimiento";

-- 181. Todos los motivos de movimiento de insumo
SELECT DISTINCT motivo FROM "dalton"."Movimiento_Insumo";

-- 182. Todas las referencias de movimiento de insumo
SELECT DISTINCT referencia FROM "dalton"."Movimiento_Insumo";

-- 183. Todos los conceptos de movimiento general
SELECT DISTINCT concepto FROM "dalton"."Movimiento";

-- 184. Todos los usuarios que han realizado movimientos
SELECT DISTINCT usuario FROM "dalton"."Movimiento";

-- 185. Todos los observaciones de caja
SELECT observaciones FROM "dalton"."Caja";

-- 186. Todos los IDs de mascotas
SELECT id_mascota FROM "dalton"."Mascota";

-- 187. Todos los IDs de dueños
SELECT id_dueno FROM "dalton"."Dueno";

-- 188. Todos los IDs de veterinarios
SELECT id_veterinario FROM "dalton"."Veterinario";

-- 189. Todos los IDs de consultas
SELECT id_consulta FROM "dalton"."Consulta";

-- 190. Todos los IDs de servicios
SELECT id_servicio FROM "dalton"."Servicio";

-- 191. Todos los IDs de productos
SELECT id_producto FROM "dalton"."Producto";

-- 192. Todos los IDs de insumos
SELECT id_insumo FROM "dalton"."Insumo";

-- 193. Todos los IDs de pagos
SELECT id_pago FROM "dalton"."Pago";

-- 194. Todos los IDs de cajas
SELECT id_caja FROM "dalton"."Caja";

-- 195. Todos los sexos de mascotas
SELECT DISTINCT sexo FROM "dalton"."Mascota";

-- 196. Todos los tipos de persona en facturación
SELECT DISTINCT tipo_persona FROM "dalton"."Dueno_Facturacion";

-- 197. Todos los regímenes fiscales
SELECT DISTINCT regimen_fiscal FROM "dalton"."Dueno_Facturacion";

-- 198. Todos los usos de CFDI
SELECT DISTINCT uso_cfdi FROM "dalton"."Dueno_Facturacion";

-- 199. Todos los estados activos de dueños
SELECT DISTINCT activo FROM "dalton"."Dueno";

-- 200. Todos los estados activos de veterinarios
SELECT DISTINCT activo FROM "dalton"."Veterinario";

-- ====================================================
-- SECCIÓN 9: 50 CONSULTAS CON VISTAS (201-250)
-- ====================================================

-- ===== CREACIÓN DE VISTAS =====

-- Vista 1: Mascotas con información del dueño
CREATE OR REPLACE VIEW "dalton"."v_mascotas_duenos" AS
SELECT m.id_mascota, m.nombre, m.especie, m.raza, m.sexo, m.fecha_nacimiento,
       d.id_dueno, d.nombre_completo, d.telefono, d.correo
FROM "dalton"."Mascota" m
INNER JOIN "dalton"."Relacion_Dueno_Mascota" rdm ON m.id_mascota = rdm.id_mascota
INNER JOIN "dalton"."Dueno" d ON rdm.id_dueno = d.id_dueno;

-- Vista 2: Consultas con detalles completos
CREATE OR REPLACE VIEW "dalton"."v_consultas_completas" AS
SELECT c.id_consulta, c.fecha, m.nombre AS mascota, m.especie,
       d.nombre_completo AS dueño, v.nombre_completo AS veterinario,
       v.especialidad, c.motivo, c.diagnostico, c.tratamiento, c.estado
FROM "dalton"."Consulta" c
INNER JOIN "dalton"."Mascota" m ON c.id_mascota = m.id_mascota
INNER JOIN "dalton"."Veterinario" v ON c.id_veterinario = v.id_veterinario
INNER JOIN "dalton"."Relacion_Dueno_Mascota" rdm ON m.id_mascota = rdm.id_mascota
INNER JOIN "dalton"."Dueno" d ON rdm.id_dueno = d.id_dueno;

-- Vista 3: Servicios prestados con costo
CREATE OR REPLACE VIEW "dalton"."v_servicios_consulta" AS
SELECT cs.id_consulta, c.fecha, m.nombre AS mascota,
       s.nombre AS servicio, cs.cantidad, s.costo,
       (cs.cantidad * s.costo) AS subtotal
FROM "dalton"."Consulta_Servicio" cs
INNER JOIN "dalton"."Consulta" c ON cs.id_consulta = c.id_consulta
INNER JOIN "dalton"."Mascota" m ON c.id_mascota = m.id_mascota
INNER JOIN "dalton"."Servicio" s ON cs.id_servicio = s.id_servicio;

-- Vista 4: Pagos realizados
CREATE OR REPLACE VIEW "dalton"."v_pagos_completos" AS
SELECT p.id_pago, p.fecha, d.nombre_completo AS dueño, m.nombre AS mascota,
       p.monto, p.metodo, p.estado, c.motivo AS consulta_motivo
FROM "dalton"."Pago" p
INNER JOIN "dalton"."Consulta" c ON p.id_consulta = c.id_consulta
INNER JOIN "dalton"."Mascota" m ON c.id_mascota = m.id_mascota
INNER JOIN "dalton"."Relacion_Dueno_Mascota" rdm ON m.id_mascota = rdm.id_mascota
INNER JOIN "dalton"."Dueno" d ON rdm.id_dueno = d.id_dueno;

-- Vista 5: Insumos por consulta
CREATE OR REPLACE VIEW "dalton"."v_insumos_consulta" AS
SELECT ci.id_consulta, c.fecha, m.nombre AS mascota,
       i.nombre AS insumo, ci.cantidad, i.costo_unitario,
       (ci.cantidad * i.costo_unitario) AS costo_total
FROM "dalton"."Consulta_Insumo" ci
INNER JOIN "dalton"."Consulta" c ON ci.id_consulta = c.id_consulta
INNER JOIN "dalton"."Mascota" m ON c.id_mascota = m.id_mascota
INNER JOIN "dalton"."Insumo" i ON ci.id_insumo = i.id_insumo;

-- Vista 6: Movimientos de caja con saldo
CREATE OR REPLACE VIEW "dalton"."v_movimientos_caja" AS
SELECT cm.id_caja, cm.fecha, cm.concepto, cm.monto, cm.tipo,
       c.saldo_inicial, c.saldo_final, c.fecha_apertura
FROM "dalton"."Caja_Movimiento" cm
INNER JOIN "dalton"."Caja" c ON cm.id_caja = c.id_caja;

-- Vista 7: Ingresos por veterinario
CREATE OR REPLACE VIEW "dalton"."v_ingresos_veterinario" AS
SELECT v.id_veterinario, v.nombre_completo, v.especialidad,
       COUNT(DISTINCT c.id_consulta) AS total_consultas,
       SUM(p.monto) AS ingreso_total, AVG(p.monto) AS ingreso_promedio
FROM "dalton"."Veterinario" v
LEFT JOIN "dalton"."Consulta" c ON v.id_veterinario = c.id_veterinario
LEFT JOIN "dalton"."Pago" p ON c.id_consulta = p.id_consulta
GROUP BY v.id_veterinario, v.nombre_completo, v.especialidad;

-- Vista 8: Gasto por dueño
CREATE OR REPLACE VIEW "dalton"."v_gasto_dueno" AS
SELECT d.id_dueno, d.nombre_completo, d.telefono,
       COUNT(DISTINCT c.id_consulta) AS total_consultas,
       SUM(p.monto) AS gasto_total, AVG(p.monto) AS gasto_promedio
FROM "dalton"."Dueno" d
INNER JOIN "dalton"."Relacion_Dueno_Mascota" rdm ON d.id_dueno = rdm.id_dueno
INNER JOIN "dalton"."Mascota" m ON rdm.id_mascota = m.id_mascota
LEFT JOIN "dalton"."Consulta" c ON m.id_mascota = c.id_mascota
LEFT JOIN "dalton"."Pago" p ON c.id_consulta = p.id_consulta
GROUP BY d.id_dueno, d.nombre_completo, d.telefono;

-- Vista 9: Servicios más utilizados
CREATE OR REPLACE VIEW "dalton"."v_servicios_populares" AS
SELECT s.id_servicio, s.nombre, COUNT(cs.id_consulta) AS veces_usado,
       SUM(cs.cantidad * s.costo) AS ingreso_total
FROM "dalton"."Servicio" s
LEFT JOIN "dalton"."Consulta_Servicio" cs ON s.id_servicio = cs.id_servicio
GROUP BY s.id_servicio, s.nombre;

-- Vista 10: Productos vendidos
CREATE OR REPLACE VIEW "dalton"."v_ventas_productos" AS
SELECT p.id_producto, p.nombre, p.categoria,
       SUM(vp.cantidad) AS cantidad_vendida,
       SUM(vp.subtotal) AS ingreso_total, p.precio
FROM "dalton"."Producto" p
LEFT JOIN "dalton"."Venta_Producto" vp ON p.id_producto = vp.id_producto
GROUP BY p.id_producto, p.nombre, p.categoria, p.precio;

-- ===== CONSULTAS SOBRE VISTAS =====

-- 201. Listar todas las mascotas con dueños (desde vista)
SELECT * FROM "dalton"."v_mascotas_duenos"
ORDER BY nombre_completo, nombre;

-- 202. Consultas completas de hoy
SELECT * FROM "dalton"."v_consultas_completas"
WHERE fecha::date = CURRENT_DATE;

-- 203. Consultas completadas
SELECT * FROM "dalton"."v_consultas_completas"
WHERE estado = 'finalizada'
ORDER BY fecha DESC;

-- 204. Consultas en proceso
SELECT * FROM "dalton"."v_consultas_completas"
WHERE estado = 'en_proceso'
ORDER BY fecha DESC;

-- 205. Servicios prestados el último mes
SELECT * FROM "dalton"."v_servicios_consulta"
WHERE fecha >= NOW() - INTERVAL '30 days'
ORDER BY fecha DESC;

-- 206. Servicios por mascota específica
SELECT * FROM "dalton"."v_servicios_consulta"
WHERE mascota = 'Max';

-- 207. Pagos completados
SELECT * FROM "dalton"."v_pagos_completos"
WHERE estado = 'pagado'
ORDER BY fecha DESC;

-- 208. Pagos pendientes
SELECT * FROM "dalton"."v_pagos_completos"
WHERE estado = 'pendiente'
ORDER BY fecha DESC;

-- 209. Pagos en efectivo
SELECT * FROM "dalton"."v_pagos_completos"
WHERE metodo = 'efectivo'
ORDER BY fecha DESC;

-- 210. Pagos con tarjeta
SELECT * FROM "dalton"."v_pagos_completos"
WHERE metodo = 'tarjeta'
ORDER BY fecha DESC;

-- 211. Insumos utilizados últimamente
SELECT * FROM "dalton"."v_insumos_consulta"
WHERE fecha >= NOW() - INTERVAL '15 days'
ORDER BY fecha DESC;

-- 212. Insumos por consulta específica
SELECT * FROM "dalton"."v_insumos_consulta"
WHERE id_consulta = 1;

-- 213. Movimientos de caja últimos 7 días
SELECT * FROM "dalton"."v_movimientos_caja"
WHERE fecha >= NOW() - INTERVAL '7 days'
ORDER BY fecha DESC;

-- 214. Movimientos de ingreso
SELECT * FROM "dalton"."v_movimientos_caja"
WHERE tipo = 'Ingreso'
ORDER BY fecha DESC;

-- 215. Movimientos de egreso
SELECT * FROM "dalton"."v_movimientos_caja"
WHERE tipo = 'Egreso'
ORDER BY fecha DESC;

-- 216. Veterinarios con más ingresos
SELECT * FROM "dalton"."v_ingresos_veterinario"
ORDER BY ingreso_total DESC NULLS LAST;

-- 217. Veterinarios con más consultas
SELECT * FROM "dalton"."v_ingresos_veterinario"
ORDER BY total_consultas DESC;

-- 218. Veterinarios especializados en Cirugía
SELECT * FROM "dalton"."v_ingresos_veterinario"
WHERE especialidad = 'Cirugía';

-- 219. Dueños con mayor gasto
SELECT * FROM "dalton"."v_gasto_dueno"
ORDER BY gasto_total DESC NULLS LAST;

-- 220. Dueños con más consultas
SELECT * FROM "dalton"."v_gasto_dueno"
ORDER BY total_consultas DESC;

-- 221. Servicios más demandados
SELECT * FROM "dalton"."v_servicios_populares"
WHERE veces_usado > 0
ORDER BY veces_usado DESC;

-- 222. Servicios sin utilizar
SELECT * FROM "dalton"."v_servicios_populares"
WHERE veces_usado = 0 OR veces_usado IS NULL;

-- 223. Servicios más rentables
SELECT * FROM "dalton"."v_servicios_populares"
WHERE ingreso_total > 0
ORDER BY ingreso_total DESC;

-- 224. Productos más vendidos
SELECT * FROM "dalton"."v_ventas_productos"
WHERE cantidad_vendida > 0
ORDER BY cantidad_vendida DESC;

-- 225. Productos sin ventas
SELECT * FROM "dalton"."v_ventas_productos"
WHERE cantidad_vendida IS NULL OR cantidad_vendida = 0;

-- 226. Productos más rentables
SELECT * FROM "dalton"."v_ventas_productos"
WHERE ingreso_total > 0
ORDER BY ingreso_total DESC;

-- 227. Mascotas de raza Labrador
SELECT * FROM "dalton"."v_mascotas_duenos"
WHERE raza = 'Labrador';

-- 228. Mascotas perros
SELECT * FROM "dalton"."v_mascotas_duenos"
WHERE especie = 'Perro'
ORDER BY nombre;

-- 229. Mascotas gatos
SELECT * FROM "dalton"."v_mascotas_duenos"
WHERE especie = 'Gato'
ORDER BY nombre;

-- 230. Mascotas de un dueño específico
SELECT * FROM "dalton"."v_mascotas_duenos"
WHERE nombre_completo = 'Carlos Martínez López';

-- 231. Consultas por especialidad
SELECT * FROM "dalton"."v_consultas_completas"
WHERE especialidad = 'Cirugía'
ORDER BY fecha DESC;

-- 232. Consultas por veterinario específico
SELECT * FROM "dalton"."v_consultas_completas"
WHERE veterinario = 'Dr. Sergio Rodríguez González';

-- 233. Consultas por dueño
SELECT * FROM "dalton"."v_consultas_completas"
WHERE dueño = 'Carlos Martínez López';

-- 234. Servicios de Consulta General
SELECT * FROM "dalton"."v_servicios_consulta"
WHERE servicio LIKE '%Consulta%';

-- 235. Servicios de Cirugía
SELECT * FROM "dalton"."v_servicios_consulta"
WHERE servicio LIKE '%Cirugía%';

-- 236. Pagos de más de 500
SELECT * FROM "dalton"."v_pagos_completos"
WHERE monto > 500
ORDER BY monto DESC;

-- 237. Pagos de menos de 500
SELECT * FROM "dalton"."v_pagos_completos"
WHERE monto < 500
ORDER BY monto;

-- 238. Ingresos por mes (desde vista de ingresos veterinario)
SELECT especialidad, SUM(ingreso_total) AS ingreso_especialidad
FROM "dalton"."v_ingresos_veterinario"
GROUP BY especialidad
ORDER BY ingreso_especialidad DESC NULLS LAST;

-- 239. Gasto promedio por dueño
SELECT AVG(gasto_promedio) AS gasto_promedio_general
FROM "dalton"."v_gasto_dueno";

-- 240. Total de ventas de productos
SELECT SUM(ingreso_total) AS ingreso_total_productos
FROM "dalton"."v_ventas_productos";

-- 241. Categoría de productos más vendida
SELECT categoria, SUM(cantidad_vendida) AS cantidad_categoria
FROM "dalton"."v_ventas_productos"
WHERE cantidad_vendida > 0
GROUP BY categoria
ORDER BY cantidad_categoria DESC;

-- 242. Dueños sin consultas
SELECT * FROM "dalton"."v_gasto_dueno"
WHERE total_consultas = 0 OR total_consultas IS NULL;

-- 243. Veterinarios sin consultas
SELECT * FROM "dalton"."v_ingresos_veterinario"
WHERE total_consultas = 0 OR total_consultas IS NULL;

-- 244. Mascotas por edad desde vista
SELECT 
    CASE 
        WHEN DATE_PART('year', AGE(fecha_nacimiento)) < 1 THEN 'Menor a 1 año'
        WHEN DATE_PART('year', AGE(fecha_nacimiento)) < 7 THEN '1-7 años'
        ELSE 'Mayor a 7 años'
    END AS rango_edad,
    COUNT(*) AS cantidad
FROM "dalton"."v_mascotas_duenos"
GROUP BY rango_edad;

-- 245. Mascotas hembra
SELECT * FROM "dalton"."v_mascotas_duenos"
WHERE sexo = 'Hembra'
ORDER BY nombre;

-- 246. Mascotas macho
SELECT * FROM "dalton"."v_mascotas_duenos"
WHERE sexo = 'Macho'
ORDER BY nombre;

-- 247. Top 5 servicios más rentables
SELECT * FROM "dalton"."v_servicios_populares"
ORDER BY ingreso_total DESC NULLS LAST
LIMIT 5;

-- 248. Top 5 productos más vendidos
SELECT * FROM "dalton"."v_ventas_productos"
ORDER BY cantidad_vendida DESC NULLS LAST
LIMIT 5;

-- 249. Top 5 dueños que más gastan
SELECT * FROM "dalton"."v_gasto_dueno"
ORDER BY gasto_total DESC NULLS LAST
LIMIT 5;

-- 250. Top 5 veterinarios con más ingresos
SELECT * FROM "dalton"."v_ingresos_veterinario"
ORDER BY ingreso_total DESC NULLS LAST
LIMIT 5;

-- ====================================================
-- FIN DE LAS 250 CONSULTAS SQL (CON 10 VISTAS)
-- ====================================================
