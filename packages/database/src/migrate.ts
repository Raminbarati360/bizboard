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

  await pool.query(`
    create schema if not exists ops;
    create table if not exists ops.schema_migrations (
      filename text primary key,
      applied_at timestamptz not null default now()
    );
  `);

  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const already = await pool.query('select 1 from ops.schema_migrations where filename = $1', [file]);
    if (already.rowCount) {
      console.log(`skip ${file}`);
      continue;
    }
    const sql = await readFile(path.join(migrationsDir, file), 'utf8');
    console.log(`apply ${file}`);
    await pool.query('begin');
    try {
      await pool.query(sql);
      await pool.query('insert into ops.schema_migrations(filename) values ($1)', [file]);
      await pool.query('commit');
    } catch (error) {
      await pool.query('rollback');
      throw error;
    }
  }

  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
