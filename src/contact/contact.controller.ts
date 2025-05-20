import { Body, Controller, HttpCode, Post } from '@nestjs/common';
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
}
