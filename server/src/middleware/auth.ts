import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { findUserByEmail } from '../store/memory.js';

export type AuthRequest = Request & {
  user?: {
    id: string;
    email: string;
    role: string;
    schoolId: string;
    name: string;
  };
};

export async function authRequired(request: AuthRequest, response: Response, next: NextFunction) {
  const header = request.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = header.slice(7);
    const decoded = jwt.verify(token, config.jwtSecret) as { email: string };
    const user = await findUserByEmail(decoded.email);
    if (!user) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    request.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      name: user.name
    };
    return next();
  } catch {
    return response.status(401).json({ message: 'Unauthorized' });
  }
}
