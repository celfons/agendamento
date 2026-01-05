import { Router } from 'express';
import { EventRegistrationController } from '../controllers/EventRegistrationController';

export class EventRegistrationRoutes {
  private router: Router;

  constructor(private eventRegistrationController: EventRegistrationController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/:eventId', (req, res) => this.eventRegistrationController.register(req, res));
    this.router.delete('/:eventId', (req, res) => this.eventRegistrationController.unregister(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }
}
