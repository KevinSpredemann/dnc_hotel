import { Module } from '@nestjs/common';
import { CreateReservationsService } from './services/createReservations.service';
import { ReservationsController } from './infra/reservations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { HotelsModule } from '../hotels/hotels.module';
import { ReservationsRepository } from './infra/reservations.repository';
import { REPOSITORY_TOKEN_RESERVATION } from './utils/reservationsTokens';
import { HotelRepository } from '../hotels/infra/hotels.repository';
import { REPOSITORY_TOKEN_HOTEL } from '../hotels/utils/repositoriesTokens';
import { FindByIdReservationssService } from './services/findByIdReservations.service';
import { FindByUserIdReservationssService } from './services/findByUserIdReservations.service';
import { FindAllReservationssService } from './services/findAllReservations.service';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, HotelsModule],
  controllers: [ReservationsController],
  providers: [
    CreateReservationsService,
    FindByIdReservationssService,
    FindByUserIdReservationssService,
    FindAllReservationssService,
    {
      provide: REPOSITORY_TOKEN_RESERVATION,
      useClass: ReservationsRepository,
    },
    {
      provide: REPOSITORY_TOKEN_HOTEL,
      useClass: HotelRepository,
    },
  ],
})
export class ReservationsModule {}
