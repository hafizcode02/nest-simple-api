import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Logger } from 'winston';
import { TestService } from '../test.service';
import { TestModule } from '../test.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('Address Controller Test', () => {
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

  describe('POST /api/contacts/:contactId/addresses/', () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should return 400 if request is invalid', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);

      const token = user.token;
      const addressResponse = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', token)
        .send({
          address: '',
          city: '',
          postal_code: '',
          country: '',
        });

      logger.info(addressResponse.body);

      expect(addressResponse.status).toBe(400);
      expect(addressResponse.body.errors).toBeDefined();
    });

    it('should return 404 if contact not found', async () => {
      const user = await testService.createUser(true);

      const token = user.token;
      const addressResponse = await request(app.getHttpServer())
        .post(`/api/contacts/99/addresses`)
        .set('Authorization', token)
        .send({
          address: 'Jl. Kenangan',
          city: 'Jakarta',
          postal_code: '12345',
          country: 'Indonesia',
        });

      logger.info(addressResponse.body);

      expect(addressResponse.status).toBe(404);
      expect(addressResponse.body.errors).toBeDefined();
      expect(addressResponse.body.errors).toBe('Contact not found');
    });

    it('should return 201 if address created', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);

      const token = user.token;
      const addressResponse = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', token)
        .send({
          street: 'Jl. Kenangan',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          country: 'Indonesia',
          postalCode: '12345',
          detail: 'Rumah warna biru',
        });

      logger.info(addressResponse.body);
      console.log(addressResponse.body);

      expect(addressResponse.status).toBe(201);
      expect(addressResponse.body.data.street).toBe('Jl. Kenangan');
      expect(addressResponse.body.data.city).toBe('Jakarta');
      expect(addressResponse.body.data.province).toBe('DKI Jakarta');
      expect(addressResponse.body.data.country).toBe('Indonesia');
      expect(addressResponse.body.data.postalCode).toBe('12345');
      expect(addressResponse.body.data.detail).toBe('Rumah warna biru');
    });
  });

  describe('GET /api/contacts/:contactId/addresses/', () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should return 404 if contact not found', async () => {
      const user = await testService.createUser(true);

      const token = user.token;
      const addressResponse = await request(app.getHttpServer())
        .get(`/api/contacts/99/addresses`)
        .set('Authorization', token);

      logger.info(addressResponse.body);

      expect(addressResponse.status).toBe(404);
      expect(addressResponse.body.errors).toBeDefined();
      expect(addressResponse.body.errors).toBe('Contact not found');
    });

    it('should return 200 if address found', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);

      await testService.createAddress(contact.id);

      const token = user.token;
      const addressResponse = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', token);

      logger.info(addressResponse.body);

      expect(addressResponse.status).toBe(200);
      expect(addressResponse.body.data.length).toBe(1);
      expect(addressResponse.body.data[0].street).toBe('Jl. Kenangan');
      expect(addressResponse.body.data[0].city).toBe('Jakarta');
      expect(addressResponse.body.data[0].province).toBe('DKI Jakarta');
      expect(addressResponse.body.data[0].country).toBe('Indonesia');
      expect(addressResponse.body.data[0].postalCode).toBe('12345');
      expect(addressResponse.body.data[0].detail).toBe('');
    });
  });

  describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should return 404 if contact not found', async () => {
      const user = await testService.createUser(true);

      const token = user.token;
      const addressResponse = await request(app.getHttpServer())
        .get(`/api/contacts/99/addresses/99`)
        .set('Authorization', token);

      logger.info(addressResponse.body);

      expect(addressResponse.status).toBe(404);
      expect(addressResponse.body.errors).toBeDefined();
      expect(addressResponse.body.errors).toBe('Contact not found');
    });

    it('should return 404 if address not found', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);

      const token = user.token;
      const addressResponse = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/99`)
        .set('Authorization', token);

      logger.info(addressResponse.body);

      expect(addressResponse.status).toBe(404);
      expect(addressResponse.body.errors).toBeDefined();
      expect(addressResponse.body.errors).toBe('Address not found');
    });

    it('should return 200 if address found', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);
      const address = await testService.createAddress(contact.id);

      const token = user.token;
      const addressResponse = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', token);

      logger.info(addressResponse.body);

      expect(addressResponse.status).toBe(200);
      expect(addressResponse.body.data.street).toBe('Jl. Kenangan');
      expect(addressResponse.body.data.city).toBe('Jakarta');
      expect(addressResponse.body.data.province).toBe('DKI Jakarta');
      expect(addressResponse.body.data.country).toBe('Indonesia');
      expect(addressResponse.body.data.postalCode).toBe('12345');
      expect(addressResponse.body.data.detail).toBe('');
    });
  });

  describe('PATCH /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should return 400 if request is invalid', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);
      const address = await testService.createAddress(contact.id);

      const token = user.token;
      const addressResponse = await request(app.getHttpServer())
        .patch(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', token)
        .send({
          address: '',
          city: '',
          postal_code: '',
          country: '',
        });

      logger.info(addressResponse.body);

      expect(addressResponse.status).toBe(400);
      expect(addressResponse.body.errors).toBeDefined();
    });

    it('should return 404 if contact not found', async () => {
      const user = await testService.createUser(true);

      const token = user.token;
      const addressResponse = await request(app.getHttpServer())
        .patch(`/api/contacts/99/addresses/99`)
        .set('Authorization', token)
        .send({
          street: 'Jl. Kenangan',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          country: 'Indonesia',
          postalCode: '12345',
          detail: 'Rumah warna biru',
        });

      logger.info(addressResponse.body);

      expect(addressResponse.status).toBe(404);
      expect(addressResponse.body.errors).toBeDefined();
      expect(addressResponse.body.errors).toBe('Contact not found');
    });

    it('should return 404 if address not found', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);

      const token = user.token;
      const addressResponse = await request(app.getHttpServer())
        .patch(`/api/contacts/${contact.id}/addresses/99`)
        .set('Authorization', token)
        .send({
          street: 'Jl. Kenangan',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          country: 'Indonesia',
          postalCode: '12345',
          detail: 'Rumah warna biru',
        });

      logger.info(addressResponse.body);

      expect(addressResponse.status).toBe(404);
      expect(addressResponse.body.errors).toBeDefined();
      expect(addressResponse.body.errors).toBe('Address not found');
    });

    it('should return 200 if address updated', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);
      const address = await testService.createAddress(contact.id);

      const token = user.token;
      const addressResponse = await request(app.getHttpServer())
        .patch(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', token)
        .send({
          street: 'Jl. Kenangan',
          city: 'Cirebon',
          province: 'Jawa Barat',
          country: 'Indonesia',
          postalCode: '12345',
          detail: 'Rumah warna merah',
        });

      logger.info(addressResponse.body);

      expect(addressResponse.status).toBe(200);
      expect(addressResponse.body.data.street).toBe('Jl. Kenangan');
      expect(addressResponse.body.data.city).toBe('Cirebon');
      expect(addressResponse.body.data.province).toBe('Jawa Barat');
      expect(addressResponse.body.data.country).toBe('Indonesia');
      expect(addressResponse.body.data.postalCode).toBe('12345');
      expect(addressResponse.body.data.detail).toBe('Rumah warna merah');
    });
  });

  describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should return 404 if contact not found', async () => {
      const user = await testService.createUser(true);

      const token = user.token;
      const addressResponse = await request(app.getHttpServer())
        .delete(`/api/contacts/99/addresses/99`)
        .set('Authorization', token);

      logger.info(addressResponse.body);

      expect(addressResponse.status).toBe(404);
      expect(addressResponse.body.errors).toBeDefined();
      expect(addressResponse.body.errors).toBe('Contact not found');
    });

    it('should return 404 if address not found', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);

      const token = user.token;
      const addressResponse = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/99`)
        .set('Authorization', token);

      logger.info(addressResponse.body);

      expect(addressResponse.status).toBe(404);
      expect(addressResponse.body.errors).toBeDefined();
      expect(addressResponse.body.errors).toBe('Address not found');
    });

    it('should return 200 if address deleted', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);
      const address = await testService.createAddress(contact.id);

      const token = user.token;
      const addressResponse = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', token);

      logger.info(addressResponse.body);

      expect(addressResponse.status).toBe(200);
      expect(addressResponse.body.message).toBe('Address deleted successfully');
      expect(addressResponse.body.data).toBe(null);
    });
  });

  afterAll(async () => {
    await testService.deleteAddress();
    await testService.deleteContact();
    await testService.deleteUser();
  });
});
