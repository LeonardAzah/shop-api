import {
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
import { error } from 'console';

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
        password: true,
      },
      where: { email },
    });

    if (!user) {
      this.logger.error(`Failed to get user with email: ${email}`);
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
      this.logger.error(
        `Token provided by: ${(user.name, user.email)} is invalid`,
      );
      throw new UnauthorizedException('Invalid token');
    }
    return this.createRequestUser(user);
  }

  login(user: RequestUser) {
    const payload: JwtPayload = { sub: user.id };
    return this.jwtService.sign(payload);
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

  private createRequestUser(user: User) {
    const { id, role } = user;
    const requestUser: RequestUser = { id, role };
    return requestUser;
  }
}
