import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}

  private extractToken(authHeader: string): string {
    if (!authHeader) {
      return null;
    }

    if (authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7); // Remove 'Bearer '
    }

    return authHeader;
  }

  private isTokenExp(tokenExp: Date): boolean {
    return tokenExp > new Date();
  }

  async use(req: any, res: any, next: (error?: Error | any) => void) {
    const token = req.headers['authorization'] as string;
    if (token) {
      const user = await this.prismaService.user.findFirst({
        where: {
          token: this.extractToken(token),
        },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          role: true,
          tokenExp: true,
        },
      });

      if (user) {
        req.user = user;
      }

      if (!this.isTokenExp(user.tokenExp)) {
        throw new HttpException('Token expired', 401);
      }
    }

    next();
  }
}
