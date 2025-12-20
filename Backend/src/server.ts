import app from './app';
import { config } from './config';
import { connectDB } from './db';

async function startServer() {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} [${config.nodeEnv}]`);
  });
}

startServer();
