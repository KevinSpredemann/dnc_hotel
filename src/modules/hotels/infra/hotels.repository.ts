import { Hotel } from '@prisma/client';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import { IHotelRepository } from '../domain/repositories/Ihotel.repositories';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';


@Injectable()
export class HotelRepositories implements IHotelRepository {
  constructor(private readonly prisma: PrismaService) {}
  createHotel(data: CreateHotelDto, id: number): Promise<Hotel> {
    data.ownerId = id;
    return this.prisma.hotel.create({ data });
  }
  findHotelByName(name: string): Promise<Hotel[] | null> {
    return this.prisma.hotel.findMany({
      where: { name: { contains: name } },
    });
  }
  findHotelById(id: number): Promise<Hotel | null> {
    return this.prisma.hotel.findUnique({ where: { id: Number(id) } });
  }
  async findHotels(offSet: number, limit: number): Promise<Hotel[]> {
    return this.prisma.hotel.findMany({
      skip: offSet,
      take: limit,
      include: { owner: true },
    });
  }

  countHotels(): Promise<number> {
    return this.prisma.hotel.count();
  }
  findHotelByOwner(ownerId: number): Promise<Hotel[]> {
    return this.prisma.hotel.findMany({ where: { ownerId } });
  }
  updateHotel(id: number, data: UpdateHotelDto): Promise<Hotel> {
    return this.prisma.hotel.update({ where: { id }, data });
  }
  deleteHotel(id: number): Promise<Hotel> {
    return this.prisma.hotel.delete({ where: { id } });
  }
}
