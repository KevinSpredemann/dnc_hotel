import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../domain/repositories/Iusers.repository';
import { UpdateUserDTO } from '../domain/dto/uptadeUser.dto';
import { REPOSITORY_TOKEN_USER } from '../utils/usersTokens';

Injectable();
export class UpdateUserService {
  constructor(
    @Inject(REPOSITORY_TOKEN_USER)
    private readonly userRepositories: IUserRepository) {}
  async execute(id: number, UpdateUserDTO: UpdateUserDTO) {
    return await this.userRepositories.updateUser(id, UpdateUserDTO);
  }
}
