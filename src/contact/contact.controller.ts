import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
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
import { MulterService } from '../common/multer.service';
import { MulterInterceptor } from '../common/multer.interceptor';
import { Request } from 'express';

@Controller('/api/contacts')
export class ContactController {
  constructor(
    private contactService: ContactService,
    private multerService: MulterService,
  ) {}

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

  @Delete('/:contactId')
  @HttpCode(200)
  @UseRole(Role.USER)
  async deleteContact(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<JsonResponse<ContactResponse>> {
    await this.contactService.deleteContact(user, contactId);

    return {
      message: 'Contact Successfully Deleted',
      data: null,
    };
  }

  @Post('/:contactId/upload')
  @HttpCode(201)
  @UseRole(Role.USER)
  @UseInterceptors(
    MulterInterceptor.create({
      fieldName: 'file',
      fileTypes: ['image/jpeg', 'image/png', 'image/jpg'],
      maxSize: 1024 * 1024 * 5, // 5MB
    }),
  )
  async uploadContactImage(
    @Auth() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Req() req: Request,
  ): Promise<JsonResponse<any>> {
    if (!file) {
      throw new HttpException('No file provided!', HttpStatus.BAD_REQUEST);
    }
    const upload = this.multerService.saveFile(file);
    const result = await this.contactService.uploadImage(
      user,
      req,
      contactId,
      upload,
    );
    return {
      message: 'File uploaded successfully',
      data: result,
    };
  }
}
