import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { RegisterUserUseCase } from '../../usecases/RegisterUserUseCase';
import { AuthRequest } from '../../infrastructure/middleware/AuthMiddleware';

export class AuthRoutes {
  private router: Router;

  constructor(private authController: AuthController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/register', 
      RegisterUserUseCase.getValidationRules(),
      (req: Request, res: Response) => this.authController.register(req as AuthRequest, res)
    );
    this.router.post('/login', (req: Request, res: Response) => this.authController.login(req as AuthRequest, res));
  }

  public getRouter(): Router {
    return this.router;
  }
}
