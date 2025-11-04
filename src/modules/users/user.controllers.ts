import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
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
}
