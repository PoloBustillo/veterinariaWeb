-- Add id_caja field to Pago table to track which cash register a payment is associated with
-- This prevents payments from being associated multiple times

ALTER TABLE dalton."Pago"
ADD COLUMN id_caja INTEGER;

-- Add foreign key constraint
ALTER TABLE dalton."Pago"
ADD CONSTRAINT "Pago_id_caja_fkey" FOREIGN KEY (id_caja) REFERENCES dalton."Caja"(id_caja) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Create index for better query performance
CREATE INDEX "Pago_id_caja_idx" ON dalton."Pago"(id_caja);

COMMENT ON COLUMN dalton."Pago".id_caja IS 'ID de la caja a la que está asociado este pago. NULL = pago pendiente de asociar';
