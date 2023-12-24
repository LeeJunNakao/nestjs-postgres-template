import { Request as ExpressRequest } from 'express';
import { UserRole } from './auth/entities/auth.orm';

export type LoggedUserData = {
  id: number | string;
  email: string;
  role: UserRole;
};

export type Request = Omit<ExpressRequest, 'session'> & {
  user?: LoggedUserData;
};
