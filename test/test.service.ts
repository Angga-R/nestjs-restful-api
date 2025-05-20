import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUser(): Promise<void> {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async createUser(): Promise<void> {
    const password: string = await bcrypt.hash('rahasia', 10);
    await this.prismaService.user.create({
      data: {
        username: 'test',
        password: password,
        name: 'test',
      },
    });
  }

  async createToken(): Promise<void> {
    await this.prismaService.user.update({
      where: {
        username: 'test',
      },
      data: {
        token: 'test',
      },
    });
  }

  async deleteContact(): Promise<void> {
    await this.prismaService.contact.deleteMany({
      where: {
        username: 'test',
      },
    });
  }
}
