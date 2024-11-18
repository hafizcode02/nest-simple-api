import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Contact, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  CreateContactRequest,
  ContactResponse,
  UpdateContactRequest,
} from '../model/contact.model';
import { Logger } from 'winston';
import { ContactValidation } from './contact.validation';

@Injectable()
export class ContactService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private validationService: ValidationService,
  ) {}

  private toContactResponse(contact: Contact): ContactResponse {
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
    };
  }

  async create(
    user: User,
    contact: CreateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.debug(`Creating contact for user ${user.name}`);

    const contactRequest: CreateContactRequest =
      this.validationService.validate(ContactValidation.CREATE, contact);

    const result = await this.prismaService.contact.create({
      data: {
        ...contactRequest,
        userId: user.id,
      },
    });

    return this.toContactResponse(result);
  }

  async getContact(user: User, contactId: number): Promise<ContactResponse> {
    const contact = await this.prismaService.contact.findFirst({
      where: {
        id: contactId,
        userId: user.id,
      },
    });

    if (!contact) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }

    return this.toContactResponse(contact);
  }

  async updateContact(
    user: User,
    contactId: number,
    contact: UpdateContactRequest,
  ): Promise<ContactResponse> {
    const contactRequest: UpdateContactRequest =
      this.validationService.validate(ContactValidation.UPDATE, contact);

    const existingContact = await this.prismaService.contact.findFirst({
      where: {
        id: contactId,
        userId: user.id,
      },
    });

    if (!existingContact) {
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
}
