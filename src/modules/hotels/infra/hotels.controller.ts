import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  UseGuards,
  Param,
  UploadedFile,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';

import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import { CreateHotelService } from '../domain/services/createHotel.service';
import { UpdateHotelService } from '../domain/services/updateHotel.service';
import { FindAllHotelService } from '../domain/services/findAllHotel.service';
import { FindOneHotelService } from '../domain/services/findOneHotel.service';
import { DeleteHotelService } from '../domain/services/deleteHotel.service';
import { ParamId } from '../../../shared/decorators/paramId.decorator';
import { FindByNameHotelService } from '../domain/services/findByNameHotel.service';
import { FindByOwnerHotelService } from '../domain/services/findByOwnerHotel.service';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { RoleGuard } from '../../../shared/guards/role.guard';
import { Roles } from '../../../shared/decorators/roles.decorators';
import { Role } from '@prisma/client';
import { OwnerHotelGuard } from '../../../shared/guards/ownerHotel.guard';
import { User } from '../../../shared/decorators/user.decorator';
import { UploadImageHotelService } from '../domain/services/uploadImageHotel.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationInterceptor } from '../../../shared/interceptors/fileValidation.interceptor';

@UseGuards(AuthGuard, RoleGuard)
@Controller('hotels')
export class HotelsController {
  constructor(
    private readonly createHotelService: CreateHotelService,
    private readonly updateHotelService: UpdateHotelService,
    private readonly findAllHotelService: FindAllHotelService,
    private readonly findOneHotelService: FindOneHotelService,
    private readonly deleteHotelService: DeleteHotelService,
    private readonly findByNameHotelService: FindByNameHotelService,
    private readonly findByOwnerHotelService: FindByOwnerHotelService,
    private readonly uploadHotelService: UploadImageHotelService,
  ) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@User('id') id: number, @Body() createHotelDto: CreateHotelDto) {
    return this.createHotelService.execute(createHotelDto, id);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.findAllHotelService.execute(Number(page), Number(limit));
  }

  @UseInterceptors(FileInterceptor('image'), FileValidationInterceptor)
  @Patch('image/:hotelId')
  uploadImage(
    @Param('hotelId') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.uploadHotelService.execute(id, image.filename);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get('name')
  findByName(@Query('name') name: string) {
    return this.findByNameHotelService.execute(name);
  }

  @Roles(Role.ADMIN)
  @Get('owner')
  findByOwner(@User('id') id: number) {
    return this.findByOwnerHotelService.execute(id);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  findOne(@ParamId() id: number) {
    return this.findOneHotelService.execute(id);
  }

  @UseGuards(OwnerHotelGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@ParamId() id: number, @Body() updateHotelDto: UpdateHotelDto) {
    return this.updateHotelService.execute(id, updateHotelDto);
  }

  @UseGuards(OwnerHotelGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  delete(@ParamId() id: number) {
    return this.deleteHotelService.execute(id);
  }
}
