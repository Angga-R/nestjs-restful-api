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
});
