import app from './app.js';
import { config } from './config/env.js';
import { connectDatabase } from './config/db.js';

async function bootstrap() {
  try {
    await connectDatabase();
  } catch {
    console.warn('MongoDB connection skipped. Set MONGO_URI to enable persistence.');
  }

  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
}

bootstrap();
