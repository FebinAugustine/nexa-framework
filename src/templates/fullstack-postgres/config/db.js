import pg from 'pg';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;

// First, connect to default 'postgres' database to check if 'nexa-app' exists
async function createDatabaseIfNotExists() {
  const defaultPool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/postgres'
  });

  try {
    const client = await defaultPool.connect();
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'nexa-app'");
    
    if (res.rows.length === 0) {
      console.log('Creating database "nexa-app"');
      await client.query('CREATE DATABASE "nexa-app"');
      console.log('✅ Database created');
    } else {
      console.log('Database "nexa-app" already exists');
    }
    
    client.release();
    await defaultPool.end();
  } catch (error) {
    console.error('Error checking/creating database:', error);
    await defaultPool.end();
    process.exit(1);
  }
}

// Now connect to the 'nexa-app' database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/nexa-app'
});

export async function connectDB() {
  try {
    await createDatabaseIfNotExists();
    
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected');
    
    // Read and execute initialization SQL
    const initSqlPath = path.resolve('config', 'init.sql');
    if (fs.existsSync(initSqlPath)) {
      const initSql = fs.readFileSync(initSqlPath, 'utf8');
      await client.query(initSql);
      console.log('✅ Database initialized');
    }
    
    client.release();
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await pool.end();
  console.log('📴 PostgreSQL disconnected');
}

export { pool };
