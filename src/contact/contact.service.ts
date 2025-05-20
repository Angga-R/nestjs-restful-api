/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';
import { ContactValidation } from './contact.validation';
import { User } from 'generated/prisma';
import { ContactResponse, CreateContactRequest } from 'src/model/contact.model';
import { ValidationService } from 'src/common/validation.service';

Injectable();
export class ContactService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async create(
    user: User,
    request: CreateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.debug(
      `user: ${JSON.stringify(user)} ContactService.create(${JSON.stringify(request)})`,
    );

    const validatedData: CreateContactRequest = this.validationService.validate(
      ContactValidation.CREATE,
      request,
    );

    const contact = await this.prismaService.contact.create({
      data: {
        ...validatedData,
        ...{ username: user.username },
      },
    });

    return {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone,
    };
  }
}
