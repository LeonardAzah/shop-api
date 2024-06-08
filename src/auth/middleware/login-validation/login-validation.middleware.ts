import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { LoginDto } from '../../dtos/login.dto';
import { validate } from 'class-validator';

@Injectable()
export class LoginValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const loginDto = plainToInstance(LoginDto, req.body);
    const errors = await validate(loginDto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length) {
      const errorMessages = errors.map((error) =>
        Object.values(error.constraints).join(),
      );
      throw new BadRequestException(errorMessages);
    }

    next();
  }
}
