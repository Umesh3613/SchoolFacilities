import { randomUUID } from 'crypto';
import mongoose, { Schema } from 'mongoose';
import type { AuthUser, Role } from '../types.js';

export type UserRecord = AuthUser;

const userSchema = new Schema<UserRecord>(
  {
    id: { type: String, required: true, unique: true, default: () => randomUUID() },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ['Parent', 'Teacher', 'Admin'] satisfies Role[] },
    schoolId: { type: String, required: true, trim: true }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_document, returnedObject) {
        delete (returnedObject as { _id?: unknown })._id;
        return returnedObject;
      }
    }
  }
);

export const UserModel = mongoose.models.User ?? mongoose.model<UserRecord>('User', userSchema);
