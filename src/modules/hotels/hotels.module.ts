import { Module } from '@nestjs/common';
import { HotelsController } from './infra/hotels.controller';
import { CreateHotelService } from './domain/services/createHotel.service';
import { UpdateHotelService } from './domain/services/updateHotel.service';
import { FindAllHotelService } from './domain/services/findAllHotel.service';
import { FindOneHotelService } from './domain/services/findOneHotel.service';
import { DeleteHotelService } from './domain/services/deleteHotel.service';
import { PrismaModule } from '../prisma/prisma.module';
import { HotelRepositories } from './infra/hotels.repository';
import { REPOSITORY_TOKEN_HOTEL } from './utils/repositoriesTokens';
import { FindByNameHotelService } from './domain/services/findByNameHotel.service';
import { FindByOwnerHotelService } from './domain/services/findByOwnerHotel.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [HotelsController],
  providers: [
    CreateHotelService,
    UpdateHotelService,
    FindAllHotelService,
    FindOneHotelService,
    DeleteHotelService,
    FindByNameHotelService,
    FindByOwnerHotelService,
    {
      provide: REPOSITORY_TOKEN_HOTEL,
      useClass: HotelRepositories,
    },
  ],
})
export class HotelsModule {}
