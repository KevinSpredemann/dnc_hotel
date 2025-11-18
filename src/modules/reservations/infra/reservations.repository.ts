import { Injectable } from '@nestjs/common';
import { IReservationRepository } from '../domain/repositories/Ireservations.repository';
import { Reservation } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { IsNumberOptions } from 'class-validator';

@Injectable()
export class ReservationsRepository implements IReservationRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(data: any): Promise<Reservation> {
    return this.prisma.reservation.create({ data });
  }
  findById(id: number): Promise<Reservation> {
    return this.prisma.reservation.findUnique({ where: { id } });
  }

  findAll(): Promise<Reservation[]> {
    return this.prisma.reservation.findMany();
  }

  findByUserId(userId: number): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({ where: { userId } });
  }
}
