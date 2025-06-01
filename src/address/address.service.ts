/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { AddressResponse, CreateAddressRequest } from 'src/model/address.model';
import { Logger } from 'winston';
import { AddressValidation } from './address.validation';

@Injectable()
export class AddressService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
  ) {}

  async create(
    user: User,
    contactId: number,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `user: ${JSON.stringify(user)} AddressService.create(contactId: ${contactId}, request: ${JSON.stringify(request)}`,
    );

    const isContactIdExist = await this.prismaService.contact.findUnique({
      where: {
        username: user.username,
        id: contactId,
      },
    });

    if (!isContactIdExist) {
      throw new HttpException('Contact not found', 404);
    }

    const validatedData: CreateAddressRequest = this.validationService.validate(
      AddressValidation.CREATE,
      request,
    );

    const address = await this.prismaService.address.create({
      data: {
        contact_id: contactId,
        ...validatedData,
      },
    });

    return {
      id: address.id,
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      postal_code: address.postal_code,
    };
  }
}
