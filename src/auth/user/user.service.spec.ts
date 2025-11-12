import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { IUser } from './interface/user.interface';
import { UserRole } from './schema/user.schema';

describe('UserService', () => {
  let service: UserService;
  let mockUserModel: any;

  const mockUser: IUser = {
    _id: 'userId123',
    email: 'test@example.com',
    name: 'Test User',
    profilePicture: 'pic.jpg',
    role: UserRole.USER,
  } as IUser;

  beforeEach(async () => {
    mockUserModel = jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue({ ...data, _id: 'userId123' }),
    }));

    mockUserModel.findOne = jest.fn();
    mockUserModel.find = jest.fn();
    mockUserModel.countDocuments = jest.fn();
    mockUserModel.findByIdAndUpdate = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrUpdateUser', () => {
    it('should create a new user with default USER role', async () => {
      const email = 'new@example.com';
      const name = 'New User';
      const profilePicture = 'newpic.jpg';

      const mockNewUser = {
        ...mockUser,
        email,
        name,
        profilePicture,
        role: UserRole.USER,
        save: jest.fn().mockResolvedValue({
          ...mockUser,
          email,
          name,
          profilePicture,
          role: UserRole.USER,
        }),
      };

      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.mockReturnValue(mockNewUser);

      const result = await service.createOrUpdateUser(
        email,
        name,
        profilePicture,
      );

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(mockUserModel).toHaveBeenCalledWith({
        email,
        name,
        profilePicture,
        role: UserRole.USER,
      });
      expect(result.role).toBe(UserRole.USER);
    });

    it('should update existing user without changing role', async () => {
      const email = 'existing@example.com';
      const name = 'Updated Name';
      const profilePicture = 'updatedpic.jpg';

      const existingUser = {
        ...mockUser,
        email,
        save: jest.fn().mockResolvedValue({
          ...mockUser,
          name,
          profilePicture,
        }),
      };

      mockUserModel.findOne.mockResolvedValue(existingUser);

      const result = await service.createOrUpdateUser(
        email,
        name,
        profilePicture,
      );

      expect(existingUser.save).toHaveBeenCalled();
      expect(result.name).toBe(name);
      expect(result.profilePicture).toBe(profilePicture);
    });
  });

  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      const page = 1;
      const limit = 10;
      const mockUsers = [mockUser, { ...mockUser, _id: 'userId456' }];
      const total = 2;

      mockUserModel.countDocuments.mockResolvedValue(total);
      mockUserModel.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue(mockUsers),
            }),
          }),
        }),
      });

      const result = await service.getAllUsers(page, limit);

      expect(mockUserModel.countDocuments).toHaveBeenCalled();
      expect(result).toEqual({
        users: mockUsers,
        total,
        page,
        limit,
        totalPages: 1,
      });
    });

    it('should use default pagination values', async () => {
      const mockUsers = [mockUser];
      const total = 1;

      mockUserModel.countDocuments.mockResolvedValue(total);
      mockUserModel.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue(mockUsers),
            }),
          }),
        }),
      });

      const result = await service.getAllUsers();

      expect(mockUserModel.countDocuments).toHaveBeenCalled();
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });

  describe('updateUserRole', () => {
    it('should update user role', async () => {
      const userId = 'userId123';
      const newRole = UserRole.ADMIN;
      const updatedUser = { ...mockUser, role: newRole };

      mockUserModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await service.updateUserRole(userId, newRole);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { role: newRole },
        { new: true },
      );
      expect(result).toEqual(updatedUser);
    });

    it('should return null if user not found', async () => {
      const userId = 'nonexistent';
      const newRole = UserRole.ADMIN;

      mockUserModel.findByIdAndUpdate.mockResolvedValue(null);

      const result = await service.updateUserRole(userId, newRole);

      expect(result).toBeNull();
    });
  });
});
