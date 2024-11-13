import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('User Controller Test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /api/users', () => {
    it('should be return 400 when request is invalid', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send({ email: 'test', password: 'test' })
        .expect(400);
    });
  });
});
