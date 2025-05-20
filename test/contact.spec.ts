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

describe('UserController', () => {
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
      await testService.deleteContact();
      await testService.deleteUser();
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
  });
});
