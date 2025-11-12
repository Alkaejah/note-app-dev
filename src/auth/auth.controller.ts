import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { IUser } from './user/interface/user.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../types/auth.types';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @ApiOperation({
    summary: 'Initiate Google OAuth login',
    description:
      'Redirects to Google OAuth consent screen. User will be redirected back to /api/auth/callback/google after authentication.',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirect to Google OAuth',
  })
  googleLogin(@Res() res: Response) {
    res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:3000/api/auth/callback/google&response_type=code&scope=openid%20profile%20email`,
    );
  }

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google OAuth callback',
    description:
      'Handles the OAuth callback from Google and returns JWT token. This endpoint is called automatically by Google after user authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Login successful' },
        token: {
          type: 'object',
          properties: {
            access_token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIs...',
            },
          },
        },
      },
    },
  })
  googleLoginCallback(@Req() req: AuthenticatedRequest) {
    const user = req.user as IUser;
    const token = this.authService.login(user);
    return {
      message: 'Login successful',
      token,
    };
  }
}
