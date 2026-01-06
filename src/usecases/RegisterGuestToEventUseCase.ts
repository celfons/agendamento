import { EventRegistration } from '../domain/entities/EventRegistration';
import { IEventRegistrationRepository } from '../domain/interfaces/IEventRegistrationRepository';
import { IEventRepository } from '../domain/interfaces/IEventRepository';

export interface GuestRegistrationData {
  name: string;
  phone: string;
}

export class RegisterGuestToEventUseCase {
  constructor(
    private eventRegistrationRepository: IEventRegistrationRepository,
    private eventRepository: IEventRepository
  ) {}

  async execute(eventId: string, guestData: GuestRegistrationData): Promise<EventRegistration> {
    // Check if event exists
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Check if person is already registered (by phone)
    const existingRegistration = await this.eventRegistrationRepository.findByEventAndPhone(
      eventId,
      guestData.phone
    );
    if (existingRegistration) {
      throw new Error('This phone number is already registered for this event');
    }

    // Check if event has available slots
    if (event.availableSlots <= 0) {
      throw new Error('No available slots for this event');
    }

    // Create registration
    const registration = await this.eventRegistrationRepository.create({
      eventId,
      name: guestData.name,
      phone: guestData.phone
    });

    // Update available slots
    await this.eventRepository.update(eventId, {
      availableSlots: event.availableSlots - 1,
    });

    return registration;
  }
}
