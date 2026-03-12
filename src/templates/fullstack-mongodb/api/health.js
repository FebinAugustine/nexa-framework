import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';

export async function GET() {
    try {
        await connectDB();
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        
        return Response.json({ 
            status: "ok", 
            db: dbStatus,
            memory: process.memoryUsage().heapUsed,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return Response.json({ 
            status: "error", 
            db: 'error',
            error: error.message,
            memory: process.memoryUsage().heapUsed,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}