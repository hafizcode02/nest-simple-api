import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';

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
}
