#!/usr/bin/env node
/**
 * Normalizes data/questions-canonical.json only (no Supabase).
 */
import fs from 'fs';
import path from 'path';
import { ROOT } from './lib/supabase-env.mjs';
import { normalizeCategory, assignSchedule } from './lib/inventory-constants.mjs';
import { validateQuestions } from './lib/inventory-validate.mjs';
import { TR_PATCHES_BY_INDEX } from './data/tr-patches-100-114.mjs';
import { REWRITES_BY_INDEX } from './data/inventory-rewrites.mjs';

const canonPath = path.join(ROOT, 'data', 'questions-canonical.json');
const reportDir = path.join(ROOT, 'data', 'reports');
fs.mkdirSync(reportDir, { recursive: true });

const payload = JSON.parse(fs.readFileSync(canonPath, 'utf8'));
const questions = payload.questions;
const datingConversions = [];

function snapshot(q) {
  return {
    question_text: q.question_text,
    question_text_tr: q.question_text_tr,
    option_a: q.option_a,
    option_a_tr: q.option_a_tr,
    option_b: q.option_b,
    option_b_tr: q.option_b_tr,
  };
}

function applyPatch(q, patch) {
  for (const [k, v] of Object.entries(patch)) {
    if (v != null) q[k] = v;
  }
}

for (let i = 0; i < questions.length; i++) {
  const q = questions[i];
  const oldCat = q.category;
  const before = snapshot(q);

  if (TR_PATCHES_BY_INDEX[i]) {
    applyPatch(q, TR_PATCHES_BY_INDEX[i]);
  }

  if (REWRITES_BY_INDEX[i]) {
    applyPatch(q, REWRITES_BY_INDEX[i]);
  }

  q.category = normalizeCategory(q.category);

  const sched = assignSchedule(i);
  q.scheduled_date = sched.scheduled_date;
  q.time_slot = sched.time_slot;
  q.is_active = true;

  const textChanged =
    before.question_text !== q.question_text ||
    before.question_text_tr !== q.question_text_tr;
  const catToDating = oldCat !== 'dating' && q.category === 'dating';
  if (catToDating || (textChanged && q.category === 'dating')) {
    datingConversions.push({
      id: q.id,
      index: i,
      old_category: normalizeCategory(oldCat),
      new_category: q.category,
      old: before,
      new: snapshot(q),
    });
  }
}

function fixDatingDistribution(questions) {
  const byDate = new Map();
  for (const q of questions) {
    if (!byDate.has(q.scheduled_date)) byDate.set(q.scheduled_date, []);
    byDate.get(q.scheduled_date).push(q);
  }
  const dates = [...byDate.keys()].sort();
  const fallbacks = ['personality', 'lifestyle', 'philosophy', 'funny', 'food'];
  let changed = true;
  let pass = 0;
  while (changed && pass < 50) {
    changed = false;
    pass++;
    for (let i = 0; i < dates.length - 2; i++) {
      const has = (d) => byDate.get(d).some((q) => q.category === 'dating');
      if (has(dates[i]) && has(dates[i + 1]) && has(dates[i + 2])) {
        const mid = byDate.get(dates[i + 1]).find((q) => q.category === 'dating');
        if (mid) {
          mid.category = fallbacks[pass % fallbacks.length];
          changed = true;
        }
      }
    }
    for (const [, dayQs] of byDate) {
      const datingQs = dayQs.filter((q) => q.category === 'dating');
      if (datingQs.length > 1) {
        for (let k = 1; k < datingQs.length; k++) {
          datingQs[k].category = fallbacks[(pass + k) % fallbacks.length];
          changed = true;
        }
      }
    }
  }
}

fixDatingDistribution(questions);

// Balance: max 1 dating per day — swap category with non-dating same day
const byDate = new Map();
for (const q of questions) {
  if (!byDate.has(q.scheduled_date)) byDate.set(q.scheduled_date, []);
  byDate.get(q.scheduled_date).push(q);
}

const FALLBACK_CAT = ['lifestyle', 'personality', 'philosophy', 'funny', 'food'];

for (const [, dayQs] of byDate) {
  const datingQs = dayQs.filter((q) => q.category === 'dating');
  if (datingQs.length <= 1) continue;
  const keep = datingQs[0];
  for (let k = 1; k < datingQs.length; k++) {
    const extra = datingQs[k];
    const swapTarget = dayQs.find(
      (q) => q !== extra && q.category !== 'dating' && q !== keep,
    );
    if (swapTarget) {
      const tmp = swapTarget.category;
      swapTarget.category = extra.category;
      extra.category = tmp;
    } else {
      extra.category = FALLBACK_CAT[k % FALLBACK_CAT.length];
    }
  }
}

payload.normalized_at = new Date().toISOString();
payload.questions = questions;

fs.writeFileSync(canonPath, JSON.stringify(payload, null, 2), 'utf8');
fs.writeFileSync(
  path.join(reportDir, 'dating-conversions.json'),
  JSON.stringify(datingConversions, null, 2),
  'utf8',
);

const result = validateQuestions(questions);
console.log('Normalize complete.');
console.log(`Dating conversions logged: ${datingConversions.length}`);
console.log(`Validation: ${result.ok ? 'PASS' : 'FAIL'}`);
if (result.errors.length) {
  console.error(result.errors.slice(0, 20).join('\n'));
  if (result.errors.length > 20) console.error(`... +${result.errors.length - 20} more`);
}
if (result.warnings.length) {
  console.warn(`Warnings: ${result.warnings.length}`);
}
process.exit(result.ok ? 0 : 1);
