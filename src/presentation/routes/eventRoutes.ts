import { Router } from 'express';
import { EventController } from '../controllers/EventController';

export class EventRoutes {
  private router: Router;

  constructor(private eventController: EventController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', (req, res) => this.eventController.create(req, res));
    this.router.get('/', (req, res) => this.eventController.list(req, res));
    this.router.get('/:id', (req, res) => this.eventController.getById(req, res));
    this.router.put('/:id', (req, res) => this.eventController.update(req, res));
    this.router.delete('/:id', (req, res) => this.eventController.delete(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }
}
