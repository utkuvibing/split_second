#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { ROOT, callRpc } from './lib/supabase-env.mjs';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const confirm = args.includes('--confirm');

if (!dryRun && !confirm) {
  console.error('Refusing to apply without --dry-run or --confirm');
  console.error('  Dry run:  node scripts/apply-personality-signals.mjs --dry-run');
  console.error('  Live:     node scripts/apply-personality-signals.mjs --confirm');
  process.exit(1);
}

const signalsPath = path.join(ROOT, 'data', 'personality-signals.json');
const payload = JSON.parse(fs.readFileSync(signalsPath, 'utf8'));

const updates = Object.entries(payload.questions).map(([id, entry]) => ({
  id,
  personality_signals: entry,
  personality_signals_version: payload.version,
}));

if (dryRun) {
  const dating = Object.values(payload.questions).filter((e) => e.category === 'dating').length;
  const reviewed = Object.values(payload.questions).filter(
    (e) => e.category === 'dating' && e.review_status === 'reviewed',
  ).length;
  const report = {
    mode: 'dry-run',
    timestamp: new Date().toISOString(),
    rows_to_update: updates.length,
    dating_signals: dating,
    dating_reviewed: reviewed,
    batches: Math.ceil(updates.length / 25),
    sample_ids: updates.slice(0, 5).map((u) => u.id),
  };
  const outPath = path.join(
    ROOT,
    'data',
    'reports',
    `personality-signals-dry-run-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
  );
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log('Dry run complete (no remote changes).');
  console.log(JSON.stringify(report, null, 2));
  console.log(`Report: ${outPath}`);
  process.exit(0);
}

const BATCH = 25;
let applied = 0;

for (let i = 0; i < updates.length; i += BATCH) {
  const batch = updates.slice(i, i + BATCH);
  await callRpc('apply_personality_signals_batch', { p_updates: batch });
  applied += batch.length;
  console.log(`Applied ${applied}/${updates.length}`);
}

console.log('Done.');
