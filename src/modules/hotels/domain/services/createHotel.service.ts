import { Inject, Injectable } from '@nestjs/common';
import { CreateHotelDto } from '../dto/create-hotel.dto';
import { REPOSITORY_TOKEN_HOTEL } from '../../utils/repositoriesTokens';
import type { IHotelRepository } from '../repositories/Ihotel.repository';

@Injectable()
export class CreateHotelService {
  constructor(
    @Inject(REPOSITORY_TOKEN_HOTEL)
    private readonly hotelRepositories: IHotelRepository,
  ) {}
  async execute(createHotelDto: CreateHotelDto, id: number) {
    return await this.hotelRepositories.createHotel(createHotelDto, id);
  }
}
