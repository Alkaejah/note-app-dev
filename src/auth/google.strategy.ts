import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/api/auth/callback/google',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: unknown,
    accessToken: string,
    refreshToken: string,
    profile: {
      name?: { givenName?: string };
      emails?: { value: string }[];
      photos?: { value: string }[];
    },
  ) {
    const { name, emails, photos } = profile;
    const user = {
      email: emails?.[0]?.value || '',
      name: name?.givenName || '',
      profilePicture: photos?.[0]?.value || '',
    };

    const existingUser = await this.userService.createOrUpdateUser(
      user.email,
      user.name,
      user.profilePicture,
    );

    return existingUser;
  }
}
