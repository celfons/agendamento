import { EventRegistration } from '../entities/EventRegistration';

export interface IEventRegistrationRepository {
  create(registration: EventRegistration): Promise<EventRegistration>;
  findById(id: string): Promise<EventRegistration | null>;
  findByEventId(eventId: string): Promise<EventRegistration[]>;
  findByUserId(userId: string): Promise<EventRegistration[]>;
  findByClientId(clientId: string): Promise<EventRegistration[]>;
  findByEventAndUser(eventId: string, userId: string): Promise<EventRegistration | null>;
  findByEventAndClient(eventId: string, clientId: string): Promise<EventRegistration | null>;
  update(id: string, registration: Partial<EventRegistration>): Promise<EventRegistration | null>;
  delete(id: string): Promise<boolean>;
  countByEventId(eventId: string): Promise<number>;
}
