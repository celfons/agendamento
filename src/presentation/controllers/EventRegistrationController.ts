import { Request, Response } from 'express';
import { RegisterToEventUseCase } from '../../usecases/RegisterToEventUseCase';
import { RegisterGuestToEventUseCase } from '../../usecases/RegisterGuestToEventUseCase';
import { UnregisterFromEventUseCase } from '../../usecases/UnregisterFromEventUseCase';
import { ListEventRegistrationsUseCase } from '../../usecases/ListEventRegistrationsUseCase';
import { AuthRequest } from '../../infrastructure/middleware/AuthMiddleware';

export class EventRegistrationController {
  constructor(
    private registerToEventUseCase: RegisterToEventUseCase,
    private registerGuestToEventUseCase: RegisterGuestToEventUseCase,
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

  async registerGuest(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const { name, lastName, email, phone } = req.body;

      // Validate required fields
      if (!name || !lastName || !email || !phone) {
        res.status(400).json({ 
          error: 'All fields are required: name, lastName, email, phone' 
        });
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
      }

      // Basic phone validation (at least 10 digits)
      const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
      if (!phoneRegex.test(phone)) {
        res.status(400).json({ error: 'Invalid phone format' });
        return;
      }

      const registration = await this.registerGuestToEventUseCase.execute(
        eventId,
        { name, lastName, email, phone }
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
