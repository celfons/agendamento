import { Event } from '../domain/entities/Event';
import { IEventRepository } from '../domain/interfaces/IEventRepository';

export class UpdateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: string, eventData: Partial<Event>): Promise<Event | null> {
    if (!id || id.trim() === '') {
      throw new Error('Event ID is required');
    }

    // Validate business rules if date is being updated
    if (eventData.date && new Date(eventData.date) < new Date()) {
      throw new Error('Event date must be in the future');
    }

    // Validate participants and slots consistency
    if (eventData.maxParticipants !== undefined && eventData.maxParticipants <= 0) {
      throw new Error('Maximum participants must be greater than 0');
    }

    if (
      eventData.availableSlots !== undefined &&
      eventData.maxParticipants !== undefined &&
      eventData.availableSlots > eventData.maxParticipants
    ) {
      throw new Error('Available slots cannot exceed maximum participants');
    }

    return this.eventRepository.update(id, eventData);
  }
}
