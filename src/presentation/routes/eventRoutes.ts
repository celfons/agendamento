import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { AuthMiddleware } from '../../infrastructure/middleware/AuthMiddleware';
import { UserRole } from '../../domain/entities/User';

export class EventRoutes {
  private router: Router;

  constructor(private eventController: EventController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Public routes - anyone can view events
    this.router.get('/', (req, res) => this.eventController.list(req, res));
    this.router.get('/:id', (req, res) => this.eventController.getById(req, res));

    // Protected routes - require authentication and appropriate role
    this.router.post(
      '/',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(UserRole.ADMIN, UserRole.ORGANIZER),
      (req, res) => this.eventController.create(req, res)
    );
    
    this.router.put(
      '/:id',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(UserRole.ADMIN, UserRole.ORGANIZER),
      (req, res) => this.eventController.update(req, res)
    );
    
    this.router.delete(
      '/:id',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(UserRole.ADMIN, UserRole.ORGANIZER),
      (req, res) => this.eventController.delete(req, res)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

