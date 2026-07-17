import mongoose from 'mongoose';

// Ensure we don't connect multiple times in development (Next.js hot reload)
let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ No MONGODB_URI found in environment variables. Database will not connect.');
    return;
  }
  
  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log('✅ Connected to MongoDB successfully.');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}

// Define StandupLog Schema inside dashboard as well, so it can read it
const standupLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  yesterday: { type: String, default: '' },
  today: { type: String, default: '' },
  blockers: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const StandupLog = mongoose.models.StandupLog || mongoose.model('StandupLog', standupLogSchema);
