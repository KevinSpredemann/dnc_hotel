import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const isMulterLimit = exception && (exception.code === 'LIMIT_FILE_SIZE' || exception.code === 'LIMIT_UNEXPECTED_FILE');
    const isPayloadTooLarge = exception && (exception.status === 413 || (exception.name === 'PayloadTooLargeError') || /File too large/i.test(exception.message));
    const isMulterError = exception && exception.name === 'MulterError';

    if (isMulterLimit || isPayloadTooLarge || isMulterError) {
      const message =
        exception && exception.code === 'LIMIT_FILE_SIZE'
          ? 'O arquivo excede o tamanho máximo permitido.'
          : exception && exception.code === 'LIMIT_UNEXPECTED_FILE'
          ? 'Campo de upload inesperado.'
          : 'O arquivo é muito grande ou inválido.';

      return response.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
        statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
        message,
        error: 'Payload Too Large',
      });
    }
    const status = exception?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception?.message ?? 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message,
      error: exception?.name ?? 'Error',
    });
  }
}
