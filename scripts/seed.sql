-- ========================
-- SEED DATA - VETERINARIA
-- ========================
-- Insert 20 records into each table

-- ========================
-- INSERT INTO Dueno (20 records)
-- ========================
INSERT INTO "dalton"."Dueno" ("nombre_completo", "telefono", "correo", "direccion", "fecha_registro", "activo") VALUES
('Carlos Martínez López', '5551234567', 'carlos.martinez@email.com', 'Calle Principal 123, Mexico City', NOW(), true),
('María García Rodríguez', '5559876543', 'maria.garcia@email.com', 'Avenida Central 456, Mexico City', NOW(), true),
('Juan Pérez Sánchez', '5552468135', 'juan.perez@email.com', 'Calle Secundaria 789, Mexico City', NOW(), true),
('Ana López Fernández', '5557394628', 'ana.lopez@email.com', 'Avenida Norte 321, Mexico City', NOW(), true),
('Roberto Gutiérrez Cruz', '5553691428', 'roberto.g@email.com', 'Calle Oriente 654, Mexico City', NOW(), true),
('Sofía Ramírez Torres', '5555827194', 'sofia.ramirez@email.com', 'Avenida Sur 987, Mexico City', NOW(), true),
('Diego Flores Moreno', '5554739582', 'diego.flores@email.com', 'Calle Poniente 147, Mexico City', NOW(), true),
('Alejandra Núñez Castro', '5556182937', 'alejandra.n@email.com', 'Avenida Este 258, Mexico City', NOW(), true),
('Miguel Ángel Jiménez', '5558374621', 'miguel.jimenez@email.com', 'Calle Centro 369, Mexico City', NOW(), true),
('Claudia Reyes Molina', '5559274638', 'claudia.reyes@email.com', 'Avenida Reforma 741, Mexico City', NOW(), true),
('Fernando Vargas Soto', '5552719384', 'fernando.vargas@email.com', 'Calle Reforma 852, Mexico City', NOW(), true),
('Valentina Castro Paz', '5554927381', 'valentina.castro@email.com', 'Avenida Paseo 963, Mexico City', NOW(), true),
('Eduardo Morales Campos', '5557283641', 'eduardo.morales@email.com', 'Calle Libertad 147, Mexico City', NOW(), true),
('Gabriela Sánchez Díaz', '5553847291', 'gabriela.sanchez@email.com', 'Avenida Libertad 258, Mexico City', NOW(), true),
('Andrés Domínguez López', '5556493827', 'andres.dominguez@email.com', 'Calle Hidalgo 369, Mexico City', NOW(), true),
('Natalia Rodríguez Silva', '5558562741', 'natalia.rodriguez@email.com', 'Avenida Hidalgo 741, Mexico City', NOW(), true),
('Cristian Pacheco Medina', '5552841937', 'cristian.pacheco@email.com', 'Calle Madero 852, Mexico City', NOW(), true),
('Isabella Mendoza Ramos', '5555729384', 'isabella.mendoza@email.com', 'Avenida Madero 963, Mexico City', NOW(), true),
('Javier Henríquez Flores', '5557146293', 'javier.henriquez@email.com', 'Calle Juárez 147, Mexico City', NOW(), true),
('Martina López Castillo', '5554738296', 'martina.lopez@email.com', 'Avenida Juárez 258, Mexico City', NOW(), true);

-- ========================
-- INSERT INTO Dueno_Facturacion (20 records)
-- ========================
INSERT INTO "dalton"."Dueno_Facturacion" ("id_dueno", "rfc", "razon_social", "tipo_persona", "regimen_fiscal", "uso_cfdi") VALUES
(1, 'CAML800101AB1', 'Carlos Martínez López', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(2, 'MAGR850215CD2', 'María García Rodríguez', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(3, 'JUAP900310EF3', 'Juan Pérez Sánchez', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(4, 'ANLF920725GH4', 'Ana López Fernández', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(5, 'ROBG880405IJ5', 'Roberto Gutiérrez Cruz', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(6, 'SORA780610KL6', 'Sofía Ramírez Torres', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(7, 'DIFL960820MN7', 'Diego Flores Moreno', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(8, 'ALNU830930OP8', 'Alejandra Núñez Castro', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(9, 'MIJM870415QR9', 'Miguel Ángel Jiménez', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(10, 'CLRE940520ST0', 'Claudia Reyes Molina', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(11, 'FERV851205UV1', 'Fernando Vargas Soto', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(12, 'VALC920810WX2', 'Valentina Castro Paz', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(13, 'EDMO800930YZ3', 'Eduardo Morales Campos', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(14, 'GASN860415AB4', 'Gabriela Sánchez Díaz', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(15, 'ANDO920620CD5', 'Andrés Domínguez López', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(16, 'NARS850105EF6', 'Natalia Rodríguez Silva', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(17, 'CRPA880710GH7', 'Cristian Pacheco Medina', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(18, 'ISMA910825IJ8', 'Isabella Mendoza Ramos', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(19, 'JAHF840320KL9', 'Javier Henríquez Flores', 'fisica', 'Régimen de Personas Físicas', 'G01'),
(20, 'MALC930505MN0', 'Martina López Castillo', 'fisica', 'Régimen de Personas Físicas', 'G01');

-- ========================
-- INSERT INTO Mascota (20 records)
-- ========================
INSERT INTO "dalton"."Mascota" ("nombre", "especie", "raza", "fecha_nacimiento", "sexo", "color", "senias_particulares") VALUES
('Max', 'Perro', 'Labrador', '2020-03-15', 'Macho', 'Negro', 'Cicatriz en la oreja izquierda'),
('Bella', 'Perro', 'Golden Retriever', '2019-07-22', 'Hembra', 'Dorado', 'Manchas blancas en el pecho'),
('Charlie', 'Gato', 'Persa', '2021-01-10', 'Macho', 'Blanco', 'Ojos azules'),
('Luna', 'Gato', 'Siamés', '2020-05-18', 'Hembra', 'Café y crema', 'Orejas grandes'),
('Rocky', 'Perro', 'Pastor Alemán', '2018-09-05', 'Macho', 'Marrón y negro', 'Cola larga'),
('Misi', 'Gato', 'Bengalí', '2021-11-30', 'Hembra', 'Naranjo', 'Marcas rayas'),
('Toby', 'Perro', 'Bulldog', '2019-02-14', 'Macho', 'Gris', 'Nariz negra'),
('Nala', 'Perro', 'Husky', '2020-08-20', 'Hembra', 'Blanco y gris', 'Ojos azules'),
('Simba', 'Gato', 'Maine Coon', '2021-04-08', 'Macho', 'Naranja tabby', 'Tamaño grande'),
('Daisy', 'Perro', 'Cocker Spaniel', '2020-12-25', 'Hembra', 'Marrón claro', 'Orejas largas'),
('Rex', 'Perro', 'Rottweiler', '2019-06-12', 'Macho', 'Negro y marrón', 'Musculoso'),
('Molly', 'Gato', 'Ragdoll', '2021-09-16', 'Hembra', 'Azul', 'Ojos grandes azules'),
('Oscar', 'Gato', 'Calicó', '2020-10-22', 'Macho', 'Multicolor', 'Patrón calicó'),
('Duke', 'Perro', 'Dóberman', '2018-04-30', 'Macho', 'Negro y rojo', 'Orejas cortadas'),
('Sophie', 'Perro', 'Caniche', '2021-02-28', 'Hembra', 'Blanco', 'Rizado'),
('Whiskers', 'Gato', 'Abisinio', '2020-07-11', 'Macho', 'Marrón rojizo', 'Orejas grandes puntiagudas'),
('Buddy', 'Perro', 'Beagle', '2019-11-03', 'Macho', 'Tricolor', 'Cola corta'),
('Kitty', 'Gato', 'Británico', '2021-05-19', 'Hembra', 'Gris azulado', 'Cara redonda'),
('Shadow', 'Perro', 'Pinscher Miniatura', '2020-01-07', 'Macho', 'Negro', 'Tamaño pequeño'),
('Lola', 'Gato', 'Esfinge', '2021-08-26', 'Hembra', 'Rosa pálido', 'Sin pelo');

-- ========================
-- INSERT INTO Relacion_Dueno_Mascota (20 records)
-- ========================
INSERT INTO "dalton"."Relacion_Dueno_Mascota" ("id_dueno", "id_mascota", "rol") VALUES
(1, 1, 'principal'),
(2, 2, 'principal'),
(3, 3, 'principal'),
(4, 4, 'principal'),
(5, 5, 'principal'),
(6, 6, 'acreditado'),
(7, 7, 'principal'),
(8, 8, 'acreditado'),
(9, 9, 'principal'),
(10, 10, 'principal'),
(11, 11, 'acreditado'),
(12, 12, 'principal'),
(13, 13, 'principal'),
(14, 14, 'acreditado'),
(15, 15, 'principal'),
(16, 16, 'principal'),
(17, 17, 'acreditado'),
(18, 18, 'principal'),
(19, 19, 'principal'),
(20, 20, 'acreditado');

-- ========================
-- INSERT INTO Veterinario (20 records)
-- ========================
INSERT INTO "dalton"."Veterinario" ("nombre_completo", "cedula", "especialidad", "telefono", "correo", "activo") VALUES
('Dr. Sergio Rodríguez González', 'MED001', 'Cirugía', '5551111111', 'sergio.rodriguez@vet.com', true),
('Dra. Patricia Flores Mendez', 'MED002', 'Dermatología', '5552222222', 'patricia.flores@vet.com', true),
('Dr. Luis Gómez Martínez', 'MED003', 'Oftalmología', '5553333333', 'luis.gomez@vet.com', true),
('Dra. Carmen Navarro López', 'MED004', 'Odontología', '5554444444', 'carmen.navarro@vet.com', true),
('Dr. Javier Vargas Silva', 'MED005', 'Nutrición', '5555555555', 'javier.vargas@vet.com', true),
('Dra. Marcela Ruiz Castillo', 'MED006', 'Oncología', '5556666666', 'marcela.ruiz@vet.com', true),
('Dr. Ricardo Soto Moreno', 'MED007', 'Cardiología', '5557777777', 'ricardo.soto@vet.com', true),
('Dra. Valentina Campos Díaz', 'MED008', 'Neurología', '5558888888', 'valentina.campos@vet.com', true),
('Dr. Andrés Herrera Rojas', 'MED009', 'Gastroenterología', '5559999999', 'andres.herrera@vet.com', true),
('Dra. Gloria Ponce Delgado', 'MED010', 'Reproducción', '5550001111', 'gloria.ponce@vet.com', true),
('Dr. Felipe Acosta Ríos', 'MED011', 'Oftalmología', '5550002222', 'felipe.acosta@vet.com', true),
('Dra. Lorena Ibáñez Chávez', 'MED012', 'Traumatología', '5550003333', 'lorena.ibanez@vet.com', true),
('Dr. Héctor Morales Rivas', 'MED013', 'Anestesiología', '5550004444', 'hector.morales@vet.com', true),
('Dra. Isabel Suárez Ochoa', 'MED014', 'Radiología', '5550005555', 'isabel.suarez@vet.com', true),
('Dr. Óscar Pérez Cantú', 'MED015', 'Urgencias', '5550006666', 'oscar.perez@vet.com', true),
('Dra. Pamela Vásquez Fuentes', 'MED016', 'Medicina interna', '5550007777', 'pamela.vasquez@vet.com', true),
('Dr. Daniel Reyes Torres', 'MED017', 'Endocrinología', '5550008888', 'daniel.reyes@vet.com', true),
('Dra. Fátima González Delgado', 'MED018', 'Comportamiento animal', '5550009999', 'fatima.gonzalez@vet.com', true),
('Dr. Raúl Jiménez Cabrera', 'MED019', 'Parasitología', '5550010000', 'raul.jimenez@vet.com', true),
('Dra. Norma Quintero Méndez', 'MED020', 'Microbiología', '5550011111', 'norma.quintero@vet.com', true);

-- ========================
-- INSERT INTO Servicio (20 records)
-- ========================
INSERT INTO "dalton"."Servicio" ("nombre", "descripcion", "costo", "duracion_estimada") VALUES
('Consulta General', 'Revisión veterinaria general completa', 350.00, 30),
('Vacunación Anual', 'Aplicación de vacunas anuales', 200.00, 15),
('Limpieza Dental', 'Limpieza profunda y desinfección de dientes', 850.00, 60),
('Baño y Corte', 'Baño, secado y corte de pelo', 400.00, 45),
('Examen de Laboratorio', 'Análisis de sangre y orina', 600.00, 30),
('Radiografía', 'Toma de radiografías digitales', 450.00, 20),
('Ultrasonido', 'Ecografía completa', 700.00, 40),
('Cirugía Menor', 'Cirugías menores y suturas', 1200.00, 90),
('Esterilización/Castración', 'Cirugía de esterilización o castración', 2000.00, 120),
('Extracción Dental', 'Extracción de piezas dentales', 400.00, 45),
('Desparasitación', 'Tratamiento desparasitante', 250.00, 20),
('Aplicación de Inyectables', 'Inyecciones y medicamentos', 150.00, 10),
('Microchip', 'Colocación de microchip de identificación', 300.00, 15),
('Control de Peso', 'Evaluación y plan nutricional', 300.00, 30),
('Dermatología Aplicada', 'Tratamiento de enfermedades de piel', 500.00, 40),
('Oftalmología Aplicada', 'Revisión y tratamiento ocular', 450.00, 30),
('Fisioterapia', 'Sesión de rehabilitación y fisioterapia', 400.00, 45),
('Acupuntura', 'Sesión de acupuntura veterinaria', 350.00, 50),
('Homeopatía', 'Consulta y tratamiento homeopático', 400.00, 40),
('Seguimiento Post-Operatorio', 'Control y seguimiento post-quirúrgico', 250.00, 20);

-- ========================
-- INSERT INTO Consulta (20 records)
-- ========================
INSERT INTO "dalton"."Consulta" ("id_mascota", "id_veterinario", "fecha", "motivo", "diagnostico", "tratamiento", "estado", "observaciones") VALUES
(1, 1, NOW() - INTERVAL '5 days', 'Revisión general', 'Excelente salud', 'Vacunación de refuerzo', 'finalizada', 'Mascota muy activa'),
(2, 2, NOW() - INTERVAL '10 days', 'Problemas de piel', 'Dermatitis alérgica', 'Medicamento tópico', 'finalizada', 'Seguimiento recomendado'),
(3, 3, NOW() - INTERVAL '3 days', 'Revisión ocular', 'Vista perfecta', 'Ninguno', 'finalizada', 'Sin complicaciones'),
(4, 4, NOW() - INTERVAL '7 days', 'Limpieza dental', 'Sarro moderado', 'Limpieza profunda', 'finalizada', 'Requiere cuidado bucal diario'),
(5, 5, NOW() - INTERVAL '2 days', 'Control nutricional', 'Sobrepeso leve', 'Plan dietético', 'en_proceso', 'Seguimiento mensual'),
(6, 6, NOW() - INTERVAL '15 days', 'Revisión oncológica', 'Sin anomalías', 'Control trimestral', 'finalizada', 'Mascota de edad avanzada'),
(7, 7, NOW() - INTERVAL '8 days', 'Problema cardíaco', 'Soplo cardíaco leve', 'Medicamento cardiaco', 'en_proceso', 'Requiere revisiones periódicas'),
(8, 8, NOW() - INTERVAL '1 day', 'Comportamiento', 'Estrés y ansiedad', 'Medicamento ansiolítico', 'programada', 'Próxima cita en 2 semanas'),
(9, 9, NOW() - INTERVAL '6 days', 'Problema digestivo', 'Gastroenteritis', 'Dieta especial', 'finalizada', 'Mejoría visible'),
(10, 10, NOW() - INTERVAL '12 days', 'Revisión reproductiva', 'Órganos reproducitvos sanos', 'Ninguno', 'finalizada', 'Candidato para reproducción'),
(11, 11, NOW() - INTERVAL '4 days', 'Revisión ocular', 'Cataratas iniciales', 'Control y evaluación', 'en_proceso', 'Seguimiento anual'),
(12, 12, NOW() - INTERVAL '9 days', 'Traumatología', 'Fractura de extremidad', 'Yeso y inmovilización', 'en_proceso', 'Cita de control en 2 semanas'),
(13, 13, NOW() - INTERVAL '11 days', 'Anestesia pre-quirúrgica', 'Evaluación satisfactoria', 'Cirugía permitida', 'finalizada', 'Parámetros normales'),
(14, 14, NOW() - INTERVAL '5 days', 'Radiografía torácica', 'Pulmones normales', 'Ninguno', 'finalizada', 'Sin patologías detectadas'),
(15, 15, NOW() - INTERVAL '2 days', 'Urgencia - Trauma', 'Herida por accidente', 'Sutura y antibiótico', 'finalizada', 'Cicatrización normal'),
(16, 16, NOW() - INTERVAL '8 days', 'Medicina interna', 'Infección urinaria', 'Antibiótico oral', 'en_proceso', 'Reanálisis en 1 semana'),
(17, 17, NOW() - INTERVAL '6 days', 'Endocrinología', 'Diabetes mellitus', 'Insulina y dieta', 'en_proceso', 'Monitoreo semanal'),
(18, 18, NOW() - INTERVAL '3 days', 'Comportamiento felino', 'Agresión territorial', 'Feromonas sintéticas', 'programada', 'Próximo seguimiento en 3 semanas'),
(19, 19, NOW() - INTERVAL '10 days', 'Parasitología', 'Infección por gusanos', 'Desparasitante', 'finalizada', 'Próxima dosis en 2 semanas'),
(20, 20, NOW() - INTERVAL '4 days', 'Microbiología', 'Infección fúngica', 'Antifúngico sistémico', 'en_proceso', 'Control mensual');

-- ========================
-- INSERT INTO Consulta_Servicio (20 records)
-- ========================
INSERT INTO "dalton"."Consulta_Servicio" ("id_consulta", "id_servicio", "cantidad", "subtotal") VALUES
(1, 1, 1, 350.00),
(1, 2, 1, 200.00),
(2, 15, 1, 500.00),
(3, 3, 1, 850.00),
(4, 4, 1, 400.00),
(5, 14, 1, 300.00),
(6, 6, 1, 700.00),
(7, 17, 3, 1200.00),
(8, 18, 1, 350.00),
(9, 1, 1, 350.00),
(10, 13, 1, 300.00),
(11, 11, 1, 250.00),
(12, 7, 1, 700.00),
(13, 5, 1, 600.00),
(14, 8, 1, 1200.00),
(15, 1, 1, 350.00),
(16, 5, 1, 600.00),
(17, 12, 2, 300.00),
(18, 19, 1, 400.00),
(20, 11, 1, 250.00);

-- ========================
-- INSERT INTO Pago (20 records)
-- ========================
INSERT INTO "dalton"."Pago" ("id_consulta", "fecha", "monto", "metodo", "estado") VALUES
(1, NOW() - INTERVAL '5 days', 550.00, 'efectivo', 'pagado'),
(2, NOW() - INTERVAL '10 days', 500.00, 'tarjeta', 'pagado'),
(3, NOW() - INTERVAL '3 days', 850.00, 'transferencia', 'pagado'),
(4, NOW() - INTERVAL '7 days', 400.00, 'tarjeta', 'pagado'),
(5, NOW() - INTERVAL '2 days', 300.00, 'efectivo', 'pendiente'),
(6, NOW() - INTERVAL '15 days', 700.00, 'transferencia', 'pagado'),
(7, NOW() - INTERVAL '8 days', 1200.00, 'tarjeta', 'pagado'),
(8, NOW() - INTERVAL '1 day', 350.00, 'efectivo', 'pendiente'),
(9, NOW() - INTERVAL '6 days', 350.00, 'tarjeta', 'pagado'),
(10, NOW() - INTERVAL '12 days', 300.00, 'cheque', 'pagado'),
(11, NOW() - INTERVAL '4 days', 250.00, 'efectivo', 'pagado'),
(12, NOW() - INTERVAL '9 days', 700.00, 'tarjeta', 'pagado'),
(13, NOW() - INTERVAL '11 days', 600.00, 'transferencia', 'pagado'),
(14, NOW() - INTERVAL '5 days', 1200.00, 'tarjeta', 'pagado'),
(15, NOW() - INTERVAL '2 days', 350.00, 'efectivo', 'pagado'),
(16, NOW() - INTERVAL '8 days', 600.00, 'deposito', 'pagado'),
(17, NOW() - INTERVAL '6 days', 300.00, 'tarjeta', 'pendiente'),
(18, NOW() - INTERVAL '3 days', 400.00, 'efectivo', 'pagado'),
(19, NOW() - INTERVAL '10 days', 250.00, 'transferencia', 'pagado'),
(20, NOW() - INTERVAL '4 days', 250.00, 'tarjeta', 'pagado');

-- ========================
-- INSERT INTO Caja (20 records)
-- ========================
INSERT INTO "dalton"."Caja" ("fecha_apertura", "fecha_cierre", "saldo_inicial", "saldo_final", "observaciones") VALUES
(NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days' + INTERVAL '8 hours', 1000.00, 3450.00, 'Caja del día 1'),
(NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days' + INTERVAL '8 hours', 3450.00, 5120.00, 'Caja del día 2'),
(NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days' + INTERVAL '8 hours', 5120.00, 6890.00, 'Caja del día 3'),
(NOW() - INTERVAL '17 days', NOW() - INTERVAL '17 days' + INTERVAL '8 hours', 6890.00, 7240.00, 'Caja del día 4'),
(NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days' + INTERVAL '8 hours', 7240.00, 8560.00, 'Caja del día 5'),
(NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days' + INTERVAL '8 hours', 8560.00, 9200.00, 'Caja del día 6'),
(NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days' + INTERVAL '8 hours', 9200.00, 11000.00, 'Caja del día 7'),
(NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days' + INTERVAL '8 hours', 1500.00, 3850.00, 'Caja del día 8'),
(NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days' + INTERVAL '8 hours', 3850.00, 5670.00, 'Caja del día 9'),
(NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days' + INTERVAL '8 hours', 5670.00, 7340.00, 'Caja del día 10'),
(NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days' + INTERVAL '8 hours', 7340.00, 8920.00, 'Caja del día 11'),
(NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days' + INTERVAL '8 hours', 8920.00, 10500.00, 'Caja del día 12'),
(NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days' + INTERVAL '8 hours', 10500.00, 12100.00, 'Caja del día 13'),
(NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days' + INTERVAL '8 hours', 1000.00, 4200.00, 'Caja del día 14'),
(NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days' + INTERVAL '8 hours', 4200.00, 6800.00, 'Caja del día 15'),
(NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '8 hours', 6800.00, 8500.00, 'Caja del día 16'),
(NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days' + INTERVAL '8 hours', 8500.00, 10200.00, 'Caja del día 17'),
(NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '8 hours', 10200.00, 12000.00, 'Caja del día 18'),
(NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '8 hours', 12000.00, 13500.00, 'Caja del día 19'),
(NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '8 hours', 2000.00, 5300.00, 'Caja del día 20');

-- ========================
-- INSERT INTO Caja_Movimiento (20 records)
-- ========================
INSERT INTO "dalton"."Caja_Movimiento" ("id_caja", "fecha", "concepto", "monto", "tipo") VALUES
(1, NOW() - INTERVAL '20 days' + INTERVAL '1 hour', 'Pago consulta Max', 550.00, 'Ingreso'),
(1, NOW() - INTERVAL '20 days' + INTERVAL '2 hours', 'Pago servicios', 400.00, 'Ingreso'),
(1, NOW() - INTERVAL '20 days' + INTERVAL '3 hours', 'Cambio', 50.00, 'Egreso'),
(2, NOW() - INTERVAL '19 days' + INTERVAL '1 hour', 'Pago consulta Bella', 500.00, 'Ingreso'),
(2, NOW() - INTERVAL '19 days' + INTERVAL '2 hours', 'Pago productos', 300.00, 'Ingreso'),
(2, NOW() - INTERVAL '19 days' + INTERVAL '3 hours', 'Gastos operativos', 200.00, 'Egreso'),
(3, NOW() - INTERVAL '18 days' + INTERVAL '1 hour', 'Pago limpieza dental', 850.00, 'Ingreso'),
(3, NOW() - INTERVAL '18 days' + INTERVAL '2 hours', 'Pago vacunación', 200.00, 'Ingreso'),
(4, NOW() - INTERVAL '17 days' + INTERVAL '1 hour', 'Pago servicios varios', 400.00, 'Ingreso'),
(4, NOW() - INTERVAL '17 days' + INTERVAL '2 hours', 'Compra de insumos', 100.00, 'Egreso'),
(5, NOW() - INTERVAL '16 days' + INTERVAL '1 hour', 'Pago controlnutricional', 300.00, 'Ingreso'),
(5, NOW() - INTERVAL '16 days' + INTERVAL '2 hours', 'Medicinas', 150.00, 'Egreso'),
(6, NOW() - INTERVAL '15 days' + INTERVAL '1 hour', 'Pago revisión oncológica', 700.00, 'Ingreso'),
(7, NOW() - INTERVAL '14 days' + INTERVAL '1 hour', 'Pago tratamiento cardíaco', 1200.00, 'Ingreso'),
(8, NOW() - INTERVAL '13 days' + INTERVAL '1 hour', 'Pago consulta comportamiento', 350.00, 'Ingreso'),
(9, NOW() - INTERVAL '12 days' + INTERVAL '1 hour', 'Pago tratamiento digestivo', 350.00, 'Ingreso'),
(10, NOW() - INTERVAL '11 days' + INTERVAL '1 hour', 'Pago revisión reproductiva', 300.00, 'Ingreso'),
(11, NOW() - INTERVAL '10 days' + INTERVAL '1 hour', 'Pago revisión ocular', 250.00, 'Ingreso'),
(12, NOW() - INTERVAL '9 days' + INTERVAL '1 hour', 'Pago traumatología', 700.00, 'Ingreso'),
(13, NOW() - INTERVAL '8 days' + INTERVAL '1 hour', 'Pago laboratorio', 600.00, 'Ingreso');

-- ========================
-- INSERT INTO Insumo (20 records)
-- ========================
INSERT INTO "dalton"."Insumo" ("nombre", "descripcion", "unidad", "cantidad_disponible", "costo_unitario", "fecha_registro") VALUES
('Jeringa 3ml', 'Jeringas descartables de 3ml', 'caja', 500, 0.50, NOW() - INTERVAL '30 days'),
('Aguja 25G', 'Agujas 25 gauge para inyecciones', 'caja', 1000, 0.30, NOW() - INTERVAL '30 days'),
('Alcohol 96%', 'Alcohol para desinfección', 'litro', 50, 15.00, NOW() - INTERVAL '25 days'),
('Gasa estéril', 'Gasa estéril 10x10cm', 'paquete', 200, 8.00, NOW() - INTERVAL '25 days'),
('Suero fisiológico', 'Suero fisiológico 0.9%', 'bolsa', 100, 12.00, NOW() - INTERVAL '20 days'),
('Amoxicilina 500mg', 'Antibiótico amoxicilina', 'frasco', 50, 25.00, NOW() - INTERVAL '20 days'),
('Anestésico local', 'Lidocaína 1%', 'frasco', 30, 18.00, NOW() - INTERVAL '15 days'),
('Collarín isabelino', 'Collarín protector varias tallas', 'unidad', 20, 45.00, NOW() - INTERVAL '15 days'),
('Vendaje elástico', 'Vendaje adhesivo 5cm', 'rollo', 80, 6.00, NOW() - INTERVAL '15 days'),
('Termómetro digital', 'Termómetro para mascotas', 'unidad', 10, 120.00, NOW() - INTERVAL '10 days'),
('Otoscopio', 'Otoscopio digital portátil', 'unidad', 3, 450.00, NOW() - INTERVAL '10 days'),
('Oftalmoscopio', 'Oftalmoscopio para revisión ocular', 'unidad', 2, 850.00, NOW() - INTERVAL '10 days'),
('Pulgas y garrapatas spray', 'Spray anti pulgas y garrapatas', 'botella', 100, 25.00, NOW() - INTERVAL '8 days'),
('Desparasitante oral', 'Tabletas desparasitantes', 'frasco', 60, 8.00, NOW() - INTERVAL '8 days'),
('Antibiótico oftálmico', 'Pomada oftálmica antibiótica', 'tubo', 25, 22.00, NOW() - INTERVAL '5 days'),
('Glucosa 5%', 'Solución de glucosa 5%', 'bolsa', 40, 14.00, NOW() - INTERVAL '5 days'),
('Yodo povidona', 'Solución desinfectante', 'botella', 35, 16.00, NOW() - INTERVAL '5 days'),
('Catéter intravenoso', 'Catéter IV 20G', 'caja', 50, 35.00, NOW() - INTERVAL '3 days'),
('Guantes quirúrgicos', 'Guantes estériles talla M', 'caja', 200, 12.00, NOW() - INTERVAL '3 days'),
('Mascarilla N95', 'Mascarillas protectoras', 'caja', 100, 10.00, NOW() - INTERVAL '3 days');

-- ========================
-- INSERT INTO Movimiento_Insumo (20 records)
-- ========================
INSERT INTO "dalton"."Movimiento_Insumo" ("id_insumo", "fecha", "cantidad", "tipo", "motivo", "referencia") VALUES
(1, NOW() - INTERVAL '28 days', 500, 'Entrada', 'Compra a proveedor', 'FACT001'),
(1, NOW() - INTERVAL '20 days', 50, 'Salida', 'Uso en consultas', 'REF001'),
(2, NOW() - INTERVAL '28 days', 1000, 'Entrada', 'Compra a proveedor', 'FACT002'),
(2, NOW() - INTERVAL '15 days', 100, 'Salida', 'Uso en consultas', 'REF002'),
(3, NOW() - INTERVAL '25 days', 50, 'Entrada', 'Compra a proveedor', 'FACT003'),
(3, NOW() - INTERVAL '10 days', 10, 'Salida', 'Uso en desinfección', 'REF003'),
(4, NOW() - INTERVAL '25 days', 200, 'Entrada', 'Compra a proveedor', 'FACT004'),
(4, NOW() - INTERVAL '5 days', 20, 'Salida', 'Uso en curaciones', 'REF004'),
(5, NOW() - INTERVAL '20 days', 100, 'Entrada', 'Compra a proveedor', 'FACT005'),
(5, NOW() - INTERVAL '8 days', 15, 'Salida', 'Uso en tratamientos', 'REF005'),
(6, NOW() - INTERVAL '20 days', 50, 'Entrada', 'Compra a proveedor', 'FACT006'),
(6, NOW() - INTERVAL '6 days', 5, 'Salida', 'Uso en prescripciones', 'REF006'),
(7, NOW() - INTERVAL '15 days', 30, 'Entrada', 'Compra a proveedor', 'FACT007'),
(8, NOW() - INTERVAL '15 days', 20, 'Entrada', 'Compra a proveedor', 'FACT008'),
(9, NOW() - INTERVAL '15 days', 80, 'Entrada', 'Compra a proveedor', 'FACT009'),
(10, NOW() - INTERVAL '10 days', 10, 'Entrada', 'Compra a proveedor', 'FACT010'),
(15, NOW() - INTERVAL '5 days', 25, 'Entrada', 'Compra a proveedor', 'FACT011'),
(16, NOW() - INTERVAL '5 days', 40, 'Entrada', 'Compra a proveedor', 'FACT012'),
(19, NOW() - INTERVAL '3 days', 200, 'Entrada', 'Compra a proveedor', 'FACT013'),
(20, NOW() - INTERVAL '3 days', 100, 'Entrada', 'Compra a proveedor', 'FACT014');

-- ========================
-- INSERT INTO Consulta_Insumo (20 records)
-- ========================
INSERT INTO "dalton"."Consulta_Insumo" ("id_consulta", "id_insumo", "cantidad") VALUES
(1, 1, 2),
(1, 2, 2),
(2, 3, 1),
(2, 4, 3),
(3, 10, 1),
(4, 4, 5),
(4, 7, 1),
(5, 14, 2),
(6, 13, 1),
(7, 6, 1),
(8, 3, 1),
(9, 5, 1),
(10, 15, 1),
(11, 10, 1),
(12, 8, 1),
(13, 1, 1),
(14, 11, 1),
(15, 4, 2),
(16, 6, 1),
(20, 13, 1);

-- ========================
-- INSERT INTO Producto (20 records)
-- ========================
INSERT INTO "dalton"."Producto" ("nombre", "descripcion", "precio", "cantidad_disponible", "categoria", "fecha_registro", "activo") VALUES
('Alimento Premium Perro', 'Alimento seco premium para perros 20kg', 850.00, 30, 'Alimento', NOW() - INTERVAL '30 days', true),
('Alimento Premium Gato', 'Alimento seco premium para gatos 10kg', 650.00, 25, 'Alimento', NOW() - INTERVAL '30 days', true),
('Collar Antipulgas', 'Collar antipulgas duración 8 meses', 250.00, 50, 'Antiparasitarios', NOW() - INTERVAL '25 days', true),
('Pipeta Antipulgas', 'Pipetas antipulgas dosis única', 180.00, 80, 'Antiparasitarios', NOW() - INTERVAL '25 days', true),
('Arena Sanitaria Gato', 'Arena bentonita para arenero 10kg', 120.00, 40, 'Accesorios', NOW() - INTERVAL '20 days', true),
('Cepillo Dental', 'Cepillo y pasta dental para mascotas', 95.00, 60, 'Higiene', NOW() - INTERVAL '20 days', true),
('Juguete Kong', 'Juguete resistente Kong M', 200.00, 35, 'Juguetes', NOW() - INTERVAL '20 days', true),
('Cama Ortopédica', 'Cama con memory foam M', 450.00, 15, 'Accesorios', NOW() - INTERVAL '15 days', true),
('Transportín Viaje', 'Transportín plegable L', 350.00, 20, 'Accesorios', NOW() - INTERVAL '15 days', true),
('Bebedero Automático', 'Bebedero con filtro 2L', 280.00, 25, 'Accesorios', NOW() - INTERVAL '15 days', true),
('Suplemento Articular', 'Suplemento para articulaciones 500ml', 320.00, 18, 'Suplementos', NOW() - INTERVAL '10 days', true),
('Probióticos Mascotas', 'Probióticos en polvo 100g', 180.00, 30, 'Suplementos', NOW() - INTERVAL '10 days', true),
('Champú Desinfectante', 'Champú medicado 500ml', 150.00, 40, 'Higiene', NOW() - INTERVAL '10 days', true),
('Acondicionador Pelaje', 'Acondicionador para pelaje 500ml', 130.00, 35, 'Higiene', NOW() - INTERVAL '10 days', true),
('Vitaminas Complejas', 'Complejo vitamínico masticable', 200.00, 50, 'Suplementos', NOW() - INTERVAL '8 days', true),
('Snack Dentales', 'Golosinas para limpieza dental', 85.00, 100, 'Snacks', NOW() - INTERVAL '5 days', true),
('Juguete Interactivo', 'Juguete puzzle para enriquecimiento', 175.00, 25, 'Juguetes', NOW() - INTERVAL '5 days', true),
('Comida Húmeda Premium', 'Lata comida húmeda premium 400g', 120.00, 70, 'Alimento', NOW() - INTERVAL '5 days', true),
('Galletas Saludables', 'Galletas bajas calorías 250g', 95.00, 85, 'Snacks', NOW() - INTERVAL '3 days', true),
('Kit Aseo Completo', 'Kit limpieza con todos accesorios', 320.00, 12, 'Higiene', NOW() - INTERVAL '3 days', true);

-- ========================
-- INSERT INTO Venta_Producto (20 records)
-- ========================
INSERT INTO "dalton"."Venta_Producto" ("id_producto", "fecha", "cantidad", "subtotal", "id_pago") VALUES
(1, NOW() - INTERVAL '20 days', 2, 1700.00, 1),
(2, NOW() - INTERVAL '19 days', 1, 650.00, 2),
(3, NOW() - INTERVAL '18 days', 3, 750.00, 3),
(4, NOW() - INTERVAL '17 days', 2, 360.00, 4),
(5, NOW() - INTERVAL '16 days', 1, 120.00, 5),
(6, NOW() - INTERVAL '15 days', 2, 190.00, 6),
(7, NOW() - INTERVAL '14 days', 1, 200.00, 7),
(8, NOW() - INTERVAL '13 days', 1, 450.00, 8),
(9, NOW() - INTERVAL '12 days', 2, 700.00, 9),
(10, NOW() - INTERVAL '11 days', 1, 280.00, 10),
(11, NOW() - INTERVAL '10 days', 1, 320.00, 11),
(12, NOW() - INTERVAL '9 days', 3, 540.00, 12),
(13, NOW() - INTERVAL '8 days', 2, 300.00, 13),
(14, NOW() - INTERVAL '7 days', 1, 130.00, 14),
(15, NOW() - INTERVAL '6 days', 2, 400.00, 15),
(16, NOW() - INTERVAL '5 days', 5, 425.00, 16),
(17, NOW() - INTERVAL '4 days', 2, 350.00, 17),
(18, NOW() - INTERVAL '3 days', 4, 480.00, 18),
(19, NOW() - INTERVAL '2 days', 3, 285.00, 19),
(20, NOW() - INTERVAL '1 day', 1, 320.00, 20);

-- ========================
-- INSERT INTO Movimiento (20 records)
-- ========================
INSERT INTO "dalton"."Movimiento" ("fecha", "tipo", "concepto", "monto", "cantidad", "referencia_id", "referencia_tabla", "usuario", "observaciones", "activo") VALUES
(NOW() - INTERVAL '20 days', 'pago_consulta', 'Pago consulta general Max', 550.00, 1, 1, 'Pago', 'Admin1', 'Pago por efectivo', true),
(NOW() - INTERVAL '20 days', 'caja_ingreso', 'Ingreso por servicios', 400.00, 1, 1, 'Caja_Movimiento', 'Admin1', 'Ingreso caja', true),
(NOW() - INTERVAL '19 days', 'pago_consulta', 'Pago consulta Bella', 500.00, 1, 2, 'Pago', 'Admin2', 'Pago por tarjeta', true),
(NOW() - INTERVAL '19 days', 'venta_producto', 'Venta alimento premium', 1700.00, 2, 1, 'Venta_Producto', 'Admin1', 'Venta cliente directo', true),
(NOW() - INTERVAL '18 days', 'caja_ingreso', 'Ingreso venta productos', 1700.00, 2, 2, 'Caja_Movimiento', 'Admin2', 'Ingreso efectivo', true),
(NOW() - INTERVAL '17 days', 'insumo_entrada', 'Entrada insumos farmacéuticos', 500.00, 50, 6, 'Movimiento_Insumo', 'Farmacia', 'Compra proveedor', true),
(NOW() - INTERVAL '16 days', 'caja_egreso', 'Pago compra insumos', 500.00, 50, 6, 'Movimiento_Insumo', 'Admin1', 'Compra a crédito', true),
(NOW() - INTERVAL '15 days', 'insumo_salida', 'Salida insumos por uso', 250.00, 20, 1, 'Movimiento_Insumo', 'Consultorios', 'Uso en procedimientos', true),
(NOW() - INTERVAL '14 days', 'pago_consulta', 'Pago servicios dental', 850.00, 1, 3, 'Pago', 'Admin1', 'Limpieza dental', true),
(NOW() - INTERVAL '13 days', 'venta_producto', 'Venta alimento gato', 650.00, 1, 2, 'Venta_Producto', 'Admin2', 'Venta cliente', true),
(NOW() - INTERVAL '12 days', 'caja_ingreso', 'Ingreso pago dental', 850.00, 1, 3, 'Caja_Movimiento', 'Admin1', 'Pago consulta', true),
(NOW() - INTERVAL '11 days', 'pago_consulta', 'Pago revisión general', 300.00, 1, 5, 'Pago', 'Admin2', 'Control nutricional', true),
(NOW() - INTERVAL '10 days', 'venta_producto', 'Venta collar antipulgas', 750.00, 3, 3, 'Venta_Producto', 'Admin1', 'Venta múltiple', true),
(NOW() - INTERVAL '9 days', 'insumo_entrada', 'Entrada medicinas', 800.00, 100, 6, 'Movimiento_Insumo', 'Farmacia', 'Compra farmacéutica', true),
(NOW() - INTERVAL '8 days', 'caja_egreso', 'Pago farmacia', 800.00, 100, 6, 'Movimiento_Insumo', 'Admin1', 'Pago facturas', true),
(NOW() - INTERVAL '7 days', 'ajuste_inventario', 'Ajuste de inventario', 0.00, 5, 1, 'Producto', 'Admin2', 'Corrección de stock', true),
(NOW() - INTERVAL '6 days', 'pago_consulta', 'Pago consulta oncología', 700.00, 1, 6, 'Pago', 'Admin1', 'Revisión oncológica', true),
(NOW() - INTERVAL '5 days', 'devolucion', 'Devolución de producto', 200.00, 1, 7, 'Venta_Producto', 'Admin2', 'Cliente insatisfecho', true),
(NOW() - INTERVAL '4 days', 'caja_ingreso', 'Ingreso servicios varios', 600.00, 2, 5, 'Caja_Movimiento', 'Admin1', 'Ingresos del día', true),
(NOW() - INTERVAL '3 days', 'pago_consulta', 'Pago consulta trauma', 1200.00, 1, 15, 'Pago', 'Admin2', 'Urgencia atendida', true);
