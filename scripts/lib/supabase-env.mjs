import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '../..');

export function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

export function getSupabaseConfig() {
  loadEnv();
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY in .env');
  }
  return { url, key };
}

export function getServiceRoleKey() {
  loadEnv();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY in .env (required for transactional live apply).',
    );
  }
  return key;
}

/** Admin/inventory RPCs — requires SUPABASE_SERVICE_ROLE_KEY (no anon fallback). */
export async function callRpc(fn, body) {
  const { url } = getSupabaseConfig();
  const key = getServiceRoleKey();
  const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`RPC ${fn}: ${res.status} ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

export async function fetchTable(table, { select = '*', filters = {}, order, limit = 10000 } = {}) {
  const { url, key } = getSupabaseConfig();
  const params = new URLSearchParams();
  params.set('select', select);
  for (const [k, v] of Object.entries(filters)) {
    params.set(k, v);
  }
  if (order) params.set('order', order);
  params.set('limit', String(limit));

  const res = await fetch(`${url}/rest/v1/${table}?${params}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase ${table}: ${res.status} ${text}`);
  }
  return res.json();
}

export function backupTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').replace('Z', 'Z');
}
