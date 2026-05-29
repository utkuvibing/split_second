#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { ROOT } from './lib/supabase-env.mjs';
import {
  CONTENT_AXES,
  DATING_DIMENSIONS,
  generateQuestionSignals,
  validateSignalFile,
} from './lib/personality-signals-lib.mjs';

const canonPath = path.join(ROOT, 'data', 'questions-canonical.json');
const outPath = path.join(ROOT, 'data', 'personality-signals.json');

const canon = JSON.parse(fs.readFileSync(canonPath, 'utf8'));
const questions = canon.questions;

const questionsMap = {};
for (const q of questions) {
  questionsMap[q.id] = generateQuestionSignals(q);
}

const payload = {
  version: 1,
  generated_at: new Date().toISOString(),
  signal_scale: { min: -2, max: 2 },
  axes: CONTENT_AXES,
  dating_dimensions: DATING_DIMENSIONS,
  questions: questionsMap,
};

const validation = validateSignalFile(questions, payload);
if (!validation.ok) {
  console.error('Generated file failed validation:');
  for (const e of validation.errors.slice(0, 20)) console.error(`  - ${e}`);
  process.exit(1);
}

fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Questions: ${validation.questionCount}, Dating: ${validation.datingCount}`);
if (validation.warnings.length) {
  console.warn(`Warnings: ${validation.warnings.length}`);
}
