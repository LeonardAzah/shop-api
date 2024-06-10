import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundError } from 'typeorm';
import { HttpError } from '../../../common/util/http-error.util';
import { extactFormText } from '../../../common/util/regex.util';

@Catch(EntityNotFoundError)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const { status, error } = HttpError.NOT_FOUND;
    const { entityName } = this.extractMessageData(exception.message);
    const message = `${entityName} not found`;

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
    });
  }

  private extractMessageData(message: string) {
    const entityName = extactFormText(message, this.ENTITY_NAME_REGEX);
    return { entityName };
  }

  private readonly ENTITY_NAME_REGEX = /type\s\"(\w+)\"/;
}
