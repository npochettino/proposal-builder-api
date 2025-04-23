import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

export async function connectToDatabase() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGODB_URI, { dbName: 'proposal-builder-api' });
  }
}
