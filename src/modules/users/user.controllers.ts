import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './domain/dto/createUser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    return await this.userService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.userService.getByid(id);
  }

  @Post()
  async create(@Body() body: CreateUserDTO) {
    return await this.userService.create(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return await this.userService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
