import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './interface/user.interface';
import { UserRole } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<IUser>) {}

  async createOrUpdateUser(
    email: string,
    name: string,
    profilePicture: string,
  ): Promise<IUser> {
    let user = await this.userModel.findOne({ email });

    if (!user) {
      user = new this.userModel({
        email,
        name,
        profilePicture,
        role: UserRole.USER,
      });
      await user.save();
    } else {
      user.name = name;
      user.profilePicture = profilePicture;
      await user.save();
    }

    return user;
  }

  async getAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    users: IUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const total = await this.userModel.countDocuments();
    const skip = (page - 1) * limit;

    const users = await this.userModel
      .find()
      .select('-__v')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async updateUserRole(userId: string, role: UserRole): Promise<IUser | null> {
    return this.userModel.findByIdAndUpdate(userId, { role }, { new: true });
  }
}
