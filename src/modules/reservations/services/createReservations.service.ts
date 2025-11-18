import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import type { IReservationRepository } from '../domain/repositories/Ireservations.repository';
import { REPOSITORY_TOKEN_RESERVATION } from '../utils/reservationsTokens';
import { parseISO, differenceInDays } from 'date-fns';
import type { IHotelRepository } from '../../hotels/domain/repositories/Ihotel.repository';
import { Reservation, ReservationStatus } from '@prisma/client';
import { REPOSITORY_TOKEN_HOTEL } from '../../hotels/utils/repositoriesTokens';
@Injectable()
export class CreateReservationsService {
  constructor(
    @Inject(REPOSITORY_TOKEN_RESERVATION)
    private readonly reservationsRepository: IReservationRepository,
    @Inject(REPOSITORY_TOKEN_HOTEL)
    private readonly hotelsRepository: IHotelRepository,
  ) {}
  async execute(id: number, data: CreateReservationDto) {
    const checkInDate = parseISO(data.checkIn);
    const checkOutDate = parseISO(data.checkOut);
    const daysOfStay = differenceInDays(checkOutDate, checkInDate);

    if (checkInDate >= checkOutDate) {
      throw new BadRequestException(
        'Check-out date must be after check-in date.',
      );
    }

    const hotel = await this.hotelsRepository.findHotelById(
      Number(data.hotelId),
    );

    if (!hotel) {
      throw new NotFoundException('Hotel not found.');
    }

    if (typeof hotel.price !== 'number' || hotel.price <= 0) {
      throw new BadRequestException('Invalid hotel price.');
    }

    const total = hotel.price * daysOfStay;

    const newReservation = {
      ...data,
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      total,
      userId: id,
      status: ReservationStatus.PENDING,
    };

    return this.reservationsRepository.create(newReservation);
  }
}
