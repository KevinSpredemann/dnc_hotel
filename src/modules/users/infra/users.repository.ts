import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../domain/repositories/Iusers.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDTO } from '../domain/dto/createUser.dto';
import { User } from '@prisma/client';
import { UpdateUserDTO } from '../domain/dto/uptadeUser.dto';
import * as bcrypt from 'bcrypt';
import { UserSelectFields } from '../../prisma/utils/userSelectFields';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}
  createUser(data: CreateUserDTO): Promise<User> {
    return this.prisma.user.create({ data });
  }
  getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  async getByIdUser(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) return null;

    return {
      ...user,
      avatar: user.avatar
        ? `${process.env.APP_API_URL}/uploads/${user.avatar}`
        : null,
    };
  }
  getByEmailUser(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  updateUser(id: number, data: UpdateUserDTO): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }
  deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  async uploadAvatar(id: number, avatarFilename: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { avatar: avatarFilename },
    });
  }

  async getAvatarUrl(user: User): Promise<string | null> {
    if (!user || !user.avatar) {
      return null;
    }
    return `${process.env.APP_API_URL}/uploads/${user.avatar}`;
  }
  async hashPassword(password: string) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}
