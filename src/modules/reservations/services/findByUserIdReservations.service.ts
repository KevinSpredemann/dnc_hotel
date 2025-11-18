import { Inject, Injectable } from '@nestjs/common';
import type { IReservationRepository } from '../domain/repositories/Ireservations.repository';
import { REPOSITORY_TOKEN_RESERVATION } from '../utils/reservationsTokens';

@Injectable()
export class FindByUserIdReservationssService {
  constructor(
    @Inject(REPOSITORY_TOKEN_RESERVATION)
    private readonly reservationsRepository: IReservationRepository,
  ) {}

  async execute(id: number) {
    return await this.reservationsRepository.findByUserId(id);
  }
}
