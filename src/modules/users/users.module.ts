import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './infra/users.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { UserIdCheckMiddleware } from '../../shared/middlewares/userIdCheck.middleware.js';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthModule } from '../auth/auth.module.js';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserService } from './services/createUser.service.js';
import { DeleteUserService } from './services/deleteUser.service.js';
import { UpdateUserService } from './services/updateUser.service.js';
import { UpdateAvatarUserService } from './services/updateAvatarUser.service.js';
import { GetByEmailUserService } from './services/getByEmailUser.service.js';
import { GetByIdUserService } from './services/getByIdUser.service.js';
import { GetAllUserService } from './services/getAllUsers.service.js';
import { REPOSITORY_TOKEN_USER } from './utils/usersTokens.js';
import { UserRepository } from './infra/users.repository.js';

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
