import { Request, Response } from 'express';
import { ListEventsUseCase } from '../../usecases/ListEventsUseCase';
import { GetEventByIdUseCase } from '../../usecases/GetEventByIdUseCase';

export class EventController {
  constructor(
    private listEventsUseCase: ListEventsUseCase,
    private getEventByIdUseCase: GetEventByIdUseCase
  ) {}

  async list(_req: Request, res: Response): Promise<void> {
    try {
      const events = await this.listEventsUseCase.execute();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const event = await this.getEventByIdUseCase.execute(req.params.id);
      if (!event) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }
      res.status(200).json(event);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
