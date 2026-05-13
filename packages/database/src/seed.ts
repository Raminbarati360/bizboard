import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPool } from './index.js';

function defaultMigrationsDir() {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(dirname, '../migrations');
}

async function main() {
  const pool = createPool();
  const migrationsDir = process.env.DATABASE_MIGRATIONS_DIR
    ? path.resolve(process.env.DATABASE_MIGRATIONS_DIR)
    : defaultMigrationsDir();
  const seedFiles = (await readdir(migrationsDir))
    .filter((file) => file.includes('seed') && file.endsWith('.sql'))
    .sort();

  for (const file of seedFiles) {
    console.log(`seed ${file}`);
    const sql = await readFile(path.join(migrationsDir, file), 'utf8');
    await pool.query(sql);
  }
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
