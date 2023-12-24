import DefaultException from '@/exceptions/DefaultException';

export class InvalidCredentialsException extends DefaultException {
  constructor() {
    super('InvalidCredentials', 'Email and/or password invalids', 'Auth');
  }
}

export class InexistentUserException extends DefaultException {
  constructor() {
    super('InexistentUser', 'No users matching this email', 'Auth');
  }
}
