import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './domain/dto/createUser.dto';
import { UpdateUserDTO } from './domain/dto/uptadeUser.dto';
import { ParamId } from '../../shared/decorators/paramId.decorator';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { Role } from '@prisma/client';
import { Roles } from '../../shared/decorators/roles.decorators';
import { RoleGuard } from '../../shared/guards/role.guard';
import { UserMatchGuard } from '../../shared/guards/userMatch.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { User } from '../../shared/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterExceptionFilter } from '../../shared/filters/multer-exception.filter';
import { FileValidationInterceptor } from '../../shared/interceptors/fileValidation.interceptor';

@UseGuards(AuthGuard, RoleGuard, ThrottlerGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  getById(@ParamId() id: number) {
    return this.userService.getByid(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() body: CreateUserDTO) {
    console.log(body);
    return this.userService.create(body);
  }

  @UseGuards(UserMatchGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Patch(':id')
  update(@ParamId() id: number, @Body() body: UpdateUserDTO) {
    return this.userService.update(id, body);
  }

  @UseGuards(UserMatchGuard)
  @Delete(':id')
  delete(@ParamId() id: number) {
    return this.userService.delete(id);
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
    return this.userService.uploadAvatar(id, avatar.filename);
  }
}
