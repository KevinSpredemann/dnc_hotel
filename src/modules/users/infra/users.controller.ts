import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from '../domain/dto/createUser.dto';
import { UpdateUserDTO } from '../domain/dto/uptadeUser.dto';
import { ParamId } from '../../../shared/decorators/paramId.decorator';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { Role } from '@prisma/client';
import { Roles } from '../../../shared/decorators/roles.decorators';
import { RoleGuard } from '../../../shared/guards/role.guard';
import { UserMatchGuard } from '../../../shared/guards/userMatch.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { User } from '../../../shared/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationInterceptor } from '../../../shared/interceptors/fileValidation.interceptor';
import { CreateUserService } from '../services/createUser.service';
import { UpdateUserService } from '../services/updateUser.service';
import { GetAllUserService } from '../services/getAllUsers.service';
import { GetByIdUserService } from '../services/getByIdUser.service';
import { GetByEmailUserService } from '../services/getByEmailUser.service';
import { UpdateAvatarUserService } from '../services/updateAvatarUser.service';
import { DeleteUserService } from '../services/deleteUser.service';

@UseGuards(AuthGuard, RoleGuard, ThrottlerGuard)
@Controller('users')
export class UserController {
  constructor(
    private createUserService: CreateUserService,
    private updateUserService: UpdateUserService,
    private getAllUserService: GetAllUserService,
    private getByEmailUserService: GetByEmailUserService,
    private upaloadAvatarUserService: UpdateAvatarUserService,
    private getByIdUserService: GetByIdUserService,
    private deleteUserService: DeleteUserService,
  ) {}

  @Get()
  getAll() {
    return this.getAllUserService.execute();
  }

  @Get(':id')
  getById(@ParamId() id: number) {
    return this.getByIdUserService.execute(id);
  }

  @Get()
  getByEmail(@Body('email') email: string) {
    return this.getByEmailUserService.execute(email);
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() body: CreateUserDTO) {
    console.log(body);
    return this.createUserService.execute(body);
  }

  @UseGuards(UserMatchGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Patch(':id')
  update(@ParamId() id: number, @Body() body: UpdateUserDTO) {
    return this.updateUserService.execute(id, body);
  }

  @UseGuards(UserMatchGuard)
  @Delete(':id')
  delete(@ParamId() id: number) {
    return this.deleteUserService.execute(id);
  }

  @UseInterceptors(FileInterceptor('avatar'), FileValidationInterceptor)
  @Post('avatar')
  uploadAvatar(
    @User('id') id: number,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    if (!avatar) {
      throw new BadRequestException(
        'Arquivo inválido. Apenas imagens (png/jpg/gif) são permitidas.',
      );
    }
    return this.upaloadAvatarUserService.execute(id, avatar.filename);
  }
}
