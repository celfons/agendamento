import { Router } from 'express';
import { GroupController } from '../controllers/GroupController';
import { AuthMiddleware } from '../../infrastructure/middleware/AuthMiddleware';
import { UserRole } from '../../domain/entities/User';

export class GroupRoutes {
  private router: Router;

  constructor(private groupController: GroupController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // All group routes require authentication
    this.router.use(AuthMiddleware.authenticate);

    this.router.post(
      '/',
      AuthMiddleware.authorize(UserRole.ADMIN, UserRole.ORGANIZER),
      (req, res) => this.groupController.create(req, res)
    );
    
    this.router.get('/', (req, res) => this.groupController.list(req, res));
    
    this.router.post(
      '/:groupId/members',
      (req, res) => this.groupController.addMember(req, res)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
