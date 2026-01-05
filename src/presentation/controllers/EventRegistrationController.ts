import { Request, Response } from 'express';
import { RegisterToEventUseCase } from '../../usecases/RegisterToEventUseCase';
import { UnregisterFromEventUseCase } from '../../usecases/UnregisterFromEventUseCase';

export class EventRegistrationController {
  constructor(
    private registerToEventUseCase: RegisterToEventUseCase,
    private unregisterFromEventUseCase: UnregisterFromEventUseCase
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const { name, phone } = req.body;

      // Validate required fields
      if (!name || !phone) {
        res.status(400).json({ 
          error: 'Name and phone are required' 
        });
        return;
      }

      // Basic phone validation (at least 10 digits with optional + and formatting characters)
      const cleanedPhone = phone.replace(/[\s\-()]/g, '');
      const phoneRegex = /^\+?[\d]{10,}$/;
      if (!phoneRegex.test(cleanedPhone)) {
        res.status(400).json({ error: 'Invalid phone format. Phone must contain at least 10 digits' });
        return;
      }

      const registration = await this.registerToEventUseCase.execute(
        eventId,
        name.trim(),
        cleanedPhone
      );
      
      res.status(201).json(registration);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async unregister(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const { phone } = req.body;

      if (!phone) {
        res.status(400).json({ error: 'Phone number is required' });
        return;
      }

      const cleanedPhone = phone.replace(/[\s\-()]/g, '');
      await this.unregisterFromEventUseCase.execute(eventId, cleanedPhone);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
