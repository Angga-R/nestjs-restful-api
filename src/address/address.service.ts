/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  AddressResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
} from 'src/model/address.model';
import { Logger } from 'winston';
import { AddressValidation } from './address.validation';

@Injectable()
export class AddressService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
  ) {}

  private async isContactExist(
    username: string,
    contactId: number,
  ): Promise<void> {
    const isContactIdExist = await this.prismaService.contact.findUnique({
      where: {
        username: username,
        id: contactId,
      },
    });

    if (!isContactIdExist) {
      throw new HttpException('Contact not found', 404);
    }
  }

  async create(
    user: User,
    contactId: number,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `user: ${JSON.stringify(user)} AddressService.create(contactId: ${contactId}, request: ${JSON.stringify(request)}`,
    );

    await this.isContactExist(user.username, contactId);

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

  async getById(
    user: User,
    contactId: number,
    id: number,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `user: ${JSON.stringify(user)} AddressService.getById(contactId: ${contactId}, id: ${id}`,
    );

    await this.isContactExist(user.username, contactId);

    const address = await this.prismaService.address.findUnique({
      where: {
        contact_id: contactId,
        id: id,
      },
    });

    if (!address) {
      throw new HttpException('Address not found', 404);
    }

    return {
      id: address.id,
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      postal_code: address.postal_code,
    };
  }

  async remove(user: User, contactId: number, id: number): Promise<void> {
    this.logger.debug(
      `user: ${JSON.stringify(user)} AddressService.remove(contactId: ${contactId}, id: ${id}`,
    );

    await this.isContactExist(user.username, contactId);

    const isAddressExist = await this.prismaService.address.findUnique({
      where: {
        id: id,
      },
    });

    if (!isAddressExist) {
      throw new HttpException('Address not found', 404);
    }

    await this.prismaService.address.delete({
      where: {
        id: id,
      },
    });
  }

  async update(
    user: User,
    contactId: number,
    id: number,
    request: UpdateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `user: ${JSON.stringify(user)} AddressService.update(contactId: ${contactId}, id: ${id}, request: ${JSON.stringify(request)}`,
    );

    await this.isContactExist(user.username, contactId);

    const isAddressExist = await this.prismaService.address.findUnique({
      where: {
        id: id,
      },
    });

    if (!isAddressExist) {
      throw new HttpException('Address not found', 404);
    }

    const validatedData: UpdateAddressRequest = this.validationService.validate(
      AddressValidation.UPDATE,
      request,
    );

    const address = await this.prismaService.address.update({
      where: {
        id: id,
      },
      data: validatedData,
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
