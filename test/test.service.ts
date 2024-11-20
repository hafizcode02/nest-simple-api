import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { Contact } from '@prisma/client';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 't.hafigo',
      },
    });
  }

  async createUser(isVerified: boolean = false) {
    const createdUser = await this.prismaService.user.create({
      data: {
        email: 'log@hafizcaniago.my.id',
        name: 'Hafiz Caniago',
        username: 't.hafigo',
        password: await bcrypt.hash('secret123', 10),
        isVerified: isVerified,
        token: 'token',
        tokenExp: new Date(new Date().getTime() + 1 * 60 * 1000),
      },
    });

    return createdUser;
  }

  async updateUserTokenExp() {
    const updatedTokenExpiration = await this.prismaService.user.update({
      where: {
        email: 'log@hafizcaniago.my.id',
      },
      data: {
        tokenExp: new Date(new Date().getTime() - 1 * 60 * 1000),
      },
    });

    return updatedTokenExpiration;
  }

  async getUser() {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: 't.hafigo',
      },
    });

    return user;
  }

  async createContact(id: number) {
    const contact = await this.prismaService.contact.create({
      data: {
        first_name: 'Test',
        last_name: '',
        email: 'log@hafizcaniago.my.id',
        phone: '628712312312',
        social_linkedin: '',
        social_fb: '',
        social_x: '',
        social_yt: '',
        social_ig: '',
        social_github: '',
        userId: id,
      },
    });

    return contact;
  }

  async getContact(): Promise<Contact> {
    const contact = await this.prismaService.contact.findFirst({
      where: {
        first_name: 'Test',
      },
    });

    return contact;
  }

  async deleteContact() {
    await this.prismaService.contact.deleteMany({
      where: {
        first_name: 'Test',
      },
    });
  }

  async createAddress(contactId: number) {
    const address = await this.prismaService.address.create({
      data: {
        street: 'Jl. Kenangan',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postalCode: '12345',
        country: 'Indonesia',
        detail: '',
        contactId: contactId,
      },
    });

    return address;
  }

  async getAddress() {
    const address = await this.prismaService.address.findFirst({
      where: {
        street: 'Jl. Kenangan',
      },
    });

    return address;
  }

  async deleteAddress() {
    await this.prismaService.address.deleteMany({
      where: {
        street: 'Jl. Kenangan',
      },
    });
  }
}
