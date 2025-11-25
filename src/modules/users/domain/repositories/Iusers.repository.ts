import { User } from '@prisma/client';
import { CreateUserDTO } from '../dto/createUser.dto';
import { UpdateUserDTO } from '../dto/uptadeUser.dto';

export interface IUserRepository {
  createUser(data: CreateUserDTO): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getByIdUser(id: number): Promise<User | null>;
  getByEmailUser(email: string): Promise<User | null>;
  updateUser(id: number, data: UpdateUserDTO): Promise<User>;
  deleteUser(id: number): Promise<User>;
  hashPassword(password: string): Promise<string>;
  uploadAvatar(id: number, avatarFilename: string): Promise<User>;
}
