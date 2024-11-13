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
}
