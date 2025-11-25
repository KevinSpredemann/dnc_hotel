import { Inject, Injectable } from '@nestjs/common';
import type { IReservationRepository } from '../domain/repositories/Ireservations.repository';
import { REPOSITORY_TOKEN_RESERVATION } from '../utils/reservationsTokens';
import { ReservationStatus } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';
import { GetByIdUserService } from '../../users/services/getByIdUser.service';
import { REPOSITORY_TOKEN_USER } from '../../users/utils/usersTokens';

@Injectable()
export class UpdateStatusReservationService {
  constructor(
    @Inject(REPOSITORY_TOKEN_RESERVATION)
    private readonly reservationsRepository: IReservationRepository,
    private readonly mailerService: MailerService,
    private readonly getByIdUserService: GetByIdUserService,
  ) {}

  async execute(id: number, status: ReservationStatus) {
    const reservation = await this.reservationsRepository.updateStatus(
      id,
      status,
    );
    const user = await this.getByIdUserService.execute(reservation.userId);
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reservation Status Update',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; text-align: center; border: 2px solid #041d40; border-radius: 10px; margin: auto; width: 60%;">
            <h1 style="color: #041d40;">Reservation Status Update</h1>
            <h3 style="color: #041d40;">Dear ${user.name},</h3>
            <p style="font-size: 16px; color: #333;">We are pleased to inform you that your reservation status has been updated. Your current reservation status is:</p>
            <h2 style="color: #041d40;">${reservation.status}</h2>
            <p style="margin-top: 10px;">For any further assistance, please do not hesitate to contact us.<br>Best regards,<br><span style="font-weight: bold; color: #041d40;">DNC Hotel</span></p>
        </div>
      `,
    });
    return reservation;
  }
}
