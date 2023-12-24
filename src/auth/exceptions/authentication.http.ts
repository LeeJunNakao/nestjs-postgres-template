import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthenticationFailHttpException extends HttpException {
  constructor() {
    super('Credentials invalid', HttpStatus.UNAUTHORIZED);
  }
}

export class UnauthorizedHttpException extends HttpException {
  constructor() {
    super('No authorization for resource', HttpStatus.UNAUTHORIZED);
  }
}

export class CredentialsNotAllowedHttpException extends HttpException {
  constructor() {
    super(
      'Your credencials are not allowed for this resource ',
      HttpStatus.FORBIDDEN,
    );
  }
}

export class InvalidAuthTokenHttpException extends HttpException {
  constructor() {
    super('Token provided is invalid', HttpStatus.UNAUTHORIZED);
  }
}
