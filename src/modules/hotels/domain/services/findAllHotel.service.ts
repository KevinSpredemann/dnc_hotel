import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN_HOTEL } from '../../utils/repositoriesTokens';
import type { IHotelRepository } from '../repositories/Ihotel.repository';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { REDIS_HOTEL_KEY } from '../../utils/redisKey';

const getRedisKey = (page: number, limit: number) => {
  return `${REDIS_HOTEL_KEY}-page-${page}-limit-${limit}`;
};

@Injectable()
export class FindAllHotelService {
  constructor(
    @Inject(REPOSITORY_TOKEN_HOTEL)
    private readonly hotelRepositories: IHotelRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async execute(page: number = 1, limit: number = 10) {
    const offSet = (page - 1) * limit;
    const redisKey = getRedisKey(page, limit);

    const dataRedis = await this.redis.get(redisKey);

    if (dataRedis) {
      const parsedData = JSON.parse(dataRedis);

      const total = await this.hotelRepositories.countHotels();

      return {
        total,
        page,
        per_page: limit,
        data: parsedData,
      };
    }
    const data = await this.hotelRepositories.findHotels(offSet, limit);

    await this.redis.set(redisKey, JSON.stringify(data));

    const total = await this.hotelRepositories.countHotels();

    return {
      total,
      page,
      per_page: limit,
      data,
    };
  }
}
