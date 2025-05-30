/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';
import { ContactValidation } from './contact.validation';
import { User } from 'generated/prisma';
import {
  ContactResponse,
  CreateContactRequest,
  UpdateContactRequest,
} from 'src/model/contact.model';
import { ValidationService } from 'src/common/validation.service';
import { WebResponse } from 'src/model/web.model';

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

  async getById(user: User, id: number): Promise<ContactResponse> {
    this.logger.debug(
      `user: ${JSON.stringify(user)} ContactService.getById(${id})`,
    );

    const contact = await this.prismaService.contact.findUnique({
      where: {
        id: id,
        username: user.username,
      },
    });

    if (contact) {
      return {
        id: contact.id,
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        phone: contact.phone,
      };
    } else {
      throw new HttpException('contact not found', 404);
    }
  }

  async update(
    user: User,
    request: UpdateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.debug(
      `user: ${JSON.stringify(user)} ContactService.update(${JSON.stringify(request)})`,
    );

    const validatedData: UpdateContactRequest = this.validationService.validate(
      ContactValidation.UPDATE,
      request,
    );

    const isExist = await this.prismaService.contact.findUnique({
      where: {
        id: validatedData.id,
        username: user.username,
      },
    });

    if (!isExist) throw new HttpException('contact not found', 404);

    const contact = await this.prismaService.contact.update({
      where: {
        id: validatedData.id,
        username: user.username,
      },
      data: validatedData,
    });

    return {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone,
    };
  }

  async remove(user: User, id: number): Promise<void> {
    this.logger.debug(
      `user: ${JSON.stringify(user)} ContactService.remove(${JSON.stringify(id)})`,
    );

    const isExist = await this.prismaService.contact.findUnique({
      where: {
        id: id,
        username: user.username,
      },
    });

    if (!isExist) throw new HttpException('contact not found', 404);

    await this.prismaService.contact.delete({
      where: {
        id: id,
        username: user.username,
      },
    });
  }

  async getAll(
    user: User,
    parameter: string,
    size: number,
    page: number,
  ): Promise<WebResponse<ContactResponse[]>> {
    this.logger.debug(
      `user: ${JSON.stringify(user)} ContactService.update(parameter: ${parameter}, size: ${size}, page: ${page})`,
    );
    let query: object;

    if (parameter) {
      query = {
        username: user.username,
        OR: [
          {
            first_name: {
              contains: parameter,
            },
          },
          {
            last_name: {
              contains: parameter,
            },
          },
          {
            email: {
              contains: parameter,
            },
          },
          {
            phone: {
              contains: parameter,
            },
          },
        ],
      };
    } else {
      query = {
        username: user.username,
      };
    }

    const skip: number = (page - 1) * size;

    const result = await this.prismaService.contact.findMany({
      where: query,
      take: size,
      skip: skip,
    });

    const data: ContactResponse[] = [];

    for (let i = 0; i < result.length; i++) {
      const contact: ContactResponse = {
        id: result[i].id,
        first_name: result[i].first_name,
        last_name: result[i].last_name,
        email: result[i].email,
        phone: result[i].phone,
      };

      data.push(contact);
    }

    const totalItem: number = await this.prismaService.contact.count({
      where: query,
    });

    return {
      data: data,
      paging: {
        current_page: page,
        total_page: Math.ceil(totalItem / size),
        total_item: totalItem,
      },
    };
  }
}
