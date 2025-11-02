-- Agregar columna password a la tabla Dueno
ALTER TABLE dalton."Dueno" ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Hacer el correo único (puede fallar si ya existen duplicados)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'dueno_correo_unique'
    ) THEN
        ALTER TABLE dalton."Dueno" ADD CONSTRAINT dueno_correo_unique UNIQUE (correo);
    END IF;
END $$;

-- Comentario explicativo
COMMENT ON COLUMN dalton."Dueno".password IS 'Contraseña hasheada con bcrypt para autenticación';
