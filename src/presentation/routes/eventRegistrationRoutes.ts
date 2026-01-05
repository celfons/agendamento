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
    // All registration routes require authentication
    this.router.use(AuthMiddleware.authenticate);

    // Register to an event
    this.router.post(
      '/:eventId/register',
      (req, res) => this.eventRegistrationController.register(req, res)
    );

    // Unregister from an event
    this.router.delete(
      '/:eventId/register',
      (req, res) => this.eventRegistrationController.unregister(req, res)
    );

    // List registrations for an event
    this.router.get(
      '/:eventId/registrations',
      (req, res) => this.eventRegistrationController.listByEvent(req, res)
    );

    // List user's registrations
    this.router.get(
      '/my-registrations',
      (req, res) => this.eventRegistrationController.listByUser(req, res)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
