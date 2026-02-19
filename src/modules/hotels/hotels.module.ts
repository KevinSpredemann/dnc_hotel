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
import { UploadImageHotelService } from './domain/services/uploadImageHotel.service';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary';

export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'hotels',
    resource_type: 'image',
  }),
});

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    MulterModule.register({
      storage,
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
