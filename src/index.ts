import { App } from './config/app';
import { Database } from './infrastructure/database/Database';
import { config } from './config/config';

async function bootstrap() {
  try {
    // Connect to database
    const database = Database.getInstance();
    await database.connect(config.mongoUri);

    // Create and start server
    const application = new App();
    const app = application.getApp();

    app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`🌐 Access the application at: http://localhost:${config.port}`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down gracefully...');
      await database.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n🛑 Shutting down gracefully...');
      await database.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
