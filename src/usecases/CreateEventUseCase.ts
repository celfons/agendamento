import { Event } from '../domain/entities/Event';
import { IEventRepository } from '../domain/interfaces/IEventRepository';
import { EventValidator } from './EventValidator';

export class CreateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(eventData: Event): Promise<Event> {
    EventValidator.validateCreateEvent(eventData);
    return this.eventRepository.create(eventData);
  }
}
