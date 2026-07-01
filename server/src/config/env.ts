import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? 'school-facilities-dev-secret',
  mongoUri: process.env.MONGO_URI ?? ''
};
