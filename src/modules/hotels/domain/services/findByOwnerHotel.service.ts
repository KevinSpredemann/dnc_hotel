import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN_HOTEL } from '../../utils/repositoriesTokens';
import type { IHotelRepository } from '../repositories/Ihotel.repository';

@Injectable()
export class FindByOwnerHotelService {
  constructor(
    @Inject(REPOSITORY_TOKEN_HOTEL)
    private readonly hotelRepositories: IHotelRepository,
  ) {}
  async execute(id: number) {
    const hotels = await this.hotelRepositories.findHotelByOwner(id);
    const newHotels = hotels.map((hotel) => {
      if (hotel.image) {
        hotel.image = `${process.env.APP_API_URL}/uploads-hotel/${hotel.image}`;
      }
      return hotel;
    });

    return newHotels;
  }
}
