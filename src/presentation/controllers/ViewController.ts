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
}
