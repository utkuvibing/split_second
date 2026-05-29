#!/usr/bin/env node
/** Rebuild dating-conversions.json from backup vs canonical */
import fs from 'fs';
import path from 'path';
import { ROOT } from './lib/supabase-env.mjs';
import { normalizeCategory } from './lib/inventory-constants.mjs';

const backupDir = path.join(ROOT, 'data', 'backups');
const dirs = fs.readdirSync(backupDir).sort();
const before = JSON.parse(
  fs.readFileSync(path.join(backupDir, dirs[0], 'questions.json'), 'utf8'),
);
const canon = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'data', 'questions-canonical.json'), 'utf8'),
).questions;

const beforeById = new Map(before.map((q) => [q.id, q]));
const out = [];

canon.forEach((q, index) => {
  const prev = beforeById.get(q.id);
  if (!prev) return;
  const oldCat = normalizeCategory(prev.category);
  const newCat = q.category;
  const snap = (r) => ({
    question_text: r.question_text,
    question_text_tr: r.question_text_tr,
    option_a: r.option_a,
    option_a_tr: r.option_a_tr,
    option_b: r.option_b,
    option_b_tr: r.option_b_tr,
  });
  const textChanged =
    prev.question_text !== q.question_text ||
    (prev.question_text_tr ?? '') !== (q.question_text_tr ?? '');
  if (newCat === 'dating' && (oldCat !== 'dating' || textChanged)) {
    out.push({
      id: q.id,
      index,
      old_category: oldCat,
      new_category: newCat,
      old: snap(prev),
      new: snap(q),
    });
  }
});

const reportPath = path.join(ROOT, 'data', 'reports', 'dating-conversions.json');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(out, null, 2), 'utf8');
console.log(`Wrote ${out.length} entries to ${reportPath}`);
