import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthenticationFailHttpException } from './exceptions/authentication.http';
import { AuthenticationGuard, RolesGuard } from './auth.guards';
import { Roles } from './auth.decorator';
import { UserRole } from './entities/auth.orm';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthenticationGuard, RolesGuard)
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);

    return {
      message: 'User registered',
      data: { name: registerDto.name, email: registerDto.email },
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const credentials = await this.authService.login(loginDto);

      return credentials;
    } catch (error) {
      throw new AuthenticationFailHttpException();
    }
  }
}
