import {
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
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
    request: CreateAddressRequest,
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
}
