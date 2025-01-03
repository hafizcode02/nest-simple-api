import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    type: String,
    minimum: 3,
    description: 'The name of the user',
    example: 'example',
  })
  name: string;

  @ApiProperty({
    type: String,
    minimum: 3,
    description: 'The email of the user',
    example: 'example@example.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    minimum: 3,
    description: 'The username of the user',
    example: 'example',
  })
  username: string;

  @ApiProperty({
    type: String,
    minimum: 8,
    description: 'The password of the user',
    example: 'example',
  })
  password: string;

  @ApiProperty({
    type: String,
    minimum: 8,
    description: 'The password confirmation of the user',
    example: 'example',
  })
  confirmPassword?: string;
}

export class UserResponseDto {
  email?: string;
  username: string;
  name: string;
  token?: string;
  emailSent?: boolean;
}

export class LoginUserDto {
  @ApiProperty({
    type: String,
    example: 'example',
  })
  username: string;

  @ApiProperty({
    type: String,
    example: 'example',
  })
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    example: 'new example',
  })
  name?: string;

  @ApiProperty({
    type: String,
    example: 'new example',
  })
  password?: string;

  @ApiProperty({
    type: String,
    example: 'new example',
  })
  confirmPassword?: string;
}
