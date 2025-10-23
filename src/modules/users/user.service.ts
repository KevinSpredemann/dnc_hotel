import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { $Enums, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDTO } from './domain/dto/uptadeUser.dto';
import { CreateUserDTO } from './domain/dto/createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async delete(id: number) {
    await this.isIdExists(id);
    return this.prisma.user.delete({ where: { id } });
  }
  async update(id: number, body: UpdateUserDTO) {
    await this.isIdExists(id);
    if (body.password) {
      body.password = await this.hashPassword(body.password);
    }
    return this.prisma.user.update({
      where: { id },
      data: body,
    });
  }
  async create(body: CreateUserDTO): Promise<User> {
    body.password = await this.hashPassword(body.password);
    return this.prisma.user.create({ data: body });
  }
  async getAll() {
    return this.prisma.user.findMany();
  }

  async getByid(id: number) {
    const user = await this.isIdExists(id);

    return user;
  }

  private async isIdExists(id: number) {
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

  private async hashPassword(password: string) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}
