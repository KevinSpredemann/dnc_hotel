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
import { ReservationStatus } from '@prisma/client';
import { REPOSITORY_TOKEN_HOTEL } from '../../hotels/utils/repositoriesTokens';
import { MailerService } from '@nestjs-modules/mailer';
import { GetByIdUserService } from '../../users/services/getByIdUser.service';
@Injectable()
export class CreateReservationsService {
  constructor(
    @Inject(REPOSITORY_TOKEN_RESERVATION)
    private readonly reservationsRepository: IReservationRepository,
    @Inject(REPOSITORY_TOKEN_HOTEL)
    private readonly hotelsRepository: IHotelRepository,
    private readonly mailerService: MailerService,
    private readonly getByIdUserService: GetByIdUserService,
  ) {}
  async execute(id: number, data: CreateReservationDto) {
    const checkInDate = parseISO(data.checkIn);
    const checkOutDate = parseISO(data.checkOut);
    const daysOfStay = differenceInDays(checkInDate, checkOutDate);

    if (checkInDate >= checkOutDate) {
      throw new BadRequestException(
        'Check-out date must be after check-in date.',
      );
    }

    const hotel = await this.hotelsRepository.findHotelById(data.hotelId);

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

    const hotelOwner = await this.getByIdUserService.execute(hotel.ownerId);

    await this.mailerService.sendMail({
      to: hotelOwner.email,
      subject: 'Pending Reservation Approval',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; text-align: center; border: 2px solid #041d40; border-radius: 10px; margin: auto; width: 60%;">
            <h1 style="color: #041d40;">Pending Reservation Approval</h1>
            <h3 style="color: #041d40;">Dear Hotel Owner,</h3>
            <p style="font-size: 16px; color: #333;">You have a new reservation pending approval. Please review the reservation details and approve or decline the reservation at your earliest convenience.</p>
            <p style="font-size: 16px; color: #333;">To view the reservation, please access your hotel owner profile
            <p style="margin-top: 20px;">Thank you for your prompt attention to this matter.<br>Best regards,<br><span style="font-weight: bold; color: #041d40;">DNC Hotel Management System</span></p>
        </div>
      `,
    });

    return this.reservationsRepository.create(newReservation);
  }
}
