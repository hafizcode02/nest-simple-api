import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  LoginUserDto,
  RegisterUserDto,
  UpdateUserDto,
  UserResponseDto,
} from './user.dto';
import { BaseResponseDto } from '../common/dto/base.dto';
import { Request } from 'express';
import { UseRole } from '../common/auth/role.decorator';
import { User } from '@prisma/client';
import { Role } from '../common/auth/role.enum';
import { Auth } from '../common/auth/auth.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(201)
  async register(
    @Req() expressReq: Request,
    @Body() request: RegisterUserDto,
  ): Promise<BaseResponseDto<UserResponseDto>> {
    const result = await this.userService.register(expressReq, request);
    return {
      data: result,
    };
  }

  @Get('/verify-email/:hash')
  async verifyEmail(
    @Param('hash') hash: string,
  ): Promise<BaseResponseDto<any>> {
    const result = await this.userService.verifyEmail(hash);
    return {
      message: result,
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: LoginUserDto,
  ): Promise<BaseResponseDto<UserResponseDto>> {
    const result = await this.userService.login(request);
    return {
      data: result,
    };
  }

  @ApiBearerAuth()
  @Get('/current')
  @HttpCode(200)
  @UseRole(Role.ADMIN, Role.USER)
  async getLoggedInUser(
    @Auth() user: User,
  ): Promise<BaseResponseDto<UserResponseDto>> {
    const result = await this.userService.getLoggedInUser(user);
    return {
      data: result,
    };
  }

  @ApiBearerAuth()
  @Patch('/current')
  @HttpCode(200)
  @UseRole(Role.ADMIN, Role.USER)
  async updateUser(
    @Auth() user: User,
    @Body() request: UpdateUserDto,
  ): Promise<BaseResponseDto<UserResponseDto>> {
    const result = await this.userService.update(user, request);
    return {
      data: result,
    };
  }

  @ApiBearerAuth()
  @Post('/logout')
  @HttpCode(200)
  @UseRole(Role.ADMIN, Role.USER)
  async logout(@Auth() user: User): Promise<BaseResponseDto<UserResponseDto>> {
    await this.userService.logout(user);
    return {
      message: 'Logged out successfully',
      data: null,
    };
  }
}
