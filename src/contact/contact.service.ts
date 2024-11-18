import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { CreateContactRequest, ContactResponse } from '../model/contact.model';
import { Logger } from 'winston';
import { ContactValidation } from './contact.validation';

@Injectable()
export class ContactService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private validationService: ValidationService,
  ) {}

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

    return {
      id: result.id,
      first_name: result.first_name,
      last_name: result.last_name,
      email: result.email,
      phone: result.phone,
      social_linkedin: result.social_linkedin,
      social_fb: result.social_fb,
      social_x: result.social_x,
      social_yt: result.social_yt,
      social_ig: result.social_ig,
      social_github: result.social_github,
    };
  }
}
