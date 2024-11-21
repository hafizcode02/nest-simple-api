import { ApiProperty } from '@nestjs/swagger';

export class AddressRequest {
  @ApiProperty({
    example: 'Jl. Kenangan',
  })
  street: string;

  @ApiProperty({
    example: 'Jakarta',
  })
  city: string;

  @ApiProperty({
    example: 'DKI Jakarta',
  })
  province: string;

  @ApiProperty({
    example: 'Indonesia',
  })
  country: string;

  @ApiProperty({
    example: '12345',
  })
  postalCode: string;

  @ApiProperty({
    example: 'Yang ada di depan rumah',
  })
  detail?: string;
}

export class AddressResponse {
  id: number;
  street: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  detail: string;
}

export class AddressUpdateRequest {
  @ApiProperty({
    example: '1840 Democracy Point',
  })
  street?: string;

  @ApiProperty({
    example: 'Colorado Springs',
  })
  city?: string;

  @ApiProperty({
    example: 'Colorado',
  })
  province?: string;

  @ApiProperty({
    example: 'United States',
  })
  country?: string;

  postalCode?: string;
  detail?: string;
}
