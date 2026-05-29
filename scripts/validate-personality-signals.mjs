#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { ROOT } from './lib/supabase-env.mjs';
import { validateSignalFile } from './lib/personality-signals-lib.mjs';

const canonPath = path.join(ROOT, 'data', 'questions-canonical.json');
const signalsPath = path.join(ROOT, 'data', 'personality-signals.json');

const canon = JSON.parse(fs.readFileSync(canonPath, 'utf8'));
const signals = JSON.parse(fs.readFileSync(signalsPath, 'utf8'));
const result = validateSignalFile(canon.questions, signals);

console.log(`Validation: ${result.ok ? 'PASS' : 'FAIL'}`);
console.log(`Questions: ${result.questionCount}, Signals: ${result.signalCount}, Dating: ${result.datingCount}`);

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
