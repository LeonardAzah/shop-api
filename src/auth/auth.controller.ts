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
  Req,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/currentUser.decorator';
import { RequestUser } from './interfaces/request-user.interface';
import { Request, Response } from 'express';
import { Public } from './decorators/public.decorator';
import { IdDto } from '../common/dto/id.dto';
import { RoleDto } from './roles/dtos/role.dto';
import { Roles } from './decorators/roles.decorator';
import { Role } from './roles/enums/roles.enum';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { JwtCokieHeader } from './swagger/jwt-cookie.header';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { attachCookiesToResponse } from './util/cookies';
import { RefreshTokenAuthGuard } from './guards/jwt-auth/refreshToken.guard';

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
  async login(
    @CurrentUser() user: RequestUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.logger.log(`Handling login of user: ${user}`);

    const result = await this.authService.login(user);
    attachCookiesToResponse({
      res: response,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    });
    return {
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Put('logout')
  logout(@CurrentUser() user: RequestUser) {
    return this.authService.logout(user);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenAuthGuard)
  @Get('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() user: RequestUser,
  ) {
    const refreshToken = req.user['refreshToken'];
    const result = await this.authService.refreshToken(user, refreshToken);
    attachCookiesToResponse({
      res: response,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getProfile(@CurrentUser() { id }: RequestUser) {
    this.logger.log(`Handling get user with Id: ${id}`);
    return this.authService.getProfile(id);
  }

  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @Patch(':id/assign-role')
  assignRole(@Param() { id }: IdDto, @Body() { role }: RoleDto) {
    this.logger.log(`Handling assigning user ith Id: ${id} the role:${role}`);
    return this.authService.assignRole(id, role);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.googleLogin(req.user);
    attachCookiesToResponse({
      res: response,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    });
    return {
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    };
  }
}
