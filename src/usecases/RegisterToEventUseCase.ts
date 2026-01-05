import { EventRegistration, RegistrationStatus } from '../domain/entities/EventRegistration';
import { IEventRegistrationRepository } from '../domain/interfaces/IEventRegistrationRepository';
import { IEventRepository } from '../domain/interfaces/IEventRepository';
import { IUserRepository } from '../domain/interfaces/IUserRepository';

export class RegisterToEventUseCase {
  constructor(
    private eventRegistrationRepository: IEventRegistrationRepository,
    private eventRepository: IEventRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(eventId: string, userId: string): Promise<EventRegistration> {
    // Check if event exists
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Check if event is public
    if (!event.isPublic) {
      throw new Error('This event is not open for public registration');
    }

    // Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is already registered
    const existingRegistration = await this.eventRegistrationRepository.findByEventAndUser(
      eventId,
      userId
    );
    if (existingRegistration) {
      throw new Error('User is already registered for this event');
    }

    // Check if event has available slots
    if (event.availableSlots <= 0) {
      throw new Error('No available slots for this event');
    }

    // Create registration
    const registration = await this.eventRegistrationRepository.create({
      eventId,
      userId,
      status: RegistrationStatus.CONFIRMED,
    });

    // Update available slots
    await this.eventRepository.update(eventId, {
      availableSlots: event.availableSlots - 1,
    });

    return registration;
  }
}
