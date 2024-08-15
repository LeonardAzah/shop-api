import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from './hashing/hashing.service';
import { RequestUser } from './interfaces/request-user.interface';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Role } from './roles/enums/roles.enum';
import { UserRegisterDto } from './dtos/registeruser.dto';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async validateLocal(email: string, password: string) {
    this.logger.debug(`Getting user with email: ${email}`);
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        email: true,
        role: true,
        password: true,
      },
      where: { email },
    });

    if (!user) {
      this.logger.error(`Failed to get user with email`);
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await this.hashingService.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.createRequestUser(user);
  }

  async validateJwt(payload: JwtPayload) {
    this.logger.log(`Retrieving a user with id: ${payload.sub}`);
    const user = await this.userRepository.findOneBy({ id: payload.sub });
    this.logger.log(`Retrieved user with id ${payload.sub}`);

    if (!user) {
      this.logger.error(`Token provided is invalid`);
      throw new UnauthorizedException('Invalid token');
    }
    return this.createRequestUser(user);
  }

  async login(user: RequestUser) {
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      email: user.email,
    };
    const tokens = await this.getTokens(payload);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      tokens,
    };
  }

  async logout(user: RequestUser) {
    const currentUser = await this.userRepository.preload({ id: user.id });
    currentUser.refreshToken = null;
    return this.userRepository.save(currentUser);
  }

  async refreshToken(user: RequestUser, refreshToken: string) {
    const currentUser = await this.userRepository.findOneBy({ id: user.id });

    if (!currentUser || !refreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const refreshTokenMatches = await this.hashingService.compare(
      refreshToken,
      currentUser.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const payload: JwtPayload = {
      sub: currentUser.id,
      role: currentUser.role,
      email: currentUser.email,
    };
    const tokens = await this.getTokens(payload);
    await this.updateRefreshToken(currentUser.id, tokens.refreshToken);

    return {
      tokens,
    };
  }

  getProfile(id: string) {
    this.logger.debug(`Getting user with Id: ${id}`);
    return this.userRepository.findOneBy({ id });
  }

  async assignRole(id: string, role: Role) {
    this.logger.debug(`Assigning role of ${role} to  user with Id: ${id}`);
    const user = await this.userRepository.preload({
      id,
      role,
    });
    if (!user) {
      this.logger.warn(`User with Id: ${id} is not found`);
      throw new NotFoundException('User not found');
    }
    return this.userRepository.save(user);
  }

  async googleLogin(googleUser: UserRegisterDto) {
    const user = await this.userRepository.findOneBy({
      email: googleUser.email,
    });
    if (!user) {
      return this.registerUser(googleUser);
    }

    const newUser = this.createRequestUser(user);

    return this.login(newUser);
  }

  async registerUser(user: UserRegisterDto) {
    const newUser = this.userRepository.create(user);
    const savedUser = await this.userRepository.save(newUser);
    const payload: JwtPayload = {
      sub: savedUser.id,
      role: savedUser.role,
      email: savedUser.email,
    };
    const tokens = await this.getTokens(payload);
    await this.updateRefreshToken(savedUser.id, tokens.refreshToken);
    return { user: this.createRequestUser(savedUser), tokens };
  }

  private createRequestUser(user: User) {
    const { id, role, email } = user;
    const requestUser: RequestUser = { id, role, email };
    return requestUser;
  }

  async getTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRETE,
        expiresIn: process.env.JWT_ACCESS_TTL,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_TTL,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userRepository.preload({ id: userId });
    const hashedRefreshToken = await this.hashingService.hash(refreshToken);
    user.refreshToken = hashedRefreshToken;
    await this.userRepository.save(user);
  }
}
