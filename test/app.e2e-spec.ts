import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthorizationGuard } from '../src/guard/authorization.guard';
import { AllExceptionFilter } from '../src/filter/all-exception.filter';
import { TransformInterceptor } from '../src/interceptor/transform.interceptor';
import { UserService } from '../src/module/users/service/users.service';

describe('Auth Token (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let token: string;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri() || 'mongodb://localhost:27017/api-rap';

    const { AppModule } = await import('../src/app.module');
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    const reflector = app.get(Reflector);
    const jwtService = app.get(JwtService);
    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (errors) => new BadRequestException(errors),
      }),
    );
    app.useGlobalGuards(new AuthorizationGuard(reflector, jwtService));
    app.useGlobalFilters(new AllExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor(reflector));
    await app.init();
    server = app.getHttpServer();

    // Seed admin user if not exists
    const userService = app.get(UserService);
    const existing = await userService.findByUsername('admin');
    if (!existing) {
      await userService.create({
        name: 'Admin',
        username: 'admin',
        email: 'admin@example.com',
        roles: ['ADMIN'],
        password: 'rahasia',
      });
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it('should return 403 without token', async () => {
    await request(server).get('/products').expect(403);
  });

  it('should login and get token', async () => {
    const res = await request(server)
      .post('/auth/login')
      .send({ username: 'admin', password: 'rahasia' })
      .expect(201);

    expect(res.body.data.access_token).toBeDefined();
    token = res.body.data.access_token;
  });

  it('should access protected route with valid token', async () => {
    const res = await request(server)
      .get('/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
    // AllExceptionFilter wraps unknown errors as 'Service error' message
    expect(res.body.message).toBe('Service error');
  });
});