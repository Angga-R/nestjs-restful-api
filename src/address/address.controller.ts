import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { Auth } from 'src/common/auth.decorator';
import { User } from 'generated/prisma';
import { AddressResponse, CreateAddressRequest } from 'src/model/address.model';
import { WebResponse } from 'src/model/web.model';

@Controller('/api/contact/:contactId/address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post('/create')
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: CreateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    const result: AddressResponse = await this.addressService.create(
      user,
      contactId,
      request,
    );

    return {
      data: result,
    };
  }

  @Get('/:id')
  @HttpCode(200)
  async getById(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<AddressResponse>> {
    const result: AddressResponse = await this.addressService.getById(
      user,
      contactId,
      id,
    );

    return {
      data: result,
    };
  }

  @Delete('/:id/remove')
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    await this.addressService.remove(user, contactId, id);

    return 'OK';
  }

  @Patch('/:id/update')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() request: CreateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    const result: AddressResponse = await this.addressService.update(
      user,
      contactId,
      id,
      request,
    );

    return {
      data: result,
    };
  }
}
