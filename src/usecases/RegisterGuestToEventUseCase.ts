import { EventRegistration, RegistrationStatus } from '../domain/entities/EventRegistration';
import { IEventRegistrationRepository } from '../domain/interfaces/IEventRegistrationRepository';
import { IEventRepository } from '../domain/interfaces/IEventRepository';
import { IClientRepository } from '../domain/interfaces/IClientRepository';

export interface GuestRegistrationData {
  name: string;
  lastName: string;
  email: string;
  phone: string;
}

export class RegisterGuestToEventUseCase {
  constructor(
    private eventRegistrationRepository: IEventRegistrationRepository,
    private eventRepository: IEventRepository,
    private clientRepository: IClientRepository
  ) {}

  async execute(eventId: string, guestData: GuestRegistrationData): Promise<EventRegistration> {
    // Check if event exists
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Check if event is public
    if (!event.isPublic) {
      throw new Error('This event is not open for public registration');
    }

    // Check if event has available slots
    if (event.availableSlots <= 0) {
      throw new Error('No available slots for this event');
    }

    // Check if client already exists with the same email or phone
    let client = await this.clientRepository.findByEmailOrPhone(guestData.email, guestData.phone);
    
    if (client) {
      // Check if this client is already registered for this event
      const existingRegistration = await this.eventRegistrationRepository.findByEventAndClient(
        eventId,
        client.id!
      );
      
      if (existingRegistration) {
        throw new Error('A client with this email or phone is already registered for this event');
      }
    } else {
      // Create new client
      client = await this.clientRepository.create({
        name: guestData.name,
        lastName: guestData.lastName,
        email: guestData.email,
        phone: guestData.phone,
      });
    }

    // Create registration
    const registration = await this.eventRegistrationRepository.create({
      eventId,
      clientId: client.id,
      status: RegistrationStatus.CONFIRMED,
    });

    // Update available slots
    await this.eventRepository.update(eventId, {
      availableSlots: event.availableSlots - 1,
    });

    return registration;
  }
}
