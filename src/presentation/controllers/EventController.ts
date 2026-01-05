import { Request, Response } from 'express';
import { CreateEventUseCase } from '../../usecases/CreateEventUseCase';
import { ListEventsUseCase } from '../../usecases/ListEventsUseCase';
import { GetEventByIdUseCase } from '../../usecases/GetEventByIdUseCase';
import { UpdateEventUseCase } from '../../usecases/UpdateEventUseCase';
import { DeleteEventUseCase } from '../../usecases/DeleteEventUseCase';

export class EventController {
  constructor(
    private createEventUseCase: CreateEventUseCase,
    private listEventsUseCase: ListEventsUseCase,
    private getEventByIdUseCase: GetEventByIdUseCase,
    private updateEventUseCase: UpdateEventUseCase,
    private deleteEventUseCase: DeleteEventUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const event = await this.createEventUseCase.execute(req.body);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

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

  async update(req: Request, res: Response): Promise<void> {
    try {
      const event = await this.updateEventUseCase.execute(req.params.id, req.body);
      if (!event) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }
      res.status(200).json(event);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const success = await this.deleteEventUseCase.execute(req.params.id);
      if (!success) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
