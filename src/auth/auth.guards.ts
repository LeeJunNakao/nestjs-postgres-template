import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {
  CredentialsNotAllowedHttpException,
  UnauthorizedHttpException,
} from './exceptions/authentication.http';
import { Request } from '@/interfaces';
import { Roles } from './auth.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedHttpException();
    }

    return true;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const role = request.user?.role;

    const hasPermission = roles.includes(role);

    if (!hasPermission) {
      throw new CredentialsNotAllowedHttpException();
    }

    return hasPermission;
  }
}
