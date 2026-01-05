import { Router } from 'express';
import { ViewController } from '../controllers/ViewController';

export class ViewRoutes {
  private router: Router;

  constructor(private viewController: ViewController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', (req, res) => this.viewController.renderHome(req, res));
    this.router.get('/create', (req, res) => this.viewController.renderCreateEvent(req, res));
    this.router.get('/event/:id', (req, res) => this.viewController.renderEventDetail(req, res));
    this.router.get('/login', (req, res) => this.viewController.renderLogin(req, res));
    this.router.get('/register-event', (req, res) => this.viewController.renderRegisterEvent(req, res));
    this.router.get('/users', (req, res) => this.viewController.renderUsers(req, res));
  }

  public getRouter(): Router {
    return this.router;
  }
}
