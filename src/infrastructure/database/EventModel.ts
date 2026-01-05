import mongoose, { Schema, Document } from 'mongoose';
import { Event } from '../../domain/entities/Event';

export interface IEventDocument extends Omit<Event, 'id'>, Document {}

const EventSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    maxParticipants: { type: Number, required: true, min: 1 },
    availableSlots: { type: Number, required: true, min: 0 },
    organizers: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

export const EventModel = mongoose.model<IEventDocument>('Event', EventSchema);
