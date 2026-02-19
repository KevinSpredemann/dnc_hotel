import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { REPOSITORY_TOKEN_HOTEL } from '../../utils/repositoriesTokens';
import type { IHotelRepository } from '../repositories/Ihotel.repository';
import { REDIS_HOTEL_KEY } from '../../utils/redisKey';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadImageHotelService {
  constructor(
    @Inject(REPOSITORY_TOKEN_HOTEL)
    private readonly hotelRepositories: IHotelRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async execute(id: string, imageUrl: string) {
    const hotel = await this.hotelRepositories.findHotelById(Number(id));

    if (!hotel) {
      throw new NotFoundException('Hotel not found.');
    }

    if (hotel.image) {
      try {
        const publicId = this.extractPublicId(hotel.image);
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log('Erro ao remover imagem antiga:', error);
      }
    }
    const keys = await this.redis.keys(`${REDIS_HOTEL_KEY}*`);
    if (keys.length) {
      await this.redis.del(...keys);
    }

    return await this.hotelRepositories.updateHotel(Number(id), {
      image: imageUrl,
    });
  }

  private extractPublicId(url: string): string {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return `hotels/${fileName.split('.')[0]}`;
  }
}
