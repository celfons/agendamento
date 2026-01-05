import { Event } from '../domain/entities/Event';
import { IEventRepository } from '../domain/interfaces/IEventRepository';
import { EventValidator } from './EventValidator';

export class UpdateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: string, eventData: Partial<Event>): Promise<Event | null> {
    if (!id || id.trim() === '') {
      throw new Error('Event ID is required');
    }

    EventValidator.validateUpdateEvent(eventData);
    return this.eventRepository.update(id, eventData);
  }
}
