import { User, UserRole } from '../domain/entities/User';
import { IUserRepository } from '../domain/interfaces/IUserRepository';
import { body } from 'express-validator';

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  static getValidationRules() {
    return [
      body('name').trim().notEmpty().withMessage('Name is required'),
      body('email').isEmail().withMessage('Invalid email address'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ];
  }

  async execute(userData: Omit<User, 'id'>): Promise<Omit<User, 'password'>> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Set default role if not provided
    const userToCreate: User = {
      ...userData,
      role: userData.role || UserRole.USER,
    };

    const createdUser = await this.userRepository.create(userToCreate);
    
    // Remove password from response
    const { password, ...userWithoutPassword } = createdUser;
    return userWithoutPassword;
  }
}
