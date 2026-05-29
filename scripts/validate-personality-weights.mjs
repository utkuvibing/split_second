#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { ROOT } from './lib/supabase-env.mjs';

const sqlPath = path.join(ROOT, 'supabase', 'migrations', '028_personality_v2.sql');
const jsonPath = path.join(ROOT, 'lib', 'personality-types-v2.json');

const sql = fs.readFileSync(sqlPath, 'utf8');
const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const match = sql.match(/v_weights := '\[(.*?)\]'::jsonb/s);
if (!match) {
  console.error('Could not extract embedded weights from 028_personality_v2.sql');
  process.exit(1);
}

const embeddedJson = `[${match[1].replace(/\n\s*/g, '')}]`;
let embedded;
try {
  embedded = JSON.parse(embeddedJson);
} catch (e) {
  console.error('Failed to parse embedded SQL weights:', e.message);
  process.exit(1);
}

const errors = [];

for (const t of json.types) {
  const e = embedded.find((x) => x.id === t.id);
  if (!e) {
    errors.push(`Type ${t.id} missing in SQL embedded weights`);
    continue;
  }
  for (const [k, v] of Object.entries(t.weights)) {
    const sqlVal = e.weights[k];
    if (sqlVal == null) {
      errors.push(`${t.id}: key ${k} missing in SQL`);
    } else if (Math.abs(sqlVal - v) > 1e-9) {
      errors.push(`${t.id}.${k}: JSON=${v} SQL=${sqlVal}`);
    }
  }
  for (const k of Object.keys(e.weights)) {
    if (!(k in t.weights)) {
      errors.push(`${t.id}: extra SQL key ${k}`);
    }
  }
}

if (errors.length) {
  console.error('Validation: FAIL');
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

console.log('Validation: PASS');
console.log(`Types checked: ${json.types.length}`);
console.log('SQL embedded weights match lib/personality-types-v2.json');
