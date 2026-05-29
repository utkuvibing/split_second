#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { ROOT, fetchTable } from './lib/supabase-env.mjs';

const SLOT_ORDER = { morning: 0, afternoon: 1, evening: 2 };

const rows = await fetchTable('questions', {
  select:
    'id,scheduled_date,time_slot,category,question_text,question_text_tr,option_a,option_a_tr,option_b,option_b_tr,is_active',
  filters: { is_active: 'eq.true' },
  order: 'scheduled_date.asc,time_slot.asc',
});

rows.sort((a, b) => {
  if (a.scheduled_date !== b.scheduled_date) {
    return a.scheduled_date < b.scheduled_date ? -1 : 1;
  }
  return (SLOT_ORDER[a.time_slot] ?? 9) - (SLOT_ORDER[b.time_slot] ?? 9);
});

const dataDir = path.join(ROOT, 'data');
fs.mkdirSync(dataDir, { recursive: true });

const outPath = path.join(dataDir, 'questions-canonical.json');
const beforePath = path.join(dataDir, 'questions-canonical.before.json');

if (fs.existsSync(outPath) && !fs.existsSync(beforePath)) {
  fs.copyFileSync(outPath, beforePath);
}

const payload = {
  version: 1,
  exported_at: new Date().toISOString(),
  count: rows.length,
  questions: rows,
};

fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
console.log(`Wrote ${rows.length} questions to ${outPath}`);
