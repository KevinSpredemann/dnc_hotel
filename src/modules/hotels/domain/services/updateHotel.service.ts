import { Inject, Injectable } from '@nestjs/common';
import { UpdateHotelDto } from '../dto/update-hotel.dto';
import { REPOSITORY_TOKEN_HOTEL } from '../../utils/repositoriesTokens';
import type { IHotelRepository } from '../repositories/Ihotel.repository';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { REDIS_HOTEL_KEY } from '../../utils/redisKey';

@Injectable()
export class UpdateHotelService {
  constructor(
    @Inject(REPOSITORY_TOKEN_HOTEL)
    private readonly hotelRepositories: IHotelRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async execute(id: number, updateHotelDto: UpdateHotelDto) {
    await this.redis.del(REDIS_HOTEL_KEY);
    return await this.hotelRepositories.updateHotel(id, updateHotelDto);
  }
}
