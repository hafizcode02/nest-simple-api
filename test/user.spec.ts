import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { HashidService } from '../src/common/hashid.service';

describe('User Controller Test', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;
  let hashIdService: HashidService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
    hashIdService = app.get(HashidService);
    await app.init();
  });

  describe('POST /api/users', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should be return 400 when request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({ email: 'test', password: 'test' });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be return 201 when request is valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          email: 'log@hafizcaniago.my.id',
          name: 'Hafiz Caniago',
          username: 't.hafigo',
          password: 'secret123',
          confirmPassword: 'secret123',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe('log@hafizcaniago.my.id');
    });

    it('should be return 400 when username or email is already taken', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          email: 'log@hafizcaniago.my.id',
          name: 'Hafiz Caniago',
          username: 't.hafigo',
          password: 'secret123',
          confirmPassword: 'secret123',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be return 200 and can verify email users', async () => {
      const user = await testService.createUser();
      const response = await request(app.getHttpServer()).get(
        `/api/users/verify-email/${hashIdService.encode(user.id)}`,
      );

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Email Verified Successfully');
    });
  });
});
