import { Request } from 'express';
import { IUser } from '../auth/user/interface/user.interface';

export interface AuthenticatedUser {
  userId: string;
  email: string;
}

export interface JwtUser {
  _id: string;
  email: string;
  role?: string;
}

export interface PassportUser extends IUser {}

export interface AuthenticatedRequest extends Request {
  user: JwtUser | PassportUser;
}
