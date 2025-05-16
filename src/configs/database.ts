import mongoose from 'mongoose';
import { config } from '.';

const mongoConnect = async (): Promise<void> => {
  const mongoDatabaseURI = config.mongodb;
  await mongoose.connect(mongoDatabaseURI);
  console.log('✅ MongoDB connected');
};

export default mongoConnect;