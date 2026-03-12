import { handleRequest } from './core/router.js';
import { connectDB } from './config/db.js';

// Connect to MongoDB
await connectDB();

Bun.serve({ port: 3000, fetch: handleRequest });
console.log("🚀 Server: http://localhost:3000");