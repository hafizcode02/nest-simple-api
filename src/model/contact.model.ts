import { ApiProperty } from '@nestjs/swagger';

export class ContactResponse {
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

export class CreateContactRequest {
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
  social_linkedin?: string;
  social_fb?: string;
  social_x?: string;
  social_yt?: string;
  social_ig?: string;
  social_github?: string;
}

export class UpdateContactRequest {
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
  social_linkedin?: string;
  social_fb?: string;
  social_x?: string;
  social_yt?: string;
  social_ig?: string;
  social_github?: string;
}

export class ImageContactResponse {
  id: number;
  first_name: string;
  email: string;
  photo: string;
}

export class SearchContactRequest {
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
  page: number;
  size: number;
}
