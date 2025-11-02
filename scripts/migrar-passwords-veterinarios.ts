import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function migrarPasswordsVeterinarios() {
  try {
    console.log("🔄 Iniciando migración de passwords para veterinarios...");

    // Obtener todos los veterinarios sin password
    const veterinarios = await prisma.veterinario.findMany({
      where: {
        OR: [{ password: null }, { password: "" }],
      },
    });

    console.log(
      `📊 Encontrados ${veterinarios.length} veterinarios sin password`
    );

    let migrados = 0;
    let errores = 0;

    for (const vet of veterinarios) {
      try {
        // Usar la cédula como password temporal (sin guiones ni espacios)
        const cedula = vet.cedula?.replace(/[-\s]/g, "") || "VET123456";

        // Hashear la cédula
        const hashedPassword = await bcrypt.hash(cedula, 10);

        // Actualizar en la base de datos
        await prisma.veterinario.update({
          where: { id_veterinario: vet.id_veterinario },
          data: { password: hashedPassword },
        });

        console.log(
          `✅ ${vet.nombre_completo} (${vet.correo}) - Password: ${cedula}`
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
    console.log(`❌ Errores: ${errores}`);
    console.log("\n✨ Migración completada!");
    console.log("\n📝 Los veterinarios pueden iniciar sesión con:");
    console.log("   - Correo: su correo electrónico");
    console.log("   - Password: su cédula (sin guiones ni espacios)");
  } catch (error) {
    console.error("❌ Error fatal en la migración:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la migración
migrarPasswordsVeterinarios()
  .catch(console.error)
  .finally(() => process.exit());
