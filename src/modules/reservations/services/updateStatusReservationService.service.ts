import { Inject, Injectable } from '@nestjs/common';
import type { IReservationRepository } from '../domain/repositories/Ireservations.repository';
import { REPOSITORY_TOKEN_RESERVATION } from '../utils/reservationsTokens';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class UpdateStatusReservationService {
  constructor(
    @Inject(REPOSITORY_TOKEN_RESERVATION)
    private readonly reservationsRepository: IReservationRepository,
  ) {}

  async execute(id: number, status: ReservationStatus) {
    return await this.reservationsRepository.updateStatus(id, status);
  }
}
