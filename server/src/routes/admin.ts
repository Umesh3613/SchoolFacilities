import { Router } from 'express';
import { authRequired, type AuthRequest } from '../middleware/auth.js';
import { listIssues } from '../store/memory.js';

const adminRouter = Router();

adminRouter.get('/overview', authRequired, async (request: AuthRequest, response) => {
  if (request.user?.role !== 'Admin') {
    return response.status(403).json({ message: 'Forbidden' });
  }

  const issues = await listIssues();
  return response.json({
    totalIssues: issues.length,
    resolvedCount: issues.filter((issue) => issue.status === 'Resolved').length,
    inProgressCount: issues.filter((issue) => issue.status === 'In Progress').length,
    pendingCount: issues.filter((issue) => issue.status === 'Pending').length
  });
});

export default adminRouter;
