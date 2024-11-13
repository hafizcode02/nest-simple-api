import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';

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

  async createUser() {
    await this.prismaService.user.create({
      data: {
        email: 't.dev@hafizcaniago.my.id',
        name: 'Hafiz Caniago',
        username: 't.hafigo',
        password: 'secret123',
      },
    });
  }
}
