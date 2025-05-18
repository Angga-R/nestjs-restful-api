class RegisterUserRequest {
  username: string;
  password: string;
  name: string;
}

class LoginUserRequest {
  username: string;
  password: string;
}

class UpdateUserRequest {
  name?: string;
  password?: string;
}

class UserResponse {
  username: string;
  name: string;
  token?: string | null;
}

export {
  RegisterUserRequest,
  LoginUserRequest,
  UpdateUserRequest,
  UserResponse,
};
