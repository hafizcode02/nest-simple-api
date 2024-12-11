import { ApiProperty } from '@nestjs/swagger';

export class ContactDto {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  social_linkedin?: string;
  social_fb?: string;
  social_x?: string;
  social_yt?: string;
  social_ig?: string;
  social_github?: string;
  photo?: string;
}

export class CreateContactDto {
  @ApiProperty({
    example: 'Example',
  })
  first_name: string;

  @ApiProperty({
    example: 'Example',
  })
  last_name: string;

  @ApiProperty({
    example: 'example@example.com',
  })
  email: string;

  @ApiProperty({
    example: '628712312312',
  })
  phone: string;

  @ApiProperty({
    example: 'https://example.com',
    required: false,
  })
  social_linkedin?: string;

  @ApiProperty({
    example: 'https://example.com',
    required: false,
  })
  social_fb?: string;

  @ApiProperty({
    example: 'https://example.com',
    required: false,
  })
  social_x?: string;

  @ApiProperty({
    example: 'https://example.com',
    required: false,
  })
  social_yt?: string;

  @ApiProperty({
    example: 'https://example.com',
    required: false,
  })
  social_ig?: string;

  @ApiProperty({
    example: 'https://example.com',
    required: false,
  })
  social_github?: string;
}

export class UpdateContactDto {
  @ApiProperty({
    example: 'Updated Example',
  })
  first_name?: string;

  @ApiProperty({
    example: 'Updated Example',
  })
  last_name?: string;

  @ApiProperty({
    example: 'newexample@example.com',
  })
  email?: string;

  @ApiProperty({
    example: '6289876543211',
  })
  phone?: string;

  @ApiProperty({
    example: 'https://example.com',
    required: false,
  })
  social_linkedin?: string;

  @ApiProperty({
    example: 'https://example.com',
    required: false,
  })
  social_fb?: string;

  @ApiProperty({
    example: 'https://example.com',
    required: false,
  })
  social_x?: string;

  @ApiProperty({
    example: 'https://example.com',
    required: false,
  })
  social_yt?: string;

  @ApiProperty({
    example: 'https://example.com',
    required: false,
  })
  social_ig?: string;

  @ApiProperty({
    example: 'https://example.com',
    required: false,
  })
  social_github?: string;
}

export class ImageContactDto {
  id: number;
  first_name: string;
  email: string;
  photo: string;
}

export class SearchContactDto {
  @ApiProperty({
    example: 'Example',
  })
  name?: string;

  @ApiProperty({
    example: 'example@example.com',
  })
  email?: string;

  @ApiProperty({
    example: '628712312312',
  })
  phone?: string;

  @ApiProperty({
    example: 1,
    required: false,
  })
  page: number;

  @ApiProperty({
    example: 10,
    required: false,
  })
  size: number;
}
