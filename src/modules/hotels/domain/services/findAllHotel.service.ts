import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN_HOTEL } from '../../utils/repositoriesTokens';
import type { IHotelRepository } from '../repositories/Ihotel.repository';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { REDIS_HOTEL_KEY } from '../../utils/redisKey';
import { Hotel } from '@prisma/client';

@Injectable()
export class FindAllHotelService {
  constructor(
    @Inject(REPOSITORY_TOKEN_HOTEL)
    private readonly hotelRepositories: IHotelRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async execute(page: number = 1, limit: number = 10) {
    const offSet = (page - 1) * limit;

    const dataRedis = await this.redis.get(REDIS_HOTEL_KEY);
    let data = JSON.parse(dataRedis);

    if (!data) {
      data = await this.hotelRepositories.findHotels(offSet, limit);
      data = data.map((hotel: Hotel) => {
        if (hotel.image) {
          hotel.image = `${process.env.DATABASE_URL}/uploads/${hotel.image}`;
        }
        return hotel;
      });
      await this.redis.set(REDIS_HOTEL_KEY, JSON.stringify(data));
    }

    const total = await this.hotelRepositories.countHotels();
    return {
      total,
      page,
      per_page: limit,
      data,
    };
  }
}
