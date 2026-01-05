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

  async findByUserId(userId: string): Promise<EventRegistration[]> {
    const registrationDocs = await EventRegistrationModel.find({ userId }).exec();
    return registrationDocs.map(doc => this.mapToEntity(doc));
  }

  async findByEventAndUser(eventId: string, userId: string): Promise<EventRegistration | null> {
    const registrationDoc = await EventRegistrationModel.findOne({ eventId, userId }).exec();
    return registrationDoc ? this.mapToEntity(registrationDoc) : null;
  }

  async update(id: string, registration: Partial<EventRegistration>): Promise<EventRegistration | null> {
    const registrationDoc = await EventRegistrationModel.findByIdAndUpdate(
      id, 
      registration, 
      { new: true }
    ).exec();
    return registrationDoc ? this.mapToEntity(registrationDoc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await EventRegistrationModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async countByEventId(eventId: string): Promise<number> {
    return EventRegistrationModel.countDocuments({ eventId }).exec();
  }

  private mapToEntity(doc: IEventRegistrationDocument): EventRegistration {
    return {
      id: doc._id.toString(),
      eventId: doc.eventId.toString(),
      userId: doc.userId.toString(),
      status: doc.status,
      registeredAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}
