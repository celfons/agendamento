import { EventRegistration } from '../../domain/entities/EventRegistration';
import { IEventRegistrationRepository } from '../../domain/interfaces/IEventRegistrationRepository';
import { EventRegistrationModel, IEventRegistrationDocument } from '../database/EventRegistrationModel';

export class MongoEventRegistrationRepository implements IEventRegistrationRepository {
  async create(registration: EventRegistration): Promise<EventRegistration> {
    const registrationDoc = await EventRegistrationModel.create(registration);
    return this.mapToEntity(registrationDoc);
  }

  async findById(id: string): Promise<EventRegistration | null> {
    const registrationDoc = await EventRegistrationModel.findById(id).exec();
    return registrationDoc ? this.mapToEntity(registrationDoc) : null;
  }

  async findByEventId(eventId: string): Promise<EventRegistration[]> {
    const registrationDocs = await EventRegistrationModel.find({ eventId }).exec();
    return registrationDocs.map(doc => this.mapToEntity(doc));
  }

  async findByEventAndPhone(eventId: string, phone: string): Promise<EventRegistration | null> {
    const registrationDoc = await EventRegistrationModel.findOne({ eventId, phone }).exec();
    return registrationDoc ? this.mapToEntity(registrationDoc) : null;
  }

  async deleteByEventAndPhone(eventId: string, phone: string): Promise<boolean> {
    const result = await EventRegistrationModel.findOneAndDelete({ eventId, phone }).exec();
    return result !== null;
  }

  async countByEventId(eventId: string): Promise<number> {
    return EventRegistrationModel.countDocuments({ eventId }).exec();
  }

  private mapToEntity(doc: IEventRegistrationDocument): EventRegistration {
    return {
      id: doc._id.toString(),
      eventId: doc.eventId.toString(),
      name: doc.name,
      phone: doc.phone,
      registeredAt: doc.createdAt
    };
  }
}
