import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import { EventRoutes } from '../presentation/routes/eventRoutes';
import { EventRegistrationRoutes } from '../presentation/routes/eventRegistrationRoutes';
import { ViewRoutes } from '../presentation/routes/viewRoutes';
import { Container } from '../config/container';

export class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Serve static files
    this.app.use(express.static(path.join(__dirname, '../presentation/views')));
  }

  private setupRoutes(): void {
    // Event Registration Routes - /api/registrations/:eventId
    const eventRegistrationController = Container.getEventRegistrationController();
    const eventRegistrationRoutes = new EventRegistrationRoutes(eventRegistrationController);
    this.app.use('/api/registrations', eventRegistrationRoutes.getRouter());

    // Event Routes - /api/events
    const eventController = Container.getEventController();
    const eventRoutes = new EventRoutes(eventController);
    this.app.use('/api/events', eventRoutes.getRouter());

    // View Routes - / (homepage and activity details)
    const viewController = Container.getViewController();
    const viewRoutes = new ViewRoutes(viewController);
    this.app.use('/', viewRoutes.getRouter());

    // 404 Handler
    this.app.use((_req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });
  }

  public getApp(): Application {
    return this.app;
  }
}
