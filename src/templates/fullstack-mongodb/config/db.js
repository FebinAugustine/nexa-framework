import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
    if (isConnected) {
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexa-app');

        isConnected = conn.connections[0].readyState;
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

export function disconnectDB() {
    if (isConnected) {
        mongoose.disconnect();
        isConnected = false;
        console.log('📴 MongoDB disconnected');
    }
}