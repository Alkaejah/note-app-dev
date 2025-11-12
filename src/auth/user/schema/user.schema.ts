import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop()
  name!: string;

  @Prop()
  profilePicture!: string;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role!: UserRole;
}

export const userSchema = SchemaFactory.createForClass(User);
