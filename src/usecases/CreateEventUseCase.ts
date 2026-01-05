import { Event } from '../domain/entities/Event';
import { IEventRepository } from '../domain/interfaces/IEventRepository';

export class CreateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(eventData: Event): Promise<Event> {
    // Validate business rules
    if (eventData.maxParticipants <= 0) {
      throw new Error('Maximum participants must be greater than 0');
    }

    if (eventData.availableSlots > eventData.maxParticipants) {
      throw new Error('Available slots cannot exceed maximum participants');
    }

    if (new Date(eventData.date) < new Date()) {
      throw new Error('Event date must be in the future');
    }

    if (!eventData.name || eventData.name.trim() === '') {
      throw new Error('Event name is required');
    }

    if (!eventData.organizers || eventData.organizers.length === 0) {
      throw new Error('At least one organizer is required');
    }

    return this.eventRepository.create(eventData);
  }
}
