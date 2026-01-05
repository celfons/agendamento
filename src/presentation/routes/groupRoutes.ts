import { Router } from 'express';
import { GroupController } from '../controllers/GroupController';

export class GroupRoutes {
  private router: Router;

  constructor(private groupController: GroupController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', (req, res) => this.groupController.create(req, res));
    this.router.get('/', (req, res) => this.groupController.list(req, res));
    this.router.post('/:groupId/members', (req, res) => this.groupController.addMember(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }
}
