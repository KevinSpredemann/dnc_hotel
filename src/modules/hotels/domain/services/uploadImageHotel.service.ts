import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import { stat, unlink } from 'fs/promises';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { REPOSITORY_TOKEN_HOTEL } from '../../utils/repositoriesTokens';
import type { IHotelRepository } from '../repositories/Ihotel.repository';
import { REDIS_HOTEL_KEY } from '../../utils/redisKey';

@Injectable()
export class UploadImageHotelService {
  constructor(
    @Inject(REPOSITORY_TOKEN_HOTEL)
    private readonly hotelRepositories: IHotelRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async execute(id: string, imageFileName: string) {
    const hotel = await this.hotelRepositories.findHotelById(Number(id));
    const directory = join(process.cwd(), 'uploads-hotel');

    if (!hotel) {
      throw new NotFoundException('Hotel not found.');
    }

    if (hotel.image) {
      const imageHotelFilePath = join(directory, hotel.image);

      try {
        await stat(imageHotelFilePath);
        await unlink(imageHotelFilePath);
      } catch (err) {
        if (err.code !== 'ENOENT') {
          throw err;
        }
      }
    }
    await this.redis.del(REDIS_HOTEL_KEY);

    return await this.hotelRepositories.updateHotel(Number(id), {
      image: imageFileName,
    });
  }
}
