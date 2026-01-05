import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import { EventRoutes } from '../presentation/routes/eventRoutes';
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
    // API Routes
    const eventController = Container.getEventController();
    const eventRoutes = new EventRoutes(eventController);
    this.app.use('/api/events', eventRoutes.getRouter());

    // View Routes
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
