import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from './user/interface/user.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(user: IUser) {
    const payload = {
      email: user.email,
      sub: user._id.toString(),
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
