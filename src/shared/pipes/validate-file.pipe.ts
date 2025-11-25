import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateFilePipe implements PipeTransform {
  constructor(private allowedMimes = ['image/webp','image/png','image/jpeg','image/gif'], private maxSize = 9 * 1024 * 1024) {}

  transform(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Arquivo ausente.');
    if (!this.allowedMimes.includes(file.mimetype)) throw new BadRequestException(`Tipo inválido: ${file.mimetype}`);
    if (file.size > this.maxSize) throw new BadRequestException('Arquivo muito grande.');
    return file;
  }
}