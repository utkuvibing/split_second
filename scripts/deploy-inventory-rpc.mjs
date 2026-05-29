#!/usr/bin/env node
/**
 * Deploy 026_apply_question_inventory_batch.sql to the linked Supabase DB.
 * Requires SUPABASE_DB_URL or DATABASE_URL (Postgres connection string).
 */
import fs from 'fs';
import path from 'path';
import { ROOT, loadEnv } from './lib/supabase-env.mjs';

loadEnv();

const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
if (!dbUrl) {
  console.error(
    'Missing SUPABASE_DB_URL or DATABASE_URL. Set a Postgres connection string to deploy the RPC.',
  );
  process.exit(1);
}

const sqlPath = path.join(
  ROOT,
  'supabase',
  'migrations',
  '026_apply_question_inventory_batch.sql',
);
const sql = fs.readFileSync(sqlPath, 'utf8');

let pg;
try {
  pg = await import('pg');
} catch {
  console.error('Install pg: npm install --save-dev pg');
  process.exit(1);
}

const client = new pg.default.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
try {
  await client.connect();
  await client.query(sql);
  console.log('Deployed apply_question_inventory_batch RPC.');
} finally {
  await client.end();
}
