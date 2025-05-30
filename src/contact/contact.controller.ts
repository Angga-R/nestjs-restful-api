import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { Auth } from 'src/common/auth.decorator';
import { User } from 'generated/prisma';
import {
  ContactResponse,
  CreateContactRequest,
  UpdateContactRequest,
} from 'src/model/contact.model';
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

  @Put('/update')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Body() request: UpdateContactRequest,
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.contactService.update(user, request);

    return {
      data: result,
    };
  }

  @Delete('/:id/remove')
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<string> {
    await this.contactService.remove(user, id);

    return 'OK';
  }

  @Get()
  @HttpCode(200)
  async getAll(
    @Auth() user: User,
    @Query('search') searchData: string,
    @Query('size', new ParseIntPipe({ optional: true })) size: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
  ): Promise<WebResponse<ContactResponse[]>> {
    return this.contactService.getAll(user, searchData, size || 10, page || 1);
  }
}
