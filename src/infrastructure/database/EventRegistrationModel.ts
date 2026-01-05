import mongoose, { Schema, Document } from 'mongoose';
import { EventRegistration, RegistrationStatus } from '../../domain/entities/EventRegistration';

export interface IEventRegistrationDocument extends Omit<EventRegistration, 'id' | 'registeredAt'>, Document {
  createdAt: Date;
  updatedAt: Date;
}

const EventRegistrationSchema: Schema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: false },
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

// Ensure a user or client can only register once per event
EventRegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true, sparse: true });
EventRegistrationSchema.index({ eventId: 1, clientId: 1 }, { unique: true, sparse: true });

// Validation: Either userId or clientId must be present, but not both
EventRegistrationSchema.pre('validate', function() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = this as any;
  if (!doc.userId && !doc.clientId) {
    throw new Error('Either userId or clientId must be provided');
  } else if (doc.userId && doc.clientId) {
    throw new Error('Cannot have both userId and clientId');
  }
});

export const EventRegistrationModel = mongoose.model<IEventRegistrationDocument>(
  'EventRegistration', 
  EventRegistrationSchema
);
