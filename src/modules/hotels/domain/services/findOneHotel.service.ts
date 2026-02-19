import { Inject, Injectable } from '@nestjs/common';
import type { IHotelRepository } from '../repositories/Ihotel.repository';
import { REPOSITORY_TOKEN_HOTEL } from '../../utils/repositoriesTokens';

@Injectable()
export class FindOneHotelService {
  constructor(
    @Inject(REPOSITORY_TOKEN_HOTEL)
    private readonly hotelRepositories: IHotelRepository,
  ) {}
  async execute(id: number) {
    const hotel = await this.hotelRepositories.findHotelById(id);
    return hotel;
  }
}
