-- Verificar mascotas sin dueños en Relacion_Dueno_Mascota
SELECT 
    m.id_mascota,
    m.nombre AS nombre_mascota,
    m.especie,
    m.raza,
    COUNT(rdm.id_dueno) as numero_duenos,
    COUNT(c.id_consulta) as numero_consultas
FROM "dalton"."Mascota" m
LEFT JOIN "dalton"."Relacion_Dueno_Mascota" rdm ON m.id_mascota = rdm.id_mascota
LEFT JOIN "dalton"."Consulta" c ON m.id_mascota = c.id_mascota
GROUP BY m.id_mascota, m.nombre, m.especie, m.raza
HAVING COUNT(rdm.id_dueno) = 0
ORDER BY COUNT(c.id_consulta) DESC;
