import { Router } from 'express';
import { z } from 'zod';
import { authRequired, type AuthRequest } from '../middleware/auth.js';
import { createIssue, listIssues, updateIssue } from '../store/memory.js';

const issueRouter = Router();

const issueSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(3),
  location: z.string().min(3),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).default('Medium'),
  status: z.enum(['Pending', 'In Progress', 'Resolved']).optional(),
  assignedTo: z.string().optional()
});

issueRouter.get('/', authRequired, async (_request, response) => {
  return response.json(await listIssues());
});

issueRouter.post('/', authRequired, async (request: AuthRequest, response) => {
  const parsed = issueSchema.safeParse(request.body);
  if (!parsed.success || !request.user) {
    return response.status(400).json({ message: 'Invalid issue data' });
  }

  const issue = await createIssue({
    ...parsed.data,
    reporterName: request.user.name,
    assignedTo: parsed.data.assignedTo ?? 'Unassigned'
  });

  return response.status(201).json(issue);
});

issueRouter.patch('/:id', authRequired, async (request, response) => {
  const parsed = issueSchema.partial().safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ message: 'Invalid issue update' });
  }

  const issue = await updateIssue(String(request.params.id), parsed.data);
  if (!issue) {
    return response.status(404).json({ message: 'Issue not found' });
  }

  return response.json(issue);
});

export default issueRouter;
