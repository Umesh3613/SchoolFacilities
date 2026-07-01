const resolvedApiBaseUrl = (import.meta.env.VITE_API_URL ?? '').trim();

export const API_BASE_URL = resolvedApiBaseUrl || (typeof window !== 'undefined' ? `${window.location.origin}/api` : '/api');

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'Parent' | 'Teacher' | 'Admin';
  schoolId: string;
};

export type Issue = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Resolved';
  reporterName: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateIssuePayload = Pick<Issue, 'title' | 'description' | 'category' | 'location' | 'priority'>;
export type UpdateIssuePayload = Partial<Pick<Issue, 'title' | 'description' | 'category' | 'location' | 'priority' | 'status' | 'assignedTo'>>;

export type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('sfp_token');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message ?? 'Request failed');
  }

  return response.json() as Promise<T>;
}

export const api = {
  login: (payload: { email: string; password: string }) => request<{ token: string; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  register: (payload: { name: string; email: string; password: string; role: AuthUser['role']; schoolId: string }) =>
    request<{ token: string; user: AuthUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  getIssues: () => request<Issue[]>('/issues'),
  createIssue: (payload: CreateIssuePayload) => request<Issue>('/issues', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateIssue: (id: string, payload: UpdateIssuePayload) => request<Issue>(`/issues/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  getNotifications: () => request<Notification[]>('/notifications'),
  getAdminOverview: () => request<{ totalIssues: number; resolvedCount: number; inProgressCount: number; pendingCount: number }>(
    '/admin/overview'
  )
};
