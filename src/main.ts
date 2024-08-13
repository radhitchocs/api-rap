import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { AppModule } from './app.module';
import { AllExceptionFilter } from './filter/all-exception.filter';
import { AuthorizationGuard } from './guard/authorization.guard';
import { TransformInterceptor } from './interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const jwtService = app.get<JwtService>(JwtService);
  const reflector = app.get(Reflector);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
  app.useGlobalGuards(new AuthorizationGuard(reflector, jwtService));
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  const port = configService.get('APP_PORT');
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
