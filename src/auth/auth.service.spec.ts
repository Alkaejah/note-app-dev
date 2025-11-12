import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserRole } from './user/schema/user.schema';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    _id: 'userId123',
    email: 'test@example.com',
    name: 'Test User',
    role: UserRole.USER,
    profilePicture: 'pic.jpg',
  } as any;

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token with user info', () => {
      const expectedPayload = {
        email: mockUser.email,
        sub: mockUser._id.toString(),
        role: mockUser.role,
      };
      const expectedToken = 'jwt.token.here';

      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = service.login(mockUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload);
      expect(result).toEqual({
        access_token: expectedToken,
      });
    });

    it('should handle user with admin role', () => {
      const adminUser = { ...mockUser, role: UserRole.ADMIN };
      const expectedPayload = {
        email: adminUser.email,
        sub: adminUser._id.toString(),
        role: adminUser.role,
      };
      const expectedToken = 'admin.jwt.token';

      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = service.login(adminUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload);
      expect(result).toEqual({
        access_token: expectedToken,
      });
    });

    it('should convert _id to string in payload', () => {
      const userWithObjectId = {
        ...mockUser,
        _id: { toString: () => 'convertedId' },
      };
      const expectedPayload = {
        email: userWithObjectId.email,
        sub: 'convertedId',
        role: userWithObjectId.role,
      };

      mockJwtService.sign.mockReturnValue('token');

      service.login(userWithObjectId);

      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload);
    });
  });
});
