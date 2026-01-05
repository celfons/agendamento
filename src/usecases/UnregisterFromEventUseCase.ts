import { IEventRegistrationRepository } from '../domain/interfaces/IEventRegistrationRepository';
import { IEventRepository } from '../domain/interfaces/IEventRepository';

export class UnregisterFromEventUseCase {
  constructor(
    private eventRegistrationRepository: IEventRegistrationRepository,
    private eventRepository: IEventRepository
  ) {}

  async execute(eventId: string, userId: string): Promise<void> {
    // Check if event exists
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Check if user is registered
    const registration = await this.eventRegistrationRepository.findByEventAndUser(
      eventId,
      userId
    );
    if (!registration) {
      throw new Error('User is not registered for this event');
    }

    // Ensure registration has an id
    if (!registration.id) {
      throw new Error('Invalid registration record');
    }

    // Delete registration
    await this.eventRegistrationRepository.delete(registration.id);

    // Update available slots
    await this.eventRepository.update(eventId, {
      availableSlots: event.availableSlots + 1,
    });
  }
}
