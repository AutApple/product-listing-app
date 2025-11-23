import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TypeORMErrorFilter } from './common/filters/typeorm-errors.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  // TypeORM errors filter
  app.useGlobalFilters(new TypeORMErrorFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
