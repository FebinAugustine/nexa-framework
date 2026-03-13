import { serve } from 'bun';
import { handleRequest } from './core/router';
import { connectDB } from './config/db';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Connect to MongoDB
await connectDB();

console.log(`🚀 Nexa Framework v1.0.0 - ${new Date().toLocaleString()}`);
console.log(`📡 Listening on http://${HOST}:${PORT}`);
console.log(`🎯 Mode: ${process.env.NODE_ENV || 'development'}`);
console.log('🤖 Type: TypeScript\n');

serve({
  port: PORT,
  hostname: HOST,
  fetch: handleRequest
});

// Keep the server alive
process.on('SIGINT', () => {
  console.log('\n👋 Goodbye!');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Goodbye!');
  process.exit(0);
});
