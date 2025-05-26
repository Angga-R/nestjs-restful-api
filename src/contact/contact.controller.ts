import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { Auth } from 'src/common/auth.decorator';
import { User } from 'generated/prisma';
import { ContactResponse, CreateContactRequest } from 'src/model/contact.model';
import { WebResponse } from 'src/model/web.model';

@Controller('/api/contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post('/create')
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Body() request: CreateContactRequest,
  ): Promise<WebResponse<ContactResponse>> {
    const result: ContactResponse = await this.contactService.create(
      user,
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
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<ContactResponse>> {
    const result: ContactResponse = await this.contactService.getById(user, id);

    return {
      data: result,
    };
  }
}
