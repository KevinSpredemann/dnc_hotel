import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { CreateReservationsService } from '../services/createReservations.service';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { User } from '../../../shared/decorators/user.decorator';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { FindAllReservationssService } from '../services/findAllReservations.service';
import { FindByIdReservationssService } from '../services/findByIdReservations.service';
import { FindByUserIdReservationssService } from '../services/findByUserIdReservations.service';
import { ParamId } from '../../../shared/decorators/paramId.decorator';

@UseGuards(AuthGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly createReservationsService: CreateReservationsService,
    private readonly findAllReservationsService: FindAllReservationssService,
    private readonly findByIdReservationsService: FindByIdReservationssService,
    private readonly findByUserIdReservationsService: FindByUserIdReservationssService,
  ) {}

  @Post()
  create(@User('id') id: number, @Body() body: CreateReservationDto) {
    return this.createReservationsService.execute(id, body);
  }

  @Get()
  findAll() {
    return this.findAllReservationsService.execute();
  }

  @Get('user')
  findByUserId(@User('id') id: number) {
    return this.findByUserIdReservationsService.execute(id);
  }

  @Get(':id')
  findOne(@ParamId() id: number) {
    return this.findByUserIdReservationsService.execute(id);
  }
}
