import { Event } from '../../domain/entities/Event';
import { IEventRepository } from '../../domain/interfaces/IEventRepository';
import { EventModel } from '../database/EventModel';

export class MongoEventRepository implements IEventRepository {
  async create(event: Event): Promise<Event> {
    const createdEvent = await EventModel.create(event);
    return this.mapToEntity(createdEvent);
  }

  async findAll(): Promise<Event[]> {
    const events = await EventModel.find().sort({ date: 1 });
    return events.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Event | null> {
    const event = await EventModel.findById(id);
    return event ? this.mapToEntity(event) : null;
  }

  async update(id: string, eventData: Partial<Event>): Promise<Event | null> {
    const updatedEvent = await EventModel.findByIdAndUpdate(
      id,
      { $set: eventData },
      { new: true, runValidators: true }
    );
    return updatedEvent ? this.mapToEntity(updatedEvent) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await EventModel.findByIdAndDelete(id);
    return result !== null;
  }

  private mapToEntity(doc: any): Event {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      date: doc.date,
      location: doc.location,
      maxParticipants: doc.maxParticipants,
      availableSlots: doc.availableSlots,
      organizers: doc.organizers,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
