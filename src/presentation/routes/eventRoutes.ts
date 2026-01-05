import { Router } from 'express';
import { EventController } from '../controllers/EventController';

export class EventRoutes {
  private router: Router;

  constructor(private eventController: EventController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', (req, res) => this.eventController.list(req, res));
    this.router.get('/:id', (req, res) => this.eventController.getById(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }
}

