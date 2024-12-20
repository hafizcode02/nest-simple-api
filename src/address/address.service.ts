import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/helper/prisma.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from '../common/helper/validation.service';
import {
  CreateAddressDto,
  AddressDto,
  UpdateAddressDto,
} from 'src/address/address.dto';
import { AddressValidation } from './address.validation';
import { Address, Contact, User } from '@prisma/client';

@Injectable()
export class AddressService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private validationService: ValidationService,
  ) {}

  private toAddressResponse(address: Address): AddressDto {
    return {
      id: address.id,
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      postalCode: address.postalCode,
      detail: address.detail,
    };
  }

  private async checkContactIsExistAndBelongsToUser(
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

  private async checkAddressIsExistAndBelongsToContact(
    addressId: number,
    contactId: number,
  ): Promise<Address> {
    return await this.prismaService.address.findFirst({
      where: {
        id: addressId,
        contactId: contactId,
      },
    });
  }

  async getAddress(user: User, contactId: number): Promise<AddressDto[]> {
    const checkContactIsExistAndBelongsToUser =
      await this.checkContactIsExistAndBelongsToUser(contactId, user.id);

    if (!checkContactIsExistAndBelongsToUser) {
      throw new HttpException('Contact not found', 404);
    }

    const result = await this.prismaService.address.findMany({
      where: {
        contactId: contactId,
      },
    });

    return result.map((address) => this.toAddressResponse(address));
  }

  async createAddress(
    user: User,
    contactId: number,
    address: CreateAddressDto,
  ): Promise<AddressDto> {
    const checkContactIsExistAndBelongsToUser =
      await this.checkContactIsExistAndBelongsToUser(contactId, user.id);

    if (!checkContactIsExistAndBelongsToUser) {
      throw new HttpException('Contact not found', 404);
    }

    const CreateAddressDto: CreateAddressDto = this.validationService.validate(
      AddressValidation.CREATE,
      address,
    );

    const result = await this.prismaService.address.create({
      data: {
        ...CreateAddressDto,
        contactId: contactId,
      },
    });

    return this.toAddressResponse(result);
  }

  async getAddressById(
    user: User,
    contactId: number,
    addressId: number,
  ): Promise<AddressDto> {
    const checkContactIsExistAndBelongsToUser =
      await this.checkContactIsExistAndBelongsToUser(contactId, user.id);

    if (!checkContactIsExistAndBelongsToUser) {
      throw new HttpException('Contact not found', 404);
    }

    const result = await this.prismaService.address.findFirst({
      where: {
        id: addressId,
      },
    });

    if (!result) {
      throw new HttpException('Address not found', 404);
    }

    return this.toAddressResponse(result);
  }

  async updateAddress(
    user: User,
    contactId: number,
    addressId: number,
    address: UpdateAddressDto,
  ): Promise<AddressDto> {
    const checkContactIsExistAndBelongsToUser =
      await this.checkContactIsExistAndBelongsToUser(contactId, user.id);

    if (!checkContactIsExistAndBelongsToUser) {
      throw new HttpException('Contact not found', 404);
    }

    const CreateAddressDto: UpdateAddressDto = this.validationService.validate(
      AddressValidation.UPDATE,
      address,
    );

    const checkAddressIsExistAndBelongsToContact =
      await this.checkAddressIsExistAndBelongsToContact(addressId, contactId);

    if (!checkAddressIsExistAndBelongsToContact) {
      throw new HttpException('Address not found', 404);
    }

    const result = await this.prismaService.address.update({
      where: {
        id: addressId,
      },
      data: {
        ...CreateAddressDto,
      },
    });

    return this.toAddressResponse(result);
  }

  async deleteAddress(
    user: User,
    contactId: number,
    addressId: number,
  ): Promise<AddressDto> {
    const checkContactIsExistAndBelongsToUser =
      await this.checkContactIsExistAndBelongsToUser(contactId, user.id);

    if (!checkContactIsExistAndBelongsToUser) {
      throw new HttpException('Contact not found', 404);
    }

    const checkAddressIsExistAndBelongsToContact =
      await this.checkAddressIsExistAndBelongsToContact(addressId, contactId);

    if (!checkAddressIsExistAndBelongsToContact) {
      throw new HttpException('Address not found', 404);
    }

    return await this.prismaService.address.delete({
      where: {
        id: addressId,
      },
    });
  }
}
