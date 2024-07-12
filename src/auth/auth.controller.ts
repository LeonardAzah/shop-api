import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Res,
  UseGuards,
  Patch,
  Param,
  Body,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { CurrentUser } from './decorators/currentUser.decorator';
import { RequestUser } from './interfaces/request-user.interface';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { IdDto } from '../common/dto/id.dto';
import { RoleDto } from './roles/dtos/role.dto';
import { Roles } from './decorators/roles.decorator';
import { Role } from './roles/enums/roles.enum';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { JwtCokieHeader } from './swagger/jwt-cookie.header';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
  ) {}

  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    headers: JwtCokieHeader,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  login(
    @CurrentUser() user: RequestUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.logger.log(`Handling login of user: ${user}`);
    const token = this.authService.login(user);

    response.cookie('token', token, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
  }

  @Get('profile')
  getProfile(@CurrentUser() { id }: RequestUser) {
    this.logger.log(`Handling get user with Id: ${id}`);
    return this.authService.getProfile(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/assign-role')
  assignRole(@Param() { id }: IdDto, @Body() { role }: RoleDto) {
    this.logger.log(`Handling assigning user ith Id: ${id} the role:${role}`);
    return this.authService.assignRole(id, role);
  }
}
