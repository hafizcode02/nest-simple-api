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
}

export class UpdateContactRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
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
