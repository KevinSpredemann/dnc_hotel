import { Module } from '@nestjs/common';
import { HotelsController } from './infra/hotels.controller';
import { CreateHotelService } from './domain/services/createHotel.service';
import { UpdateHotelService } from './domain/services/updateHotel.service';
import { FindAllHotelService } from './domain/services/findAllHotel.service';
import { FindOneHotelService } from './domain/services/findOneHotel.service';
import { DeleteHotelService } from './domain/services/deleteHotel.service';
import { PrismaModule } from '../prisma/prisma.module';
import { HotelRepository } from './infra/hotels.repository';
import { REPOSITORY_TOKEN_HOTEL } from './utils/repositoriesTokens';
import { FindByNameHotelService } from './domain/services/findByNameHotel.service';
import { FindByOwnerHotelService } from './domain/services/findByOwnerHotel.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadImageHotelService } from './domain/services/uploadImageHotel.service';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    MulterModule.register({
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, join(process.cwd(), 'uploads-hotel'));
        },
        filename: (_req, file, cb) => {
          const fileName = `${uuidv4()}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
    }),
  ],
  controllers: [HotelsController],
  providers: [
    CreateHotelService,
    UpdateHotelService,
    FindAllHotelService,
    FindOneHotelService,
    DeleteHotelService,
    FindByNameHotelService,
    FindByOwnerHotelService,
    UploadImageHotelService,

    {
      provide: REPOSITORY_TOKEN_HOTEL,
      useClass: HotelRepository,
    },
  ],
})
export class HotelsModule {}
