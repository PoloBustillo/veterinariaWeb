import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function agregarPasswordsVeterinarios() {
  try {
    console.log(
      "🔄 Agregando campo password y migrando contraseñas de veterinarios..."
    );

    // Primero, intentar agregar la columna con SQL crudo
    try {
      await prisma.$executeRaw`
        ALTER TABLE dalton."Veterinario" 
        ADD COLUMN IF NOT EXISTS password VARCHAR(255)
      `;
      console.log("✅ Campo password agregado a la tabla Veterinario");
    } catch (error) {
      console.log("⚠️ El campo password ya existe o hubo un error:", error);
    }

    // Ahora, obtener todos los veterinarios
    const veterinarios = await prisma.$queryRaw<any[]>`
      SELECT 
        id_veterinario,
        nombre_completo,
        correo,
        cedula,
        password
      FROM dalton."Veterinario"
      WHERE activo = true
      ORDER BY id_veterinario
    `;

    console.log(`\n📊 Encontrados ${veterinarios.length} veterinarios activos`);

    let migrados = 0;
    let yaConPassword = 0;
    let errores = 0;

    for (const vet of veterinarios) {
      try {
        // Si ya tiene password, saltar
        if (vet.password) {
          console.log(`⏭️  ${vet.nombre_completo} ya tiene password`);
          yaConPassword++;
          continue;
        }

        // Usar la cédula como password temporal (sin guiones ni espacios)
        const cedula = vet.cedula?.replace(/[-\s]/g, "") || "VET123456";

        // Hashear la cédula
        const hashedPassword = await bcrypt.hash(cedula, 10);

        // Actualizar en la base de datos usando SQL crudo
        await prisma.$executeRaw`
          UPDATE dalton."Veterinario" 
          SET password = ${hashedPassword}
          WHERE id_veterinario = ${vet.id_veterinario}
        `;

        console.log(
          `✅ ${vet.nombre_completo} (${
            vet.correo || "sin correo"
          }) - Password: ${cedula}`
        );
        migrados++;
      } catch (error) {
        console.error(
          `❌ Error con veterinario ${vet.nombre_completo}:`,
          error
        );
        errores++;
      }
    }

    console.log("\n📈 Resumen:");
    console.log(`✅ Migrados: ${migrados}`);
    console.log(`⏭️  Ya tenían password: ${yaConPassword}`);
    console.log(`❌ Errores: ${errores}`);
    console.log("\n✨ Proceso completado!");

    if (migrados > 0) {
      console.log("\n📝 Los veterinarios pueden iniciar sesión con:");
      console.log("   - Correo: su correo electrónico registrado");
      console.log("   - Password: su cédula (sin guiones ni espacios)");
      console.log(
        "\n💡 Ejemplo: si la cédula es '123-456789-0', el password es '1234567890'"
      );
    }
  } catch (error) {
    console.error("❌ Error fatal en el proceso:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el proceso
agregarPasswordsVeterinarios()
  .catch(console.error)
  .finally(() => process.exit());
