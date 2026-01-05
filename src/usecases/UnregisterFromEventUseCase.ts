import { IEventRegistrationRepository } from '../domain/interfaces/IEventRegistrationRepository';
import { IEventRepository } from '../domain/interfaces/IEventRepository';

export class UnregisterFromEventUseCase {
  constructor(
    private eventRegistrationRepository: IEventRegistrationRepository,
    private eventRepository: IEventRepository
  ) {}

  async execute(eventId: string, phone: string): Promise<void> {
    // Check if event exists
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Check if person is registered
    const registration = await this.eventRegistrationRepository.findByEventAndPhone(
      eventId,
      phone
    );
    if (!registration) {
      throw new Error('This phone number is not registered for this event');
    }

    // Delete registration
    const deleted = await this.eventRegistrationRepository.deleteByEventAndPhone(eventId, phone);
    if (!deleted) {
      throw new Error('Failed to unregister from event');
    }

    // Update available slots
    await this.eventRepository.update(eventId, {
      availableSlots: event.availableSlots + 1,
    });
  }
}
