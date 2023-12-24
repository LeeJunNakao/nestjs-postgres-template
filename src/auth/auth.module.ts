import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserOrm, UserRole } from './entities/auth.orm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrm])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {
  constructor(
    private adminService: AuthService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const hasAdminCreated = await this.adminService.existsRootAdmin();
    if (!hasAdminCreated) {
      const email = await this.configService.get('ADMIN_EMAIL');
      const password = await this.configService.get('ADMIN_PASSWORD');

      await this.adminService.register({
        name: 'admin',
        email,
        password,
        role: UserRole.ADMIN,
      });
    }
  }
}
