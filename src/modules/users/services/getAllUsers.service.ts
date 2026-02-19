import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../domain/repositories/Iusers.repository';
import { REPOSITORY_TOKEN_USER } from '../utils/usersTokens';
import { $Enums, User } from '@prisma/client';

@Injectable()
export class GetAllUserService {
  constructor(
    @Inject(REPOSITORY_TOKEN_USER)
    private readonly userRepositories: IUserRepository,
  ) {}

  async execute() {
    return await this.userRepositories.getAllUsers();
  }
}
