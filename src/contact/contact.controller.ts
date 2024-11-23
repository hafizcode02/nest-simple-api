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
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { UseRole } from '../common/auth/role.decorator';
import { Role } from '../common/auth/role.enum';
import { BaseResponseDto } from '../common/dto/base.dto';
import {
  ContactDto,
  CreateContactDto,
  SearchContactDto,
  UpdateContactDto,
} from './contact.dto';
import { Auth } from '../common/auth/auth.decorator';
import { User } from '@prisma/client';
import { MulterService } from '../common/storage/multer.service';
import { MulterInterceptor } from '../common/storage/multer.interceptor';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('/api/contacts')
export class ContactController {
  constructor(
    private contactService: ContactService,
    private multerService: MulterService,
  ) {}

  @Get()
  @HttpCode(200)
  @UseRole(Role.USER)
  async searchContact(
    @Auth() user: User,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ): Promise<BaseResponseDto<ContactDto[]>> {
    const result = await this.contactService.searchContact(user, {
      name: name,
      email: email,
      phone: phone,
      page: page || 1,
      size: size || 10,
    } as SearchContactDto);

    return result;
  }

  @Post()
  @HttpCode(201)
  @UseRole(Role.USER)
  async create(
    @Auth() user: User,
    @Body() request: CreateContactDto,
  ): Promise<BaseResponseDto<ContactDto>> {
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
  ): Promise<BaseResponseDto<ContactDto>> {
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
    @Body() request: UpdateContactDto,
  ): Promise<BaseResponseDto<ContactDto>> {
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
  ): Promise<BaseResponseDto<ContactDto>> {
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
  ): Promise<BaseResponseDto<any>> {
    if (!file) {
      throw new HttpException('No file provided!', HttpStatus.BAD_REQUEST);
    }

    let upload = null;
    const checkContact = await this.contactService.getContact(user, contactId);
    if (checkContact) {
      upload = await this.multerService.saveFile(file);
    }

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
