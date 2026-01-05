import mongoose, { Schema, Document } from 'mongoose';
import { User, UserRole } from '../../domain/entities/User';
import bcrypt from 'bcryptjs';

export interface IUserDocument extends Omit<User, 'id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: Object.values(UserRole), 
      default: UserRole.USER,
      required: true 
    },
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }]
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre<IUserDocument>('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
