import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { JsonResponse } from '../model/json.model';
import { AddressRequest, AddressResponse } from '../model/address.model';
import { UseRole } from '../common/auth/role.decorator';
import { Role } from '../common/auth/role.enum';
import { Auth } from '../common/auth/auth.decorator';
import { User } from '@prisma/client';

@Controller('api/contacts/:contactId/addresses')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Get('/')
  @HttpCode(200)
  @UseRole(Role.USER)
  async getAddress(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<JsonResponse<AddressResponse[]>> {
    const address = await this.addressService.getAddress(user, contactId);
    return {
      message: 'Address retrieved successfully',
      data: address,
    };
  }

  @Post('/')
  @HttpCode(201)
  @UseRole(Role.USER)
  async postAddress(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() address: AddressRequest,
  ): Promise<JsonResponse<AddressResponse>> {
    const newAddress = await this.addressService.createAddress(
      user,
      contactId,
      address,
    );
    return {
      message: 'Address created successfully',
      data: newAddress,
    };
  }

  @Get('/:addressId')
  @HttpCode(200)
  @UseRole(Role.USER)
  async getAddressById(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ): Promise<JsonResponse<AddressResponse>> {
    const address = await this.addressService.getAddressById(
      user,
      contactId,
      addressId,
    );
    return {
      message: 'Address retrieved successfully',
      data: address,
    };
  }

  @Patch('/:addressId')
  @HttpCode(200)
  @UseRole(Role.USER)
  async patchAddress(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() address: AddressRequest,
  ): Promise<JsonResponse<AddressResponse>> {
    const updatedAddress = await this.addressService.updateAddress(
      user,
      contactId,
      addressId,
      address,
    );
    return {
      message: 'Address updated successfully',
      data: updatedAddress,
    };
  }

  @Delete('/:addressId')
  @HttpCode(200)
  @UseRole(Role.USER)
  async deleteAddress(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ): Promise<JsonResponse<void>> {
    const result = await this.addressService.deleteAddress(
      user,
      contactId,
      addressId,
    );
    return {
      message: result,
      data: null,
    };
  }
}
