// Test script para verificar los veterinarios en la base de datos
import { prisma } from './lib/prisma';

async function main() {
  try {
    console.log('🔍 Consultando veterinarios en la base de datos...\n');
    
    const veterinarios = await prisma.veterinario.findMany({
      where: {
        activo: true,
      },
      orderBy: {
        nombre_completo: 'asc',
      },
    });

    console.log(`✅ Se encontraron ${veterinarios.length} veterinarios activos:\n`);
    
    veterinarios.forEach((vet, index) => {
      console.log(`${index + 1}. ${vet.nombre_completo}`);
      if (vet.especialidad) {
        console.log(`   Especialidad: ${vet.especialidad}`);
      }
      if (vet.cedula) {
        console.log(`   Cédula: ${vet.cedula}`);
      }
      if (vet.telefono) {
        console.log(`   Teléfono: ${vet.telefono}`);
      }
      if (vet.correo) {
        console.log(`   Correo: ${vet.correo}`);
      }
      console.log('');
    });

    // Estadísticas adicionales
    const totalVeterinarios = await prisma.veterinario.count();
    const inactivos = totalVeterinarios - veterinarios.length;
    
    console.log('\n📊 Estadísticas:');
    console.log(`Total de veterinarios: ${totalVeterinarios}`);
    console.log(`Activos: ${veterinarios.length}`);
    console.log(`Inactivos: ${inactivos}`);
    
  } catch (error) {
    console.error('❌ Error al consultar veterinarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
