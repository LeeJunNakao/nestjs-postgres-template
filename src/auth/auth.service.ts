import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrm, UserRole } from './entities/auth.orm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  InexistentUserException,
  InvalidCredentialsException,
} from './exceptions/authentication';
import { LoggedUserData } from '@/interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserOrm) private repository: Repository<UserOrm>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async validatePassword(password: string, hashedPassword: string) {
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      throw new InvalidCredentialsException();
    }
  }

  private async formatRegisterData(
    registerDto: RegisterDto,
  ): Promise<RegisterDto> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    return {
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role || UserRole.DEFAULT,
    };
  }

  async validateUserCredential(token: string): Promise<LoggedUserData> {
    const decoded = await this.jwtService.verify(token);

    return decoded;
  }

  async existsRootAdmin() {
    const rootEmail = await this.configService.get('ADMIN_EMAIL');
    const admin = await this.repository.findOneBy({ email: rootEmail });

    return !!admin;
  }

  async getLoginCredential(user: UserOrm) {
    const userData: LoggedUserData = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const jwt = this.jwtService.sign(userData);

    return { jwt };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.formatRegisterData(registerDto);

    await this.repository.save(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.repository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new InexistentUserException();
    }

    await this.validatePassword(loginDto.password, user.password);

    return this.getLoginCredential(user);
  }
}
