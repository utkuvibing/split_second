#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { ROOT } from './lib/supabase-env.mjs';
import { validateQuestions } from './lib/inventory-validate.mjs';

const canonPath = path.join(ROOT, 'data', 'questions-canonical.json');
const payload = JSON.parse(fs.readFileSync(canonPath, 'utf8'));
const result = validateQuestions(payload.questions);

console.log(`Validation: ${result.ok ? 'PASS' : 'FAIL'}`);
console.log(`Questions: ${payload.questions.length}`);
console.log(`Dating: ${result.datingCount}`);
if (result.dateRange) {
  console.log(`Dates: ${result.dateRange.first} .. ${result.dateRange.last}`);
}
if (result.errors.length) {
  console.error('\nErrors:');
  for (const e of result.errors) console.error(`  - ${e}`);
}
if (result.warnings.length) {
  console.warn('\nWarnings:');
  for (const w of result.warnings.slice(0, 15)) console.warn(`  - ${w}`);
  if (result.warnings.length > 15) {
    console.warn(`  ... +${result.warnings.length - 15} more`);
  }
}

process.exit(result.ok ? 0 : 1);
