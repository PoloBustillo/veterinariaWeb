// Script para migrar usuarios existentes con passwords temporales hasheados
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function migrarPasswords() {
  console.log("🔄 Iniciando migración de passwords...\n");

  // Obtener todos los dueños sin password hasheado
  const duenos = await prisma.dueno.findMany({
    where: {
      correo: { not: null },
      password: null,
    },
  });

  console.log(`📊 Encontrados ${duenos.length} dueños sin password\n`);

  let migrados = 0;
  let errores = 0;

  for (const dueno of duenos) {
    try {
      // Crear password temporal: últimos 4 dígitos del teléfono o "123456"
      const passwordTemporal = dueno.telefono?.slice(-4) || "123456";
      const hashedPassword = await bcrypt.hash(passwordTemporal, 10);

      await prisma.dueno.update({
        where: { id_dueno: dueno.id_dueno },
        data: { password: hashedPassword },
      });

      console.log(
        `✅ ${dueno.nombre_completo} (${dueno.correo}) - Password: ${passwordTemporal}`
      );
      migrados++;
    } catch (error) {
      console.error(
        `❌ Error con ${dueno.nombre_completo}:`,
        error instanceof Error ? error.message : error
      );
      errores++;
    }
  }

  console.log(`\n📈 Resumen:`);
  console.log(`   ✅ Migrados: ${migrados}`);
  console.log(`   ❌ Errores: ${errores}`);
  console.log(`   📊 Total: ${duenos.length}`);
  console.log("\n✨ Migración completada!");
}

migrarPasswords()
  .catch((error) => {
    console.error("💥 Error fatal:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
