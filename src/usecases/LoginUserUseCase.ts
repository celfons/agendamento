import { IUserRepository } from '../domain/interfaces/IUserRepository';
import { JwtService } from '../infrastructure/auth/JwtService';
import { UserModel } from '../infrastructure/database/UserModel';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(loginData: LoginRequest): Promise<LoginResponse> {
    // Find user by email
    const user = await this.userRepository.findByEmail(loginData.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Get the document to access comparePassword method
    const userDoc = await UserModel.findById(user.id);
    if (!userDoc) {
      throw new Error('Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await userDoc.comparePassword(loginData.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = JwtService.generateToken({
      userId: user.id!,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id!,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
