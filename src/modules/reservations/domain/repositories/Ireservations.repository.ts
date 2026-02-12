import { Reservation, ReservationStatus } from '@prisma/client';
import { CreateReservationDto } from '../dto/create-reservation.dto';

export interface IReservationRepository {
  findByHotelId(hotelId: number): Promise<Reservation[]>;
  create(data: CreateReservationDto): Promise<Reservation>;
  findById(id: number): Promise<Reservation | null>;
  findAll(): Promise<Reservation[]>;
  findByUserId(userId: number): Promise<Reservation[]>;
  updateStatus(id: number, status: ReservationStatus): Promise<Reservation>;
}
