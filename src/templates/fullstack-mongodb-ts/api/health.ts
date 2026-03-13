import { connectDB } from '../config/db';

export async function GET() {
  try {
    await connectDB();
        
    return new Response(
      JSON.stringify({ success: true, status: 'healthy', timestamp: new Date().toISOString() }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Health check error:', error);
        
    return new Response(
      JSON.stringify({ success: false, error: 'Service unavailable' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
