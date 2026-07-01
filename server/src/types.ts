export type Role = 'Parent' | 'Teacher' | 'Admin';
export type IssueStatus = 'Pending' | 'In Progress' | 'Resolved';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  schoolId: string;
};

export type Issue = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: Priority;
  status: IssueStatus;
  reporterName: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};
