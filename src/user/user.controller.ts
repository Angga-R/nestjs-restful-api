import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';
import { Auth } from 'src/common/auth.decorator';
import { User } from 'generated/prisma';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(200)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result: UserResponse = await this.userService.register(request);

    return {
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result: UserResponse = await this.userService.login(request);

    return {
      data: result,
    };
  }

  @Post('/current')
  @HttpCode(200)
  get(@Auth() user: User): WebResponse<UserResponse> {
    const result: UserResponse = this.userService.get(user);

    return {
      data: result,
    };
  }
}
