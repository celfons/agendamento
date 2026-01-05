import mongoose, { Schema, Document } from 'mongoose';
import { Group } from '../../domain/entities/Group';

export interface IGroupDocument extends Omit<Group, 'id'>, Document {}

const GroupSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: true,
  }
);

export const GroupModel = mongoose.model<IGroupDocument>('Group', GroupSchema);
