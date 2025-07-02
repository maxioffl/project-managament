import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/projectmanagement';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
    return true;
  } catch (err) {
    console.log('MongoDB connection failed, using in-memory storage');
    return false;
  }
};

export const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};