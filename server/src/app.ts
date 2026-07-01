import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import adminRouter from './routes/admin.js';
import authRouter from './routes/auth.js';
import issueRouter from './routes/issues.js';
import notificationRouter from './routes/notifications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

function resolveClientDistPath() {
  const candidates = [
    path.resolve(process.cwd(), 'client/dist'),
    path.resolve(process.cwd(), '../client/dist'),
    path.resolve(process.cwd(), '../../client/dist'),
    path.resolve(__dirname, '../../client/dist'),
    path.resolve(__dirname, '../client/dist')
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

const clientDistPath = resolveClientDistPath();
const clientIndexPath = clientDistPath ? path.join(clientDistPath, 'index.html') : null;

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_request, response) => response.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/issues', issueRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/admin', adminRouter);

if (clientDistPath && clientIndexPath && fs.existsSync(clientIndexPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (_request, response) => {
    response.sendFile(clientIndexPath);
  });
} else {
  app.use((_request, response) => response.status(404).json({ message: 'Not found' }));
}

export default app;
