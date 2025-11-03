import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verificarPatricia() {
  try {
    console.log("🔍 Verificando rol de Patricia...\n");

    const patricia = await prisma.veterinario.findFirst({
      where: {
        correo: "patricia.flores@vet.com",
      },
      select: {
        id_veterinario: true,
        nombre_completo: true,
        correo: true,
        rol: true,
      }
    });

    if (patricia) {
      console.log("✅ Patricia encontrada:");
      console.log(patricia);
      console.log("\n🔑 isAdmin debería ser:", patricia.rol === "admin");
    } else {
      console.log("❌ Patricia NO encontrada en la base de datos");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarPatricia();
