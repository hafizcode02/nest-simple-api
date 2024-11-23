import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Contact, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/helper/prisma.service';
import { ValidationService } from '../common/helper/validation.service';
import {
  CreateContactDto,
  ContactDto,
  UpdateContactDto,
  ImageContactDto,
  SearchContactDto,
} from './contact.dto';
import { Logger } from 'winston';
import { ContactValidation } from './contact.validation';
import { Request } from 'express';
import { BaseResponseDto } from 'src/common/dto/base.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private validationService: ValidationService,
    private readonly configService: ConfigService,
  ) {}

  private toContactResponse(contact: Contact): ContactDto {
    return {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone,
      social_linkedin: contact.social_linkedin,
      social_fb: contact.social_fb,
      social_x: contact.social_x,
      social_yt: contact.social_yt,
      social_ig: contact.social_ig,
      social_github: contact.social_github,
      photo: contact.photo,
    };
  }

  private async checkContact(
    contactId: number,
    userId: number,
  ): Promise<Contact> {
    return await this.prismaService.contact.findFirst({
      where: {
        id: contactId,
        userId: userId,
      },
    });
  }

  async create(user: User, contact: CreateContactDto): Promise<ContactDto> {
    const contactRequest: CreateContactDto = this.validationService.validate(
      ContactValidation.CREATE,
      contact,
    );

    const result = await this.prismaService.contact.create({
      data: {
        ...contactRequest,
        userId: user.id,
      },
    });

    return this.toContactResponse(result);
  }

  async getContact(user: User, contactId: number): Promise<ContactDto> {
    const contactExist = await this.checkContact(contactId, user.id);

    if (!contactExist) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }

    return this.toContactResponse(contactExist);
  }

  async updateContact(
    user: User,
    contactId: number,
    contact: UpdateContactDto,
  ): Promise<ContactDto> {
    const contactRequest: UpdateContactDto = this.validationService.validate(
      ContactValidation.UPDATE,
      contact,
    );

    const contactExist = await this.checkContact(contactId, user.id);

    if (!contactExist) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }

    const updatedContact = await this.prismaService.contact.update({
      where: {
        id: contactId,
      },
      data: {
        ...contactRequest,
      },
    });

    return this.toContactResponse(updatedContact);
  }

  async deleteContact(user: User, contactId: number): Promise<ContactDto> {
    const contactExist = await this.checkContact(contactId, user.id);

    if (!contactExist) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }

    return await this.prismaService.contact.delete({
      where: {
        id: contactId,
      },
    });
  }

  async uploadImage(
    user: User,
    req: Request,
    contactId: number,
    filename: string,
  ): Promise<ImageContactDto> {
    const storageType = this.configService.get<string>('STORAGE', 'local');

    const result = await this.prismaService.contact.update({
      where: {
        id: contactId,
      },
      data: {
        photo:
          storageType === 'local'
            ? `${req.protocol}://${req.get('host')}/uploads/${filename}`
            : filename,
      },
    });

    return {
      id: result.id,
      first_name: result.first_name,
      email: result.email,
      photo: result.photo,
    };
  }

  async searchContact(
    user: User,
    request: SearchContactDto,
  ): Promise<BaseResponseDto<ContactDto[]>> {
    const searchRequest: SearchContactDto = this.validationService.validate(
      ContactValidation.SEARCH,
      request,
    );

    const filters = [];

    if (searchRequest.name) {
      filters.push({
        OR: [
          {
            first_name: {
              contains: searchRequest.name,
            },
          },
          {
            last_name: {
              contains: searchRequest.name,
            },
          },
        ],
      });
    }

    if (searchRequest.email) {
      filters.push({
        email: {
          contains: searchRequest.email,
        },
      });
    }

    if (searchRequest.phone) {
      filters.push({
        phone: {
          contains: searchRequest.phone,
        },
      });
    }

    const contacts = await this.prismaService.contact.findMany({
      where: {
        userId: user.id,
        AND: filters,
      },
      take: searchRequest.size,
      skip: (searchRequest.page - 1) * searchRequest.size,
    });

    return {
      data: contacts.map((contact) => this.toContactResponse(contact)),
      paging: {
        size: searchRequest.size,
        page: searchRequest.page,
        current_page: Math.ceil(contacts.length / searchRequest.size),
      },
    };
  }
}
