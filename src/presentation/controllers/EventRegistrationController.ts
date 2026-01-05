import { Response } from 'express';
import { RegisterToEventUseCase } from '../../usecases/RegisterToEventUseCase';
import { UnregisterFromEventUseCase } from '../../usecases/UnregisterFromEventUseCase';
import { ListEventRegistrationsUseCase } from '../../usecases/ListEventRegistrationsUseCase';
import { AuthRequest } from '../../infrastructure/middleware/AuthMiddleware';

export class EventRegistrationController {
  constructor(
    private registerToEventUseCase: RegisterToEventUseCase,
    private unregisterFromEventUseCase: UnregisterFromEventUseCase,
    private listEventRegistrationsUseCase: ListEventRegistrationsUseCase
  ) {}

  async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { eventId } = req.params;
      const registration = await this.registerToEventUseCase.execute(
        eventId,
        req.user.userId
      );
      res.status(201).json(registration);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async unregister(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { eventId } = req.params;
      await this.unregisterFromEventUseCase.execute(eventId, req.user.userId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async listByEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const registrations = await this.listEventRegistrationsUseCase.executeByEvent(eventId);
      res.status(200).json(registrations);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async listByUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const registrations = await this.listEventRegistrationsUseCase.executeByUser(
        req.user.userId
      );
      res.status(200).json(registrations);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
