import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { $Enums, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async delete(id: string) {
    await this.isIdExists(id);
    return this.prisma.user.delete({ where: { id: Number(id) } });
  }
  async update(id: string, body: any) {
    await this.isIdExists(id);
    return this.prisma.user.update({
      where: { id: Number(id) },
      data: body,
    });
  }
  async create(body: any): Promise<User> {
    return this.prisma.user.create({ data: body });
  }
  async getAll() {
    return this.prisma.user.findMany();
  }

  async getByid(id: string) {
    const user = await this.isIdExists(id);

    return user;
  }

  private async isIdExists(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }
}
