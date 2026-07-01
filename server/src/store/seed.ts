import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import type { AuthUser, Issue, Notification } from '../types.js';

const passwordHash = bcrypt.hashSync('Password123!', 10);

export const users: AuthUser[] = [
  {
    id: randomUUID(),
    name: 'Admin User',
    email: 'admin@school.edu',
    passwordHash,
    role: 'Admin',
    schoolId: 'SCH-1001'
  },
  {
    id: randomUUID(),
    name: 'Teacher One',
    email: 'teacher@school.edu',
    passwordHash,
    role: 'Teacher',
    schoolId: 'SCH-1001'
  },
  {
    id: randomUUID(),
    name: 'Parent One',
    email: 'parent@school.edu',
    passwordHash,
    role: 'Parent',
    schoolId: 'SCH-1001'
  }
];

export const issues: Issue[] = [
  {
    id: randomUUID(),
    title: 'Broken desk in Class 7A',
    description: 'One desk leg is detached and students cannot use it safely.',
    category: 'Furniture',
    location: 'Block B, Class 7A',
    priority: 'High',
    status: 'Pending',
    reporterName: 'Teacher One',
    assignedTo: 'Maintenance Team',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: randomUUID(),
    title: 'Water leakage in girls toilet',
    description: 'The washbasin pipe is leaking and the floor remains wet.',
    category: 'Sanitation',
    location: 'Ground floor, Girls toilet',
    priority: 'Critical',
    status: 'In Progress',
    reporterName: 'Parent One',
    assignedTo: 'Plumbing Contractor',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString()
  },
  {
    id: randomUUID(),
    title: 'Loose electrical switch board',
    description: 'Switch plate is damaged near the lab entrance.',
    category: 'Electrical',
    location: 'Science Lab entry',
    priority: 'Critical',
    status: 'Resolved',
    reporterName: 'Teacher One',
    assignedTo: 'Electrical Unit',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

export const notifications: Notification[] = [
  {
    id: randomUUID(),
    title: 'Repair assigned',
    message: 'Water leakage issue has been assigned to the plumbing contractor.',
    createdAt: new Date(Date.now() - 21600000).toISOString(),
    read: false
  },
  {
    id: randomUUID(),
    title: 'Issue resolved',
    message: 'Electrical switch board issue marked resolved after inspection.',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    read: true
  }
];
