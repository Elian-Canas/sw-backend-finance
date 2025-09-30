import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DatabaseSeeder } from './seeds';

async function bootstrap() {
  try {
    // Crear contexto de aplicación (sin servidor HTTP)
    const app = await NestFactory.createApplicationContext(AppModule);

    // Obtener el seeder desde el contenedor de inyección de dependencias
    const seeder = app.get(DatabaseSeeder);

    // Ejecutar todos los seeds
    await seeder.run();

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