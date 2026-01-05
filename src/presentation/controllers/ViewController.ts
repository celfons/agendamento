import { Request, Response } from 'express';
import path from 'path';

export class ViewController {
  async renderHome(_req: Request, res: Response): Promise<void> {
    res.sendFile(path.join(__dirname, '../views/index.html'));
  }

  async renderCreateEvent(_req: Request, res: Response): Promise<void> {
    res.sendFile(path.join(__dirname, '../views/create-event.html'));
  }

  async renderEventDetail(_req: Request, res: Response): Promise<void> {
    res.sendFile(path.join(__dirname, '../views/event-detail.html'));
  }

  async renderLogin(_req: Request, res: Response): Promise<void> {
    res.sendFile(path.join(__dirname, '../views/login.html'));
  }

  async renderRegisterEvent(_req: Request, res: Response): Promise<void> {
    res.sendFile(path.join(__dirname, '../views/register-event.html'));
  }

  async renderUsers(_req: Request, res: Response): Promise<void> {
    res.sendFile(path.join(__dirname, '../views/users.html'));
  }
}
