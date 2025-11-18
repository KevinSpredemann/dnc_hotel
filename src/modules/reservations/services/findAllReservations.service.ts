import { Inject, Injectable } from '@nestjs/common';
import type { IReservationRepository } from '../domain/repositories/Ireservations.repository';
import { REPOSITORY_TOKEN_RESERVATION } from '../utils/reservationsTokens';

@Injectable()
export class FindAllReservationssService {
  constructor(
    @Inject(REPOSITORY_TOKEN_RESERVATION)
    private readonly reservationsRepository: IReservationRepository,
  ) {}

  async execute() {
    return await this.reservationsRepository.findAll();
  }
}
