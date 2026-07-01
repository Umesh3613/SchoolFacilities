import { randomUUID } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { IssueModel } from '../models/issue.js';
import { NotificationModel } from '../models/notification.js';
import { UserModel } from '../models/user.js';
import { issues, notifications, users } from './seed.js';
import type { AuthUser, Issue, Notification, Role, IssueStatus, Priority } from '../types.js';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const userDataPath = path.resolve(process.cwd(), 'data', 'users.json');
let usersLoaded = false;

function hasMongoConnection() {
  return mongoose.connection.readyState === 1;
}

function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<AuthUser>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.passwordHash === 'string' &&
    typeof candidate.role === 'string' &&
    ['Parent', 'Teacher', 'Admin'].includes(candidate.role) &&
    typeof candidate.schoolId === 'string'
  );
}

async function loadPersistedUsers() {
  if (usersLoaded) {
    return;
  }

  usersLoaded = true;

  try {
    const rawUsers = await readFile(userDataPath, 'utf8');
    const parsedUsers = JSON.parse(rawUsers) as unknown;

    if (!Array.isArray(parsedUsers)) {
      return;
    }

    for (const user of parsedUsers) {
      if (isAuthUser(user) && !users.some((existingUser) => existingUser.email.toLowerCase() === user.email.toLowerCase())) {
        users.push(user);
      }
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.warn('Unable to load local users. New registrations will still work for this server session.');
    }
  }
}

async function savePersistedUsers() {
  await mkdir(path.dirname(userDataPath), { recursive: true });
  await writeFile(userDataPath, JSON.stringify(users, null, 2), 'utf8');
}

function isOlderThanOneDay(value: string) {
  return new Date(value).getTime() <= Date.now() - ONE_DAY_MS;
}

async function deleteExpiredNotifications() {
  const cutoff = new Date(Date.now() - ONE_DAY_MS).toISOString();

  if (hasMongoConnection()) {
    await NotificationModel.deleteMany({ createdAt: { $lte: cutoff } }).exec();
    return;
  }

  for (let index = notifications.length - 1; index >= 0; index -= 1) {
    if (isOlderThanOneDay(notifications[index].createdAt)) {
      notifications.splice(index, 1);
    }
  }
}

async function deleteResolvedIssuesOlderThanOneDay() {
  const cutoff = new Date(Date.now() - ONE_DAY_MS);

  if (hasMongoConnection()) {
    await IssueModel.deleteMany({ status: 'Resolved', updatedAt: { $lte: cutoff } }).exec();
    return;
  }

  for (let index = issues.length - 1; index >= 0; index -= 1) {
    const issue = issues[index];

    if (issue.status === 'Resolved' && isOlderThanOneDay(issue.updatedAt)) {
      issues.splice(index, 1);
    }
  }
}

export async function findUserByEmail(email: string): Promise<AuthUser | null> {
  if (hasMongoConnection()) {
    return UserModel.findOne({ email: email.toLowerCase() }).lean<AuthUser>().exec() as Promise<AuthUser | null>;
  }

  await loadPersistedUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function createUser(payload: { name: string; email: string; password: string; role: Role; schoolId: string }): Promise<AuthUser> {
  if (!hasMongoConnection()) {
    await loadPersistedUsers();
  }

  const user: AuthUser = {
    id: randomUUID(),
    name: payload.name,
    email: payload.email,
    passwordHash: bcrypt.hashSync(payload.password, 10),
    role: payload.role,
    schoolId: payload.schoolId
  };

  if (hasMongoConnection()) {
    const createdUser = await UserModel.create(user);
    return createdUser.toJSON() as AuthUser;
  }

  users.push(user);
  await savePersistedUsers();
  return user;
}

export async function listIssues(): Promise<Issue[]> {
  await deleteResolvedIssuesOlderThanOneDay();

  if (hasMongoConnection()) {
    return IssueModel.find().sort({ updatedAt: -1 }).lean<Issue>().exec() as unknown as Promise<Issue[]>;
  }

  return issues.slice().sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function findIssueById(id: string): Promise<Issue | null> {
  if (hasMongoConnection()) {
    return IssueModel.findOne({ id }).lean<Issue>().exec() as Promise<Issue | null>;
  }

  return issues.find((issue) => issue.id === id) ?? null;
}

export async function createIssue(payload: Partial<Issue> & { reporterName: string; assignedTo?: string }): Promise<Issue> {
  const now = new Date().toISOString();
  const issue: Issue = {
    id: randomUUID(),
    title: payload.title ?? 'Untitled issue',
    description: payload.description ?? '',
    category: payload.category ?? 'General',
    location: payload.location ?? 'Unspecified',
    priority: (payload.priority ?? 'Medium') as Priority,
    status: (payload.status ?? 'Pending') as IssueStatus,
    reporterName: payload.reporterName,
    assignedTo: payload.assignedTo ?? 'Unassigned',
    createdAt: now,
    updatedAt: now
  };

  if (hasMongoConnection()) {
    await IssueModel.create(issue);
    await NotificationModel.create({
      id: randomUUID(),
      title: 'New issue reported',
      message: `${issue.title} was reported in ${issue.location}.`,
      createdAt: now,
      read: false
    });
  } else {
    issues.unshift(issue);
    notifications.unshift({
      id: randomUUID(),
      title: 'New issue reported',
      message: `${issue.title} was reported in ${issue.location}.`,
      createdAt: now,
      read: false
    });
  }

  return issue;
}

export async function updateIssue(id: string, payload: Partial<Issue>): Promise<Issue | undefined> {
  const issue = await findIssueById(id);
  if (!issue) return undefined;

  const updatedAt = new Date().toISOString();

  if (hasMongoConnection()) {
    const updatedIssue = await IssueModel.findOneAndUpdate(
      { id },
      { ...payload, updatedAt },
      { new: true }
    ).lean<Issue>().exec() as Issue | null;

    if (!updatedIssue) {
      return undefined;
    }

    await NotificationModel.create({
      id: randomUUID(),
      title: 'Issue updated',
      message: `${updatedIssue.title} is now ${updatedIssue.status}.`,
      createdAt: updatedAt,
      read: false
    });

    return updatedIssue;
  }

  Object.assign(issue, payload, { updatedAt });
  notifications.unshift({
    id: randomUUID(),
    title: 'Issue updated',
    message: `${issue.title} is now ${issue.status}.`,
    createdAt: issue.updatedAt,
    read: false
  });
  return issue;
}

export async function listNotifications(): Promise<Notification[]> {
  await deleteExpiredNotifications();

  if (hasMongoConnection()) {
    return NotificationModel.find().sort({ createdAt: -1 }).lean<Notification>().exec() as unknown as Promise<Notification[]>;
  }

  return notifications.slice().sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}
