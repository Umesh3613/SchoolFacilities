import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { config } from '../config/env.js';
import { createUser, findUserByEmail } from '../store/memory.js';

const authRouter = Router();

const payloadSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['Parent', 'Teacher', 'Admin']).optional(),
  schoolId: z.string().min(3).optional()
});

function signToken(user: { email: string; role: string; name: string; id: string; schoolId: string }) {
  return jwt.sign({ email: user.email, role: user.role, name: user.name, id: user.id, schoolId: user.schoolId }, config.jwtSecret, {
    expiresIn: '8h'
  });
}

authRouter.post('/register', async (request, response) => {
  const parsed = payloadSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ message: 'Invalid registration data' });
  }

  if (await findUserByEmail(parsed.data.email)) {
    return response.status(409).json({ message: 'Email already registered' });
  }

  const user = await createUser({
    name: parsed.data.name ?? 'School User',
    email: parsed.data.email,
    password: parsed.data.password,
    role: parsed.data.role ?? 'Parent',
    schoolId: parsed.data.schoolId ?? 'SCH-1001'
  });

  return response.json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role, schoolId: user.schoolId } });
});

authRouter.post('/login', async (request, response) => {
  const parsed = payloadSchema.pick({ email: true, password: true }).safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ message: 'Invalid login data' });
  }

  const user = await findUserByEmail(parsed.data.email);
  if (!user || !bcrypt.compareSync(parsed.data.password, user.passwordHash)) {
    return response.status(401).json({ message: 'Invalid email or password' });
  }

  return response.json({
    token: signToken(user),
    user: { id: user.id, name: user.name, email: user.email, role: user.role, schoolId: user.schoolId }
  });
});

export default authRouter;
