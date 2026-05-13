import pg from 'pg';

const { Pool } = pg;

export function createPool(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }
  return new Pool({ connectionString });
}

export async function healthcheckDatabase() {
  const pool = createPool();
  const result = await pool.query('select now() as now');
  await pool.end();
  return result.rows[0];
}
