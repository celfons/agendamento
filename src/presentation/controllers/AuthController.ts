import { Response } from 'express';
import { RegisterUserUseCase } from '../../usecases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../usecases/LoginUserUseCase';
import { AuthRequest } from '../../infrastructure/middleware/AuthMiddleware';
import { validationResult } from 'express-validator';

export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUserUseCase: LoginUserUseCase
  ) {}

  async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const user = await this.registerUserUseCase.execute(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await this.loginUserUseCase.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }
}
