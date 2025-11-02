-- Script para agregar campo password a la tabla Veterinario
-- Ejecutar en PostgreSQL

-- 1. Agregar columna password (nullable)
ALTER TABLE dalton."Veterinario" 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- 2. Agregar constraint unique a correo si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'Veterinario_correo_key'
    ) THEN
        ALTER TABLE dalton."Veterinario" 
        ADD CONSTRAINT "Veterinario_correo_key" UNIQUE (correo);
    END IF;
END $$;

-- 3. Verificar cambios
SELECT 
    id_veterinario,
    nombre_completo,
    correo,
    cedula,
    password IS NOT NULL as tiene_password
FROM dalton."Veterinario"
ORDER BY id_veterinario;
