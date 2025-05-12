class RegisterUserRequest {
  username: string;
  password: string;
  name: string;
}

class UserResponse {
  username: string;
  name: string;
  token?: string;
}

export { RegisterUserRequest, UserResponse };
