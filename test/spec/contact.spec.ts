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

    it('should return 400 if request is invalid', async () => {
      const user = await testService.createUser(true);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', token)
        .send({
          first_name: '',
          last_name: '',
          email: '',
        });

      expect(contactResponse.status).toBe(400);
      expect(contactResponse.body.errors).toBeDefined();
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
        });

      logger.info(contactResponse.body);

      expect(contactResponse.status).toBe(201);
      expect(contactResponse.body.data.first_name).toBe('Test');
    });
  });

  describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should return 404 if contact not found', async () => {
      const user = await testService.createUser(true);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .get('/api/contacts/1')
        .set('Authorization', token);

      expect(contactResponse.status).toBe(404);
      expect(contactResponse.body.errors).toBeDefined();
    });

    it('should return a contact', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}`)
        .set('Authorization', token);

      logger.info(contactResponse.body);

      expect(contactResponse.status).toBe(200);
      expect(contactResponse.body.data.id).toBe(contact.id);
    });
  });

  describe('PATCH /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should return 404 if contact not found', async () => {
      const user = await testService.createUser(true);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .patch('/api/contacts/99')
        .set('Authorization', token)
        .send({
          first_name: 'Test',
        });

      expect(contactResponse.status).toBe(404);
      expect(contactResponse.body.errors).toBeDefined();
    });

    it('should return 400 if request is invalid', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .patch(`/api/contacts/${contact.id}`)
        .set('Authorization', token)
        .send({
          first_name: '',
        });

      expect(contactResponse.status).toBe(400);
      expect(contactResponse.body.errors).toBeDefined();
    });

    it('should update a contact', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .patch(`/api/contacts/${contact.id}`)
        .set('Authorization', token)
        .send({
          first_name: 'Test',
        });

      logger.info(contactResponse.body);

      expect(contactResponse.status).toBe(200);
      expect(contactResponse.body.data.first_name).toBe('Test');
    });
  });

  describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should return 404 if contact not found', async () => {
      const user = await testService.createUser(true);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .delete('/api/contacts/99')
        .set('Authorization', token);

      expect(contactResponse.status).toBe(404);
      expect(contactResponse.body.errors).toBeDefined();
    });

    it('should delete a contact', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}`)
        .set('Authorization', token);

      expect(contactResponse.status).toBe(200);
    });
  });

  describe('POST /api/contacts/:contactId/upload', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should return 404 if contact not found', async () => {
      const user = await testService.createUser(true);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .post('/api/contacts/99/upload')
        .set('Authorization', token)
        .attach('file', 'test/assets/test.png');

      console.log(contactResponse.body);

      expect(contactResponse.status).toBe(404);
      expect(contactResponse.body.errors).toBeDefined();
    });

    it('should upload a photo', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/upload`)
        .set('Authorization', token)
        .attach('file', 'test/assets/test.png');

      logger.info(contactResponse.body);
      console.log(contactResponse.body);

      expect(contactResponse.status).toBe(201);
      expect(contactResponse.body.data.photo).toBeDefined();
    });
  });

  describe('GET /api/contacts/', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should return a list of contacts', async () => {
      const user = await testService.createUser(true);
      await testService.createContact(user.id);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .get('/api/contacts')
        .set('Authorization', token);

      logger.info(contactResponse.body);

      expect(contactResponse.status).toBe(200);
      expect(contactResponse.body.data).toBeDefined();
    });

    it('should return a list of contacts with search', async () => {
      const user = await testService.createUser(true);
      await testService.createContact(user.id);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .get('/api/contacts')
        .query({ name: 'Test' })
        .set('Authorization', token);

      logger.info(contactResponse.body);

      expect(contactResponse.status).toBe(200);
      expect(contactResponse.body.data).toBeDefined();
    });

    it('should be able to search contacts with page', async () => {
      const user = await testService.createUser(true);
      await testService.createContact(user.id);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .get('/api/contacts')
        .query({ page: 1, size: 10 })
        .set('Authorization', token);

      logger.info(contactResponse.body);
      console.log(contactResponse.body);

      expect(contactResponse.status).toBe(200);
      expect(contactResponse.body.data).toBeDefined();
    });
  });

  afterAll(async () => {
    await testService.deleteContact();
    await testService.deleteUser();
  });
});
