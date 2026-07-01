import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { listNotifications } from '../store/memory.js';

const notificationRouter = Router();

notificationRouter.get('/', authRequired, async (_request, response) => {
  return response.json(await listNotifications());
});

export default notificationRouter;
