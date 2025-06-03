/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from './../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';

describe('AddressService', () => {
  let app: INestApplication<App>;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    testService = app.get(TestService);
    logger = app.get(WINSTON_MODULE_PROVIDER);
    await app.init();
  });

  describe('POST /api/contact/:contactId/address/create', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createToken();
    });

    afterEach(async () => {
      await testService.deleteAll();
    });

    it('should be able to create new address', async () => {
      const contactId: number = await testService.createContact();

      const response = await request(app.getHttpServer())
        .post(`/api/contact/${contactId}/address/create`)
        .set('Authorization', 'test')
        .send({
          street: 'test street',
          city: 'test city',
          province: 'test province',
          country: 'test',
          postal_code: '2525612',
        });

      logger.info('------------');
      logger.info(response.body);
      logger.info('------------');

      expect(response.status).toBe(200);
      expect(response.body.data.street).toBe('test street');
      expect(response.body.data.city).toBe('test city');
      expect(response.body.data.province).toBe('test province');
      expect(response.body.data.country).toBe('test');
      expect(response.body.data.postal_code).toBe('2525612');
    });

    it('should return error when contactId not found', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/contact/${859646405}/address/create`)
        .set('Authorization', 'test')
        .send({
          street: 'test street',
          city: 'test city',
          province: 'test province',
          country: 'test',
          postal_code: '2525612',
        });

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if request is invalid', async () => {
      const contactId: number = await testService.createContact();

      const response = await request(app.getHttpServer())
        .post(`/api/contact/${contactId}/address/create`)
        .set('Authorization', 'test')
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/contact/:contactId/address/:id', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createToken();
    });

    afterEach(async () => {
      await testService.deleteAll();
    });

    it('should be able to get address by Id', async () => {
      const contactId: number = await testService.createContact();
      const addressId: number = await testService.createAddress(contactId);

      const response = await request(app.getHttpServer())
        .get(`/api/contact/${contactId}/address/${addressId}`)
        .set('Authorization', 'test');

      logger.info('------------');
      logger.info(response.body);
      logger.info('------------');

      expect(response.status).toBe(200);
      expect(response.body.data.street).toBe('test street');
      expect(response.body.data.city).toBe('test city');
      expect(response.body.data.province).toBe('test province');
      expect(response.body.data.country).toBe('test');
      expect(response.body.data.postal_code).toBe('2525612');
    });

    it('should return error when contactId not found', async () => {
      const contactId: number = await testService.createContact();
      const addressId: number = await testService.createAddress(contactId);

      const response = await request(app.getHttpServer())
        .get(`/api/contact/${4676546464}/address/${addressId}`)
        .set('Authorization', 'test');

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should return error when addressId not found', async () => {
      const contactId: number = await testService.createContact();

      const response = await request(app.getHttpServer())
        .get(`/api/contact/${contactId}/address/${85493574395}`)
        .set('Authorization', 'test');

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/contact/:contactId/address/:id/remove', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createToken();
    });

    afterEach(async () => {
      await testService.deleteAll();
    });

    it('should be able to remove address', async () => {
      const contactId: number = await testService.createContact();
      const addressId: number = await testService.createAddress(contactId);

      const response = await request(app.getHttpServer())
        .delete(`/api/contact/${contactId}/address/${addressId}/remove`)
        .set('Authorization', 'test');

      logger.info('------------');
      logger.info(response.body);
      logger.info('------------');

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('should return error when contactId not found', async () => {
      const contactId: number = await testService.createContact();
      const addressId: number = await testService.createAddress(contactId);

      const response = await request(app.getHttpServer())
        .delete(`/api/contact/${4389543953}/address/${addressId}/remove`)
        .set('Authorization', 'test');

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should return error when addressId not found', async () => {
      const contactId: number = await testService.createContact();

      const response = await request(app.getHttpServer())
        .delete(`/api/contact/${contactId}/address/${5839257353}/remove`)
        .set('Authorization', 'test');

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PATCH /api/contact/:contactId/address/:id/update', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createToken();
    });

    afterEach(async () => {
      await testService.deleteAll();
    });

    it('should be able to update address', async () => {
      const contactId: number = await testService.createContact();
      const addressId: number = await testService.createAddress(contactId);

      const response = await request(app.getHttpServer())
        .patch(`/api/contact/${contactId}/address/${addressId}/update`)
        .set('Authorization', 'test')
        .send({
          street: 'Jalan test',
          city: 'Kota test',
        });

      logger.info('------------');
      logger.info(response.body);
      logger.info('------------');

      expect(response.status).toBe(200);
      expect(response.body.data.street).toBe('Jalan test');
      expect(response.body.data.city).toBe('Kota test');
      expect(response.body.data.province).toBe('test province');
      expect(response.body.data.country).toBe('test');
      expect(response.body.data.postal_code).toBe('2525612');
    });

    it('should be rejected if request invalid', async () => {
      const contactId: number = await testService.createContact();
      const addressId: number = await testService.createAddress(contactId);

      const response = await request(app.getHttpServer())
        .patch(`/api/contact/${contactId}/address/${addressId}/update`)
        .set('Authorization', 'test')
        .send({
          street: '',
          city: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return error when contactId not found', async () => {
      const contactId: number = await testService.createContact();
      const addressId: number = await testService.createAddress(contactId);

      const response = await request(app.getHttpServer())
        .patch(`/api/contact/${4389543953}/address/${addressId}/update`)
        .set('Authorization', 'test');

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should return error when addressId not found', async () => {
      const contactId: number = await testService.createContact();

      const response = await request(app.getHttpServer())
        .patch(`/api/contact/${contactId}/address/${5839257353}/update`)
        .set('Authorization', 'test');

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
  });
});
