import mongoose, { Schema, Document } from 'mongoose';
import { EventRegistration, RegistrationStatus } from '../../domain/entities/EventRegistration';

export interface IEventRegistrationDocument extends Omit<EventRegistration, 'id'>, Document {}

const EventRegistrationSchema: Schema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: Object.values(RegistrationStatus),
      default: RegistrationStatus.CONFIRMED,
      required: true 
    }
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only register once per event
EventRegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export const EventRegistrationModel = mongoose.model<IEventRegistrationDocument>(
  'EventRegistration', 
  EventRegistrationSchema
);
