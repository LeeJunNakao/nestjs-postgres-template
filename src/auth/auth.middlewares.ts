import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { Request } from '@/interfaces';
import { AuthService } from './auth.service';
import { InvalidAuthTokenHttpException } from './exceptions/authentication.http';

@Injectable()
export class CredentialMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization;

      if (token) {
        const accessToken = token.split('Bearer ')[1];

        if (!accessToken) {
          throw new InvalidAuthTokenHttpException();
        }

        const userData =
          await this.authService.validateUserCredential(accessToken);

        req.user = userData;
      } else {
        req.user = undefined;
      }

      next();
    } catch (error) {
      req.user = undefined;
    }
  }
}
