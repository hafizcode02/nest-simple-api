import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { UseRole } from '../common/auth/role.decorator';
import { Role } from '../common/auth/role.enum';
import { JsonResponse } from '../model/json.model';
import {
  ContactResponse,
  CreateContactRequest,
  UpdateContactRequest,
} from '../model/contact.model';
import { Auth } from '../common/auth/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/contacts')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  @HttpCode(201)
  @UseRole(Role.USER)
  async create(
    @Auth() user: User,
    @Body() request: CreateContactRequest,
  ): Promise<JsonResponse<ContactResponse>> {
    const result = await this.contactService.create(user, request);
    return {
      data: result,
    };
  }

  @Get('/:contactId')
  @HttpCode(200)
  @UseRole(Role.USER)
  async getContact(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<JsonResponse<ContactResponse>> {
    const result = await this.contactService.getContact(user, contactId);

    return {
      data: result,
    };
  }

  @Patch('/:contactId')
  @HttpCode(200)
  @UseRole(Role.USER)
  async updateContact(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: UpdateContactRequest,
  ): Promise<JsonResponse<ContactResponse>> {
    const result = await this.contactService.updateContact(
      user,
      contactId,
      request,
    );

    return {
      data: result,
    };
  }
}
