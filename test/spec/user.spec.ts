import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../../src/app.module';
import { Logger } from 'winston';
import { TestService } from './../test.service';
import { TestModule } from './../test.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { HashidService } from '../../src/common/helper/hashid.service';

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
      await testService.deleteAllUser();
    });

    it('should be return 400 when request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({ email: 'test', password: 'test' });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be return 201 when request is valid and success register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          email: 'cohaza1900@getairmail.com', // temp mail
          name: 'example',
          username: 'example',
          password: 'secret123',
          confirmPassword: 'secret123',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe('cohaza1900@getairmail.com');
      expect(response.body.data.emailSent).toBe(true);
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
    }, 30000);

    it('should be return 200 and can verify email users', async () => {
      const user = await testService.createUser();
      const response = await request(app.getHttpServer()).get(
        `/api/users/verify-email/${hashIdService.encode(user.id)}`,
      );

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Email Verified Successfully');
    }, 30000);
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser(true);
    });

    it('should be return 400 when request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({ username: 'test' });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be return 401 if account is not verified', async () => {
      await testService.deleteUser();
      await testService.createUser(false);

      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 't.hafigo',
          password: 'secret123',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be return 200 when request is valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 't.hafigo',
          password: 'secret123',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe('log@hafizcaniago.my.id');
      expect(response.body.data.username).toBe('t.hafigo');
      expect(response.body.data.name).toBe('Hafiz Caniago');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.emailSent).toBeUndefined();
    });
  });

  describe('GET /api/users/current', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser(true);
    });

    it('should be return 401 when token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'thisisinvalidtoken');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be return 200 when token is valid', async () => {
      await testService.deleteUser();
      const user = await testService.createUser(true);
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', user.token);

      logger.info(response.body);

      expect(response.body.data.email).toBe('log@hafizcaniago.my.id');
      expect(response.body.data.username).toBe('t.hafigo');
      expect(response.body.data.name).toBe('Hafiz Caniago');
    });

    it('should be return 401 when token is expired', async () => {
      await testService.deleteUser();
      const user = await testService.createUser(true);
      await testService.updateUserTokenExp();

      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', user.token);

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Unauthorized');
    });
  });

  describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser(true);
    });

    it('should be return 401 when token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'thisisinvalidtoken');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be return 400 when request is invalid', async () => {
      await testService.deleteUser();
      const user = await testService.createUser(true);
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', user.token)
        .send({ name: 'Hafigo', password: '' });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be return 200 when request is valid', async () => {
      await testService.deleteUser();
      const user = await testService.createUser(true);
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', user.token)
        .send({ name: 'Hafigo' });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe('log@hafizcaniago.my.id');
      expect(response.body.data.name).toBe('Hafigo');
    });

    it('should be return 400 when password and confirmPassword is not match', async () => {
      await testService.deleteUser();
      const user = await testService.createUser(true);
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', user.token)
        .send({ password: 'pass125', confirmPassword: 'pass123456' });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be change password (return 200) and login again and return success', async () => {
      await testService.deleteUser();
      const user = await testService.createUser(true);
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', user.token)
        .send({ password: 'pass12345', confirmPassword: 'pass12345' });

      logger.info(response.body);

      expect(response.status).toBe(200);

      const loginResponse = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 't.hafigo',
          password: 'pass12345',
        });

      logger.info(loginResponse.body);

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.data.token).toBeDefined();
    });
  });

  describe('POST /api/users/logout', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser(true);
    });

    it('should be return 401 when token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/logout')
        .set('Authorization', 'thisisinvalidtoken');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be return 200 when token is valid', async () => {
      await testService.deleteUser();
      const user = await testService.createUser(true);
      const response = await request(app.getHttpServer())
        .post('/api/users/logout')
        .set('Authorization', user.token);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logged out successfully');

      const checkUserTokenIsDeleted = await testService.getUser();
      expect(checkUserTokenIsDeleted.token).toBeNull();
      expect(checkUserTokenIsDeleted.tokenExp).toBeNull();
    });
  });

  afterAll(async () => {
    await testService.deleteAllUser();
  });
});
