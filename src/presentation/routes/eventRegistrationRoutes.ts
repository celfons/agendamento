import { Router } from 'express';
import { EventRegistrationController } from '../controllers/EventRegistrationController';

export class EventRegistrationRoutes {
  private router: Router;

  constructor(private eventRegistrationController: EventRegistrationController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/public/events/:eventId', (req, res) => this.eventRegistrationController.registerGuest(req, res));
    this.router.get('/my-registrations', (req, res) => this.eventRegistrationController.listByUser(req, res));
    this.router.post('/events/:eventId', (req, res) => this.eventRegistrationController.register(req, res));
    this.router.delete('/events/:eventId', (req, res) => this.eventRegistrationController.unregister(req, res));
    this.router.get('/events/:eventId', (req, res) => this.eventRegistrationController.listByEvent(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }
}
