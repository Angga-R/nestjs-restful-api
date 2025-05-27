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

describe('ContactController', () => {
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

  describe('POST /api/contact/create', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createToken();
    });

    afterEach(async () => {
      await testService.deleteAll();
    });

    it('should be able to create new contact', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contact/create')
        .set('Authorization', 'test')
        .send({
          first_name: 'test',
          last_name: 'test',
          email: 'test@gmail.com',
          phone: '099898565',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.first_name).toBe('test');
      expect(response.body.data.last_name).toBe('test');
      expect(response.body.data.email).toBe('test@gmail.com');
      expect(response.body.data.phone).toBe('099898565');
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contact/create')
        .set('Authorization', 'test')
        .send({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/contact/:id', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createToken();
    });

    afterEach(async () => {
      await testService.deleteAll();
    });

    it('should can get contact by Id', async () => {
      const contactId = await testService.createContact();

      const response = await request(app.getHttpServer())
        .get(`/api/contact/${contactId}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should throw an error when id not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contact/457`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/contact/update', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createToken();
    });

    afterEach(async () => {
      await testService.deleteAll();
    });

    it('should be able to update contact', async () => {
      const contactId = await testService.createContact();

      const response = await request(app.getHttpServer())
        .put(`/api/contact/update`)
        .set('Authorization', 'test')
        .send({
          id: contactId,
          first_name: 'test2',
          last_name: 'test2',
          email: 'test2@email.com',
          phone: '987654321',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(contactId);
      expect(response.body.data.first_name).toBe('test2');
      expect(response.body.data.last_name).toBe('test2');
      expect(response.body.data.email).toBe('test2@email.com');
      expect(response.body.data.phone).toBe('987654321');
    });

    it('should be rejected when id not found', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/contact/update`)
        .set('Authorization', 'test')
        .send({
          id: 457,
          first_name: 'test2',
          last_name: 'test2',
          email: 'test2@email.com',
          phone: '987654321',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/contact/:id/remove', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createToken();
    });

    afterEach(async () => {
      await testService.deleteAll();
    });

    it('should be remove contact', async () => {
      const contactId = await testService.createContact();

      const response = await request(app.getHttpServer())
        .delete(`/api/contact/${contactId}/remove`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('should be rejected when id not found', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/contact/467/remove`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
  });
});
