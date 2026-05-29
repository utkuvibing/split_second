#!/usr/bin/env node
/**
 * Post-apply verification against live Supabase.
 */
import { ROOT, fetchTable } from './lib/supabase-env.mjs';
import { validateQuestions } from './lib/inventory-validate.mjs';
import { CANONICAL_CATEGORIES, START_DATE } from './lib/inventory-constants.mjs';

const SLOT_ORDER = { morning: 0, afternoon: 1, evening: 2 };

const rows = await fetchTable('questions', {
  select:
    'id,scheduled_date,time_slot,category,question_text,question_text_tr,option_a,option_a_tr,option_b,option_b_tr,is_active',
  filters: { is_active: 'eq.true' },
  order: 'scheduled_date.asc,time_slot.asc',
  limit: 500,
});

rows.sort((a, b) => {
  if (a.scheduled_date !== b.scheduled_date) {
    return a.scheduled_date < b.scheduled_date ? -1 : 1;
  }
  return (SLOT_ORDER[a.time_slot] ?? 9) - (SLOT_ORDER[b.time_slot] ?? 9);
});

const val = validateQuestions(rows);
const dates = [...new Set(rows.map((q) => q.scheduled_date))].sort();
const firstDate = dates[0];
const lastDate = dates[dates.length - 1];
const datingCount = rows.filter((q) => q.category === 'dating').length;

const firstDay = rows.filter((q) => q.scheduled_date === START_DATE);
const lastDay = rows.filter((q) => q.scheduled_date === lastDate);

const trFields = [
  'question_text_tr',
  'option_a_tr',
  'option_b_tr',
];
const emptyTr = [];
for (const q of rows) {
  for (const f of trFields) {
    const v = q[f];
    if (v == null || String(v).trim() === '') {
      emptyTr.push({ id: q.id, field: f });
    }
  }
}

const badCategories = rows.filter((q) => !CANONICAL_CATEGORIES.includes(q.category));

const checks = {
  count_214: rows.length === 214,
  validation_ok: val.ok,
  first_date: firstDate === START_DATE,
  last_date: lastDate === '2026-08-08',
  dating_22: datingCount === 22,
  first_day_3_slots:
    firstDay.length === 3 &&
    ['morning', 'afternoon', 'evening'].every((s) => firstDay.some((q) => q.time_slot === s)),
  last_day_morning_only: lastDay.length === 1 && lastDay[0]?.time_slot === 'morning',
  no_empty_tr: emptyTr.length === 0,
  canonical_categories: badCategories.length === 0,
};

const allOk = Object.values(checks).every(Boolean);

const report = {
  ok: allOk,
  checks,
  count: rows.length,
  firstDate,
  lastDate,
  datingCount,
  emptyTrCount: emptyTr.length,
  badCategoryCount: badCategories.length,
  validation: val,
  firstThreeDays: dates.slice(0, 3).map((d) => ({
    date: d,
    slots: rows.filter((q) => q.scheduled_date === d).map((q) => q.time_slot),
  })),
  lastDay: {
    date: lastDate,
    slots: lastDay.map((q) => q.time_slot),
    count: lastDay.length,
  },
};

console.log(JSON.stringify(report, null, 2));
process.exit(allOk ? 0 : 1);
