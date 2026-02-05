import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm'; // 👈 Importa esta clase
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);

  const filePath = path.join(__dirname, '..', 'database', 'seed.sql');
  if (fs.existsSync(filePath)) {
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log('Ejecutando seed.sql...');
    await dataSource.query(sql);
    console.log('✔️ Seed ejecutado correctamente');
  } else {
    console.warn('⚠️ No se encontró el archivo seed.sql');
  }

  await app.close();
}

bootstrap();
