import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../domain/repositories/Iusers.repository';
import { join, resolve } from 'path';
import { stat, unlink } from 'fs/promises';
import { REPOSITORY_TOKEN_USER } from '../utils/usersTokens';

@Injectable()
export class UpdateAvatarUserService {
  constructor(
    @Inject(REPOSITORY_TOKEN_USER)
    private readonly userRepositories: IUserRepository) {}
  async execute(id: number, avatarFilename: string) {
    const user = await this.userRepositories.getByIdUser(id);
    const directory = resolve(__dirname, '..', '..', '..', 'uploads');

    if (user.avatar) {
      const userAvatarFilePath = join(directory, user.avatar);
      const userAvatarFileExists = await stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await unlink(userAvatarFilePath);
      }
    }

    const userUpdated = await this.userRepositories.uploadAvatar(
      id,
      avatarFilename,
    );

    return userUpdated;
  }
}
