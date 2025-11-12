import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPOSITORY_TOKEN_HOTEL } from '../../utils/repositoriesTokens';
import type { IHotelRepository } from '../repositories/Ihotel.repository';
import { join, resolve } from 'path';
import { stat, unlink } from 'fs/promises';

@Injectable()
export class UploadImageHotelService {
  constructor(
    @Inject(REPOSITORY_TOKEN_HOTEL)
    private readonly hotelRepositories: IHotelRepository,
  ) {}

  async execute(id: string, imageFileName: string) {
    const hotel = await this.hotelRepositories.findHotelById(Number(id));
    const directory = resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      'uploads',
      'hotels',
    );
    if (!hotel) {
      throw new NotFoundException('User not found');
    }

    if (hotel.image) {
      const imageHotelFilePath = join(directory, hotel.image);
      const imageHotelFileExists = await stat(imageHotelFilePath);

      if (imageHotelFileExists) {
        await unlink(imageHotelFilePath);
      }
    }
    return await this.hotelRepositories.updateHotel(Number(id), {
      image: imageFileName,
    });
  }
}
