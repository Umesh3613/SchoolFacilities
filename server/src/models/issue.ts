import { randomUUID } from 'crypto';
import mongoose, { Schema } from 'mongoose';
import type { Issue, IssueStatus, Priority } from '../types.js';

export type IssueRecord = Issue;

const issueSchema = new Schema<IssueRecord>(
  {
    id: { type: String, required: true, unique: true, default: () => randomUUID() },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    priority: { type: String, required: true, enum: ['Low', 'Medium', 'High', 'Critical'] satisfies Priority[] },
    status: { type: String, required: true, enum: ['Pending', 'In Progress', 'Resolved'] satisfies IssueStatus[] },
    reporterName: { type: String, required: true, trim: true },
    assignedTo: { type: String, required: true, trim: true }
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

export const IssueModel = mongoose.models.Issue ?? mongoose.model<IssueRecord>('Issue', issueSchema);
