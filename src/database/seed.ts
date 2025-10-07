import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DatabaseSeeder } from './seeds';

async function bootstrap() {
  try {
    // Obtener argumentos de línea de comandos
    const args = process.argv.slice(2);
    const seederName = args[0]; // Primer argumento es el nombre del seeder

    // Validar comandos especiales
    if (seederName === '--list') {
      const app = await NestFactory.createApplicationContext(AppModule);
      const seeder = app.get(DatabaseSeeder);
      console.log('📋 Available seeders:');
      seeder.listSeeders().forEach((name) => console.log(`  - ${name}`));
      await app.close();
      process.exit(0);
    }

    // Crear contexto de aplicación (sin servidor HTTP)
    const app = await NestFactory.createApplicationContext(AppModule);

    // Obtener el seeder desde el contenedor de inyección de dependencias
    const seeder = app.get(DatabaseSeeder);

    // Ejecutar seeder específico o todos
    if (seederName) {
      console.log(`Running seeder: ${seederName}`);
      await seeder.run(seederName);
    } else {
      console.log('Running all seeders');
      await seeder.run();
    }

    // Cerrar conexiones
    await app.close();

    console.log('\n🎉 Seed process completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed process failed:', error);
    process.exit(1);
  }
}

bootstrap();
