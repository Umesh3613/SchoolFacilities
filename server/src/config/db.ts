import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDatabase() {
  if (!config.mongoUri) {
    return false;
  }

  await mongoose.connect(config.mongoUri);
  return true;
}
