import { Injectable } from '@nestjs/common';
import { IReservationRepository } from '../domain/repositories/Ireservations.repository';
import { Reservation, ReservationStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReservationsRepository implements IReservationRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(data: any): Promise<Reservation> {
    return this.prisma.reservation.create({ data });
  }
  async findById(id: number): Promise<Reservation> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { user: true },
    });
    if (reservation.user.avatar) {
      reservation.user.avatar = `${process.env.APP_API_URL}/uploads/${reservation.user.avatar}`;
    }
    return reservation;
  }

  findAll(): Promise<Reservation[]> {
    return this.prisma.reservation.findMany();
  }

  findByUserId(userId: number): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  updateStatus(id: number, status: ReservationStatus): Promise<Reservation> {
    return this.prisma.reservation.update({
      where: { id },
      data: { status },
    });
  }
}
