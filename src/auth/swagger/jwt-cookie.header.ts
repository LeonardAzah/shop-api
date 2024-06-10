import { ApiResponseOptions } from '@nestjs/swagger';
import { HeadersObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const JwtCokieHeader: HeadersObject = {
  'Set-Cookie': { description: 'JWT cookie', schema: { type: 'string' } },
};
