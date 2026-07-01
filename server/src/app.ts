import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import adminRouter from './routes/admin.js';
import authRouter from './routes/auth.js';
import issueRouter from './routes/issues.js';
import notificationRouter from './routes/notifications.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_request, response) => response.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/issues', issueRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/admin', adminRouter);

app.use((_request, response) => response.status(404).json({ message: 'Not found' }));

export default app;
