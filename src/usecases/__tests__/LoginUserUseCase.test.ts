import { LoginUserUseCase, LoginRequest } from '../LoginUserUseCase';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User, UserRole } from '../../domain/entities/User';
import { JwtService } from '../../infrastructure/auth/JwtService';

// Mock JwtService
jest.mock('../../infrastructure/auth/JwtService');

describe('LoginUserUseCase', () => {
  let loginUserUseCase: LoginUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create a mock repository
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addToGroup: jest.fn(),
      removeFromGroup: jest.fn(),
      comparePassword: jest.fn(),
    };

    loginUserUseCase = new LoginUserUseCase(mockUserRepository);
  });

  const mockUser: User = {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: UserRole.USER,
  };

  const loginRequest: LoginRequest = {
    email: 'test@example.com',
    password: 'password123',
  };

  describe('execute', () => {
    it('should login successfully with valid credentials', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUserRepository.comparePassword.mockResolvedValue(true);
      (JwtService.generateToken as jest.Mock).mockReturnValue('mock-jwt-token');

      const result = await loginUserUseCase.execute(loginRequest);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginRequest.email);
      expect(mockUserRepository.comparePassword).toHaveBeenCalledWith(mockUser.id, loginRequest.password);
      expect(JwtService.generateToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({
        token: 'mock-jwt-token',
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });

    it('should throw error when user is not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(loginUserUseCase.execute(loginRequest)).rejects.toThrow(
        'Invalid email or password'
      );
      expect(mockUserRepository.comparePassword).not.toHaveBeenCalled();
      expect(JwtService.generateToken).not.toHaveBeenCalled();
    });

    it('should throw error when password is invalid', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUserRepository.comparePassword.mockResolvedValue(false);

      await expect(loginUserUseCase.execute(loginRequest)).rejects.toThrow(
        'Invalid email or password'
      );
      expect(JwtService.generateToken).not.toHaveBeenCalled();
    });

    it('should not expose password in response', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUserRepository.comparePassword.mockResolvedValue(true);
      (JwtService.generateToken as jest.Mock).mockReturnValue('mock-jwt-token');

      const result = await loginUserUseCase.execute(loginRequest);

      expect(result.user).not.toHaveProperty('password');
    });

    it('should work with organizer role', async () => {
      const organizerUser: User = { ...mockUser, role: UserRole.ORGANIZER };
      mockUserRepository.findByEmail.mockResolvedValue(organizerUser);
      mockUserRepository.comparePassword.mockResolvedValue(true);
      (JwtService.generateToken as jest.Mock).mockReturnValue('organizer-token');

      const result = await loginUserUseCase.execute(loginRequest);

      expect(result.user.role).toBe(UserRole.ORGANIZER);
      expect(JwtService.generateToken).toHaveBeenCalledWith({
        userId: organizerUser.id,
        email: organizerUser.email,
        role: UserRole.ORGANIZER,
      });
    });

    it('should work with admin role', async () => {
      const adminUser: User = { ...mockUser, role: UserRole.ADMIN };
      mockUserRepository.findByEmail.mockResolvedValue(adminUser);
      mockUserRepository.comparePassword.mockResolvedValue(true);
      (JwtService.generateToken as jest.Mock).mockReturnValue('admin-token');

      const result = await loginUserUseCase.execute(loginRequest);

      expect(result.user.role).toBe(UserRole.ADMIN);
    });
  });
});
