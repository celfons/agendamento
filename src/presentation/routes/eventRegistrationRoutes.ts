import { Router } from 'express';
import { EventRegistrationController } from '../controllers/EventRegistrationController';
import { AuthMiddleware } from '../../infrastructure/middleware/AuthMiddleware';

export class EventRegistrationRoutes {
  private router: Router;

  constructor(private eventRegistrationController: EventRegistrationController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Public route - Guest registration (no authentication required)
    this.router.post(
      '/public/events/:eventId',
      (req, res) => this.eventRegistrationController.registerGuest(req, res)
    );

    // All other registration routes require authentication
    this.router.use(AuthMiddleware.authenticate);

    // List user's registrations
    this.router.get(
      '/my-registrations',
      (req, res) => this.eventRegistrationController.listByUser(req, res)
    );

    // Register to an event (authenticated users)
    this.router.post(
      '/events/:eventId',
      (req, res) => this.eventRegistrationController.register(req, res)
    );

    // Unregister from an event
    this.router.delete(
      '/events/:eventId',
      (req, res) => this.eventRegistrationController.unregister(req, res)
    );

    // List registrations for an event
    this.router.get(
      '/events/:eventId',
      (req, res) => this.eventRegistrationController.listByEvent(req, res)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
