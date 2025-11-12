import { Document } from 'mongoose';
import { UserRole } from '../schema/user.schema';

export interface IUser extends Document {
  _id: string;
  email: string;
  name: string;
  profilePicture: string;
  role: UserRole;
}
