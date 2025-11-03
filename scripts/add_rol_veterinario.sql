-- Agregar campo rol a la tabla Veterinario
ALTER TABLE "Veterinario" ADD COLUMN IF NOT EXISTS rol VARCHAR(50) DEFAULT 'veterinario';

-- Actualizar Patricia Flores como admin
UPDATE "Veterinario" 
SET rol = 'admin' 
WHERE correo = 'patricia.flores@vet.com';

-- Verificar los cambios
SELECT id_veterinario, nombre_completo, correo, rol 
FROM "Veterinario" 
ORDER BY id_veterinario;
