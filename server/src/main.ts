import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { TypeORMErrorFilter } from './common/filters/typeorm-errors.filter.js';
import session from 'express-session';
import { globalAuthConfiguration } from './config/auth.config.js';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  // Sessions middleware
  app.use(
    session({
      secret: globalAuthConfiguration.sessionSecret,
      resave: false, 
      saveUninitialized: true,
      cookie: {
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,

      }
    })
  );
  // TypeORM errors filter
  app.useGlobalFilters(new TypeORMErrorFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
