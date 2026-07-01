import { randomUUID } from 'crypto';
import mongoose, { Schema } from 'mongoose';
import type { Notification } from '../types.js';

export type NotificationRecord = Notification;

const notificationSchema = new Schema<NotificationRecord>(
  {
    id: { type: String, required: true, unique: true, default: () => randomUUID() },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    createdAt: { type: String, required: true },
    read: { type: Boolean, required: true, default: false }
  },
  {
    versionKey: false,
    toJSON: {
      transform(_document, returnedObject) {
        delete (returnedObject as { _id?: unknown })._id;
        return returnedObject;
      }
    }
  }
);

export const NotificationModel = mongoose.models.Notification ?? mongoose.model<NotificationRecord>('Notification', notificationSchema);
