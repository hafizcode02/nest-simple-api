import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserRequest, UserResponse } from '../model/user.model';
import { JsonResponse } from '../model/json.model';
import { Request } from 'express';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async register(
    @Req() expressReq: Request,
    @Body() request: RegisterUserRequest,
  ): Promise<JsonResponse<UserResponse>> {
    const result = await this.userService.register(expressReq, request);
    return {
      data: result,
    };
  }
}
