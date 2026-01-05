import mongoose, { Schema, Document } from 'mongoose';
import { Client } from '../../domain/entities/Client';

export interface IClientDocument extends Omit<Client, 'id'>, Document {
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true }
  },
  {
    timestamps: true,
  }
);

// Ensure email and phone are unique
ClientSchema.index({ email: 1 }, { unique: true });
ClientSchema.index({ phone: 1 }, { unique: true });

export const ClientModel = mongoose.model<IClientDocument>('Client', ClientSchema);
