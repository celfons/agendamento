import { EventRegistration } from '../entities/EventRegistration';

export interface IEventRegistrationRepository {
  create(registration: EventRegistration): Promise<EventRegistration>;
  findById(id: string): Promise<EventRegistration | null>;
  findByEventId(eventId: string): Promise<EventRegistration[]>;
  findByEventAndPhone(eventId: string, phone: string): Promise<EventRegistration | null>;
  deleteByEventAndPhone(eventId: string, phone: string): Promise<boolean>;
  countByEventId(eventId: string): Promise<number>;
}
