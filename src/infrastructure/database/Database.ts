import mongoose from 'mongoose';

export class Database {
  private static instance: Database;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(uri: string): Promise<void> {
    try {
      await mongoose.connect(uri);
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}
