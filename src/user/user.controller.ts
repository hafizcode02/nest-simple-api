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
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { JsonResponse } from '../model/json.model';
import { Request } from 'express';
import { UseRole } from '../common/auth/role.decorator';
import { User } from '@prisma/client';
import { Role } from '../common/auth/role.enum';
import { Auth } from '../common/auth/auth.decorator';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(201)
  async register(
    @Req() expressReq: Request,
    @Body() request: RegisterUserRequest,
  ): Promise<JsonResponse<UserResponse>> {
    const result = await this.userService.register(expressReq, request);
    return {
      data: result,
    };
  }

  @Get('/verify-email/:hash')
  async verifyEmail(@Param('hash') hash: string): Promise<JsonResponse<any>> {
    const result = await this.userService.verifyEmail(hash);
    return {
      message: result,
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<JsonResponse<UserResponse>> {
    const result = await this.userService.login(request);
    return {
      data: result,
    };
  }

  @Get('/current')
  @HttpCode(200)
  @UseRole(Role.ADMIN, Role.USER)
  async getLoggedInUser(
    @Auth() user: User,
  ): Promise<JsonResponse<UserResponse>> {
    const result = await this.userService.getLoggedInUser(user);
    return {
      data: result,
    };
  }

  @Patch('/current')
  @HttpCode(200)
  @UseRole(Role.ADMIN, Role.USER)
  async updateUser(
    @Auth() user: User,
    @Body() request: UpdateUserRequest,
  ): Promise<JsonResponse<UserResponse>> {
    const result = await this.userService.update(user, request);
    return {
      data: result,
    };
  }
}
