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

  async execute(id: number, file: Express.Multer.File) {
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

    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'users',
      resource_type: 'image',
    });

    await unlink(file.path);

    return this.userRepositories.uploadAvatar(id, result.secure_url);
  }

  private extractPublicId(url: string): string {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return `users/${fileName.split('.')[0]}`;
  }
}
