#!/usr/bin/env node
/**
 * Apply canonical JSON to Supabase questions table.
 * Default: --dry-run. Live updates require --confirm.
 */
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { ROOT, fetchTable, backupTimestamp, callRpc } from './lib/supabase-env.mjs';
import { validateQuestions } from './lib/inventory-validate.mjs';

const args = process.argv.slice(2);
const dryRun = !args.includes('--confirm');
const skipBackup = args.includes('--skip-backup');

if (args.includes('--confirm') && process.env.APPLY_CONFIRM !== '1') {
  console.error('Live apply requires APPLY_CONFIRM=1 environment variable.');
  console.error('Example: APPLY_CONFIRM=1 node scripts/apply-questions-canonical.mjs --confirm');
  process.exit(1);
}

const canonPath = path.join(ROOT, 'data', 'questions-canonical.json');
const payload = JSON.parse(fs.readFileSync(canonPath, 'utf8'));
const canonical = payload.questions;

const val = validateQuestions(canonical);
if (!val.ok) {
  console.error('Validation FAILED — apply aborted.');
  for (const e of val.errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log('Validation PASS');

const valProc = spawnSync('node', ['scripts/validate-questions.mjs'], {
  cwd: ROOT,
  stdio: 'inherit',
});
if (valProc.status !== 0) process.exit(valProc.status);

let backupPath = null;
if (!dryRun && !skipBackup) {
  const proc = spawnSync('node', ['scripts/backup-supabase-tables.mjs'], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  if (proc.status !== 0) process.exit(proc.status);
  const backupsDir = path.join(ROOT, 'data', 'backups');
  const dirs = fs.readdirSync(backupsDir).sort();
  backupPath = path.join(backupsDir, dirs[dirs.length - 1]);
}

const live = await fetchTable('questions', {
  select:
    'id,scheduled_date,time_slot,category,question_text,question_text_tr,option_a,option_a_tr,option_b,option_b_tr,is_active',
  filters: { is_active: 'eq.true' },
  limit: 500,
});
const liveById = new Map(live.map((q) => [q.id, q]));

const FIELDS = [
  'scheduled_date',
  'time_slot',
  'category',
  'question_text',
  'question_text_tr',
  'option_a',
  'option_a_tr',
  'option_b',
  'option_b_tr',
];

const diffs = [];
let dateChanges = 0;
let categoryChanges = 0;
let trFills = 0;

for (const q of canonical) {
  const prev = liveById.get(q.id);
  if (!prev) {
    console.error(`Missing id in live DB: ${q.id}`);
    process.exit(1);
  }
  const changed = {};
  for (const f of FIELDS) {
    const a = prev[f] ?? null;
    const b = q[f] ?? null;
    if (String(a ?? '') !== String(b ?? '')) {
      changed[f] = { from: a, to: b };
      if (f === 'scheduled_date' || f === 'time_slot') dateChanges++;
      if (f === 'category') categoryChanges++;
      if (f.endsWith('_tr') && !a && b) trFills++;
    }
  }
  if (Object.keys(changed).length) {
    diffs.push({ id: q.id, index: canonical.indexOf(q), changed });
  }
}

const ts = backupTimestamp();
const reportDir = path.join(ROOT, 'data', 'reports');
fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(
  reportDir,
  dryRun ? `apply-dry-run-${ts}.json` : `apply-live-${ts}.json`,
);

const report = {
  mode: dryRun ? 'dry-run' : 'live',
  timestamp: ts,
  backup_path: backupPath,
  rows_to_update: diffs.length,
  date_field_changes: dateChanges,
  category_changes: categoryChanges,
  tr_fields_filled: trFills,
  sample_diffs: diffs.slice(0, 10),
  validation: { ok: val.ok, datingCount: val.datingCount, dateRange: val.dateRange },
};

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

console.log(`\n${dryRun ? 'DRY-RUN' : 'LIVE'} report: ${reportPath}`);
console.log(`Rows to update: ${diffs.length}`);
console.log(`Date/slot field changes: ${dateChanges}`);
console.log(`Category changes: ${categoryChanges}`);
console.log(`TR fields filled (empty -> value): ${trFills}`);

if (dryRun) {
  console.log('\nNo database writes. Use APPLY_CONFIRM=1 ... --confirm for live apply.');
  process.exit(0);
}

const batchPayload = diffs.map(({ id }) => {
  const q = canonical.find((row) => row.id === id);
  return {
    id: q.id,
    scheduled_date: q.scheduled_date,
    time_slot: q.time_slot,
    category: q.category,
    question_text: q.question_text,
    question_text_tr: q.question_text_tr,
    option_a: q.option_a,
    option_a_tr: q.option_a_tr,
    option_b: q.option_b,
    option_b_tr: q.option_b_tr,
  };
});

let rpcResult;
try {
  rpcResult = await callRpc('apply_question_inventory_batch', { p_updates: batchPayload });
} catch (err) {
  const msg = String(err.message ?? err);
  if (msg.includes('404') || msg.includes('PGRST202')) {
    console.error(
      'RPC apply_question_inventory_batch not found. Deploy migration 026 first:\n' +
        '  node scripts/deploy-inventory-rpc.mjs\n' +
        '(requires SUPABASE_DB_URL or DATABASE_URL)',
    );
  }
  console.error(err.message ?? err);
  process.exit(1);
}

const updated = rpcResult?.updated ?? batchPayload.length;
console.log(`\nLive apply complete (single transaction). Updated ${updated} rows.`);
report.rows_updated = updated;
report.transaction = { ok: true, rpc: 'apply_question_inventory_batch', result: rpcResult };
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
