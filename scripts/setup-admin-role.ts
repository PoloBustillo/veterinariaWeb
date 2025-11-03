import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function actualizarRoles() {
  try {
    console.log("🔄 Actualizando rol de Patricia Flores a admin...");

    const patricia = await prisma.veterinario.update({
      where: {
        correo: "patricia.flores@vet.com",
      },
      data: {
        rol: "admin",
      },
    });

    console.log("✅ Patricia Flores actualizada como admin:", patricia);

    // Verificar todos los veterinarios
    const veterinarios = await prisma.veterinario.findMany({
      select: {
        id_veterinario: true,
        nombre_completo: true,
        correo: true,
        rol: true,
      },
      orderBy: {
        id_veterinario: "asc",
      },
    });

    console.log("\n📋 Veterinarios en el sistema:");
    console.table(veterinarios);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

actualizarRoles();
