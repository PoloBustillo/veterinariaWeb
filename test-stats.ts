// Script para verificar las consultas exitosas en la base de datos
import { prisma } from "./lib/prisma";

async function main() {
  try {
    console.log("🔍 Consultando estadísticas de la base de datos...\n");

    // Consultas por estado
    const consultasPorEstado = await prisma.consulta.groupBy({
      by: ["estado"],
      _count: {
        id_consulta: true,
      },
    });

    console.log("📊 Consultas por estado:");
    consultasPorEstado.forEach((item) => {
      console.log(`   ${item.estado}: ${item._count.id_consulta}`);
    });

    // Total de consultas
    const totalConsultas = await prisma.consulta.count();

    // Consultas finalizadas (exitosas)
    const consultasExitosas = await prisma.consulta.count({
      where: {
        estado: "finalizada",
      },
    });

    console.log(`\n✅ Total de consultas: ${totalConsultas}`);
    console.log(`✅ Consultas exitosas (finalizadas): ${consultasExitosas}`);
    console.log(
      `📈 Porcentaje de éxito: ${(
        (consultasExitosas / totalConsultas) *
        100
      ).toFixed(1)}%`
    );

    // Veterinarios activos
    const veterinariosActivos = await prisma.veterinario.count({
      where: {
        activo: true,
      },
    });

    console.log(`\n👨‍⚕️ Veterinarios activos: ${veterinariosActivos}`);

    // Total de mascotas
    const totalMascotas = await prisma.mascota.count();
    console.log(`🐾 Total de mascotas registradas: ${totalMascotas}`);

    // Total de dueños
    const totalDuenos = await prisma.dueno.count();
    console.log(`👥 Total de dueños registrados: ${totalDuenos}`);
  } catch (error) {
    console.error("❌ Error al consultar estadísticas:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
