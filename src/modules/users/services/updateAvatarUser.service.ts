import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPOSITORY_TOKEN_USER } from '../utils/usersTokens';
import type { IUserRepository } from '../domain/repositories/Iusers.repository';
import { v2 as cloudinary } from 'cloudinary';
import { unlink } from 'fs/promises';

@Injectable()
export class UpdateAvatarUserService {
  constructor(
    @Inject(REPOSITORY_TOKEN_USER)
    private readonly userRepositories: IUserRepository,
  ) {}

  async execute(id: number, avatarUrl: string) {
    const user = await this.userRepositories.getByIdUser(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.avatar) {
      try {
        const publicId = this.extractPublicId(user.avatar);
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log('Erro ao remover avatar antigo:', err);
      }
    }

    return this.userRepositories.uploadAvatar(id, avatarUrl);
  }

  private extractPublicId(url: string): string {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return `users/${fileName.split('.')[0]}`;
  }
}
