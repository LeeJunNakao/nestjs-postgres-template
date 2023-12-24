import { Reflector } from '@nestjs/core';
import { UserRole } from './entities/auth.orm';

export const Roles = Reflector.createDecorator<UserRole[]>();
