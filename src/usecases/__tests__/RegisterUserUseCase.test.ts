import { RegisterUserUseCase } from '../RegisterUserUseCase';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User, UserRole } from '../../domain/entities/User';

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
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

    registerUserUseCase = new RegisterUserUseCase(mockUserRepository);
  });

  const validUserData: Omit<User, 'id'> = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: UserRole.USER,
  };

  describe('execute', () => {
    it('should register a new user successfully', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      const createdUser: User = { ...validUserData, id: '123' };
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await registerUserUseCase.execute(validUserData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validUserData.email);
      expect(mockUserRepository.create).toHaveBeenCalledWith(validUserData);
      expect(result).not.toHaveProperty('password');
      expect(result.name).toBe(validUserData.name);
      expect(result.email).toBe(validUserData.email);
      expect(result.id).toBe('123');
    });

    it('should throw error when user with email already exists', async () => {
      const existingUser: User = { ...validUserData, id: '456' };
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(registerUserUseCase.execute(validUserData)).rejects.toThrow(
        'User with this email already exists'
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should set default role to USER when role is not provided', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      const userDataWithoutRole: any = {
        name: validUserData.name,
        email: validUserData.email,
        password: validUserData.password,
        role: undefined, // Explicitly undefined to test default role assignment
      };

      const createdUser: User = { 
        ...userDataWithoutRole, 
        role: UserRole.USER, 
        id: '123' 
      };
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await registerUserUseCase.execute(userDataWithoutRole);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userDataWithoutRole,
        role: UserRole.USER,
      });
      expect(result.role).toBe(UserRole.USER);
    });

    it('should respect provided role when specified', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      const organizerData: Omit<User, 'id'> = {
        ...validUserData,
        role: UserRole.ORGANIZER,
      };

      const createdUser: User = { ...organizerData, id: '123' };
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await registerUserUseCase.execute(organizerData);

      expect(result.role).toBe(UserRole.ORGANIZER);
    });

    it('should not return password in response', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      const createdUser: User = { ...validUserData, id: '123' };
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await registerUserUseCase.execute(validUserData);

      expect(result).not.toHaveProperty('password');
    });

    it('should propagate repository errors', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(registerUserUseCase.execute(validUserData)).rejects.toThrow('Database error');
    });
  });

  describe('getValidationRules', () => {
    it('should return validation rules array', () => {
      const rules = RegisterUserUseCase.getValidationRules();
      expect(Array.isArray(rules)).toBe(true);
      expect(rules.length).toBeGreaterThan(0);
    });
  });
});
