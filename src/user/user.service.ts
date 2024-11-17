import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Req,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { RegisterUserRequest, UserResponse } from '../model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { MailService } from '../common/mail.service';
import { Request } from 'express';
import { HashidService } from '../common/hashid.service';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private mailService: MailService,
    private hashIdService: HashidService,
  ) {}

  async register(
    @Req() expressReq: Request,
    request: RegisterUserRequest,
  ): Promise<UserResponse> {
    this.logger.info(`Registering user ${JSON.stringify(request)}`);

    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    const checkUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { email: registerRequest.email },
          { username: registerRequest.username },
        ],
      },
    });

    if (checkUser) {
      throw new HttpException(
        'username or email is already taken',
        HttpStatus.BAD_REQUEST,
      );
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userData } = registerRequest;

    const user = await this.prismaService.user.create({
      data: userData,
    });

    const hashId = this.hashIdService.encode(user.id);
    const verifyEmailUrl: string = `${expressReq.protocol}://${expressReq.get('host')}/api/users/verify-email/${hashId.toString()}`;
    await this.mailService.sendVerificationEmail(
      userData.name,
      userData.email,
      verifyEmailUrl,
    );

    return {
      email: user.email,
      username: user.username,
      name: user.name,
      emailSent: true,
    };
  }

  async verifyEmail(hash: string): Promise<any> {
    const id = this.hashIdService.decode(hash);

    if (!id) {
      throw new HttpException(
        'Invalid verification link',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prismaService.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.isVerified) {
      throw new HttpException('Email already verified', HttpStatus.BAD_REQUEST);
    }

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
      },
    });

    await this.mailService.sendWelcomeEmail(user.name, user.email);

    return 'Email Verified Successfully';
  }
}
