import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN_HOTEL } from '../../utils/repositoriesTokens';
import type { IHotelRepository } from '../repositories/Ihotel.repository';

@Injectable()
export class FindByOwnerHotelService {
  constructor(
    @Inject(REPOSITORY_TOKEN_HOTEL)
    private readonly hotelRepositories: IHotelRepository,
  ) {}
  async execute(ownerId: number) {
    return await this.hotelRepositories.findHotelByOwner(ownerId);
  }
}
