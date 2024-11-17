export class RegisterUserRequest {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword?: string;
}

export class UserResponse {
  email?: string;
  username: string;
  name: string;
  token?: string;
  emailSent?: boolean;
}

export class LoginUserRequest {
  username: string;
  password: string;
}

export class UpdateUserRequest {
  name?: string;
  password?: string;
  confirmPassword?: string;
}
