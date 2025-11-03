import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { $Enums, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDTO } from './domain/dto/uptadeUser.dto';
import { CreateUserDTO } from './domain/dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { UserSelectFields } from '../prisma/utils/userSelectFields';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(body: CreateUserDTO): Promise<User> {
    const user = await this.getByEmail(body.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    body.password = await this.hashPassword(body.password);
    return await this.prisma.user.create({
      data: body,
      select: UserSelectFields,
    });
  }
  async getAll() {
    return this.prisma.user.findMany({
      select: UserSelectFields,
    });
  }

  async getByid(id: number) {
    const user = await this.isIdExists(id);
    return user;
  }

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
      select: UserSelectFields,
    });
  }

  async getByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
  private async isIdExists(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: UserSelectFields,
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
