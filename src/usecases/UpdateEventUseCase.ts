import { Event } from '../domain/entities/Event';
import { IEventRepository } from '../domain/interfaces/IEventRepository';
import { EventValidator } from './EventValidator';

export class UpdateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: string, eventData: Partial<Event>): Promise<Event | null> {
    if (!id || id.trim() === '') {
      throw new Error('Event ID is required');
    }

    // Get existing event to validate against current values
    const existingEvent = await this.eventRepository.findById(id);
    if (!existingEvent) {
      return null;
    }

    // Validate update with context of existing event
    EventValidator.validateUpdateEvent(eventData);

    // Additional validation when only availableSlots is being updated
    if (
      eventData.availableSlots !== undefined &&
      eventData.maxParticipants === undefined
    ) {
      EventValidator.validateAvailableSlots(
        eventData.availableSlots,
        existingEvent.maxParticipants
      );
    }

    return this.eventRepository.update(id, eventData);
  }
}
