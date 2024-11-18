import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Logger } from 'winston';
import { TestService } from '../test.service';
import { TestModule } from '../test.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('User Controller Test', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
    await app.init();
  });

  describe('POST /api/contacts/', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should create a new contact', async () => {
      const user = await testService.createUser(true);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', token)
        .send({
          first_name: 'Test',
          last_name: '',
          email: 'log@hafizcaniago.my.id',
          phone: '628712312312',
          social_linkedin: 'https://linkedin.com',
          social_fb: 'https://facebook.com',
          social_x: 'https://x.com',
          social_yt: '',
          social_ig: '',
          social_github: '',
          userId: user.id,
        });

      logger.info(contactResponse.body);

      expect(contactResponse.status).toBe(201);
      expect(contactResponse.body.data.first_name).toBe('Test');
    });
  });

  afterAll(async () => {
    await testService.deleteContact();
    await testService.deleteUser();
  });
});
