import mongoose, { Schema, Document } from 'mongoose';
import { EventRegistration } from '../../domain/entities/EventRegistration';

export interface IEventRegistrationDocument extends Omit<EventRegistration, 'id' | 'registeredAt'>, Document {
  createdAt: Date;
}

const EventRegistrationSchema: Schema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

// Ensure a person can only register once per event (by phone)
EventRegistrationSchema.index({ eventId: 1, phone: 1 }, { unique: true });

export const EventRegistrationModel = mongoose.model<IEventRegistrationDocument>(
  'EventRegistration', 
  EventRegistrationSchema
);
