import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { PrismaModule } from '../prisma/prisma.module';
import { UserIdCheckMiddleware } from '../../shared/middlewares/userIdCheck.middleware';
import { AuthModule } from '../auth/auth.module';
import { CreateUserService } from './services/createUser.service';
import { DeleteUserService } from './services/deleteUser.service';
import { UpdateUserService } from './services/updateUser.service';
import { UpdateAvatarUserService } from './services/updateAvatarUser.service';
import { GetByEmailUserService } from './services/getByEmailUser.service';
import { GetAllUserService } from './services/getAllUsers.service';
import { GetByIdUserService } from './services/getByIdUser.service';
import { REPOSITORY_TOKEN_USER } from './utils/usersTokens';
import { UserRepository } from './infra/users.repository';
import { UserController } from './infra/users.controller';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const filename = `${uuidv4()}${file.originalname}`;
          return cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    CreateUserService,
    DeleteUserService,
    UpdateUserService,
    UpdateAvatarUserService,
    GetByEmailUserService,
    GetByIdUserService,
    GetAllUserService,
    {
      provide: REPOSITORY_TOKEN_USER,
      useClass: UserRepository,
    },
  ],
  exports: [
    REPOSITORY_TOKEN_USER,
    GetByIdUserService,
    CreateUserService,
    GetByEmailUserService,
    UpdateUserService,
  ],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIdCheckMiddleware)
      .forRoutes(
        { path: 'users/:id', method: RequestMethod.GET },
        { path: 'users/:id', method: RequestMethod.DELETE },
        { path: 'users/:id', method: RequestMethod.PATCH },
      );
  }
}
