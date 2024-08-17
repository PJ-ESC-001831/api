import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || 'your-default-mongodb-uri';

export async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB with Mongoose');
  } catch (error) {
    console.error('Failed to connect to MongoDB with Mongoose', error);
    throw error;
  }
}

export async function closeDatabaseConnection() {
  try {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB with Mongoose');
  } catch (error) {
    console.error('Failed to disconnect from MongoDB with Mongoose', error);
    throw error;
  }
}
