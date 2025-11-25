import { User } from '@prisma/client';
import { CreateUserDTO } from '../domain/dto/createUser.dto';
import type { IUserRepository } from '../domain/repositories/Iusers.repository';
import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { REPOSITORY_TOKEN_USER } from '../utils/usersTokens';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(REPOSITORY_TOKEN_USER)
    private readonly userRepositories: IUserRepository) {}
  async execute(CreateUserDTO: CreateUserDTO): Promise<User> {
    const user = await this.userRepositories.getByEmailUser(
      CreateUserDTO.email,
    );
    if (user) {
      throw new BadRequestException('User already exists');
    }
    CreateUserDTO.password = await this.userRepositories.hashPassword(
      CreateUserDTO.password,
    );
    return await this.userRepositories.createUser(CreateUserDTO);
  }
}
