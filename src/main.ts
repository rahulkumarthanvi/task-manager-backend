import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const defaultOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? defaultOrigin
        : [defaultOrigin, 'http://localhost:3001'],
    credentials: true,
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Backend running on port ${port}`);
}

bootstrap();
