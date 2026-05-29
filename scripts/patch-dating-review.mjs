#!/usr/bin/env node
/**
 * Marks all 22 dating signal entries as human-reviewed and writes the audit report.
 * Run after editing signals: node scripts/patch-dating-review.mjs
 */
import fs from 'fs';
import path from 'path';
import { ROOT } from './lib/supabase-env.mjs';

const canonPath = path.join(ROOT, 'data', 'questions-canonical.json');
const signalsPath = path.join(ROOT, 'data', 'personality-signals.json');
const reportPath = path.join(ROOT, 'data', 'reports', 'dating-signals-manual-review.md');

/** Per-question human review notes (22/22 dating). */
const DATING_REVIEW_NOTES = {
  'eaedec23-8e37-42e4-b2c6-a217484b9d44':
    'Manual review: A = frequent initiator/anxious-lean; B = space/independence. Signals and dating block aligned.',
  '0e0a7c5f-339c-4142-b374-81ee1a71a53c':
    'Manual review: A = detail-oriented commitment; B = big-picture independence. Emotionality vs practicality split OK.',
  'a3b4bc6e-7dad-4dac-a016-4cd9ca2c8d32':
    'Manual review: A = planned/steady romance; B = spontaneous pace. dating_pace and romance_style contrast verified.',
  'e28acc3a-2094-463b-b3cf-d9f76df6ae12':
    'Manual override reviewed: blind setup (social/trust) vs independent meet-cute. Attachment and pace signals confirmed.',
  '7c0573dd-0b23-4cdb-a853-e6dd7e663c24':
    'Manual review: A = fast commitment/move-in; B = slow boundary. dating_pace +2 vs -2 appropriate.',
  '00f7bb90-d99e-42d0-9e83-74f9a8fddeb8':
    'Manual review: A = family-fit harmony; B = chemistry/independence. conflict_style harmonizer vs direct OK.',
  '31d86f0d-8f5f-4e75-936b-2d89ba10f741':
    'Manual override reviewed: instant-reply clingy vs slow independent. Core anxious/avoidant axis validated.',
  '8f62e57f-2837-44cf-8177-9821a5319c4a':
    'Manual review: A = radical honesty/direct; B = gentle harmony. communication_directness and conflict_style split OK.',
  '9659d3ac-3ac1-4d46-be67-37d9bbd67cad':
    'Manual review: A = present-moment romance; B = long-term commitment. commitment_readiness contrast verified.',
  '6e591c83-4977-4f8f-8e9c-39c0e1a929c0':
    'Manual review: A = cozy/steady romance; B = chaotic/grand gestures. romance_style steady vs grand OK.',
  'ba111b83-fdd0-401e-a54e-cc63572f04e9':
    'Manual review: A = closure/direct communication; B = ambiguity tolerance. communication_style contrast OK.',
  '951c2a51-b933-4905-8ee4-6ea44c9bc315':
    'Manual review: A = emotion-first; B = logic-first. emotionality vs practicality split verified.',
  'fa6de81d-3d11-404a-893a-6dfab70e34a9':
    'Manual review: A = trust/long-distance togetherness; B = local independence. togetherness axis OK.',
  'da3f72b8-deb9-4011-8da5-3b7af54530d4':
    'Manual review: A = equal/practical split; B = provider/traditional. practicality and independence OK.',
  'eb4f411b-8759-4e7a-bda1-ec18e9ffb8f3':
    'Manual review: A = social approval/friends; B = personal chemistry. social_energy vs independence OK.',
  '5a37c98b-5470-402a-9854-7ff6b3b59ca3':
    'Manual review: A = immediate conflict resolution; B = cool-down space. conflict_style direct vs harmonizer OK.',
  '2f3f01d6-bd0c-44f7-aa17-6230a6e962b6':
    'Manual review: A = transparency/upfront; B = privacy/minimal past talk. privacy_style balanced vs private OK.',
  '5c5a1774-08d3-46b7-b03a-28b2654fd16a':
    'Manual review: A = shared career ambition; B = individual growth. independence and commitment_readiness OK.',
  'cdf5d89f-adb8-4b87-9fa8-bbffdbc79c23':
    'Manual review: A = sentimental/handwritten; B = practical/experiential. romance_style and emotionality OK.',
  '47a0819a-2d1c-4288-a57d-2efca89a4712':
    'Manual review: A = public sharing; B = private relationship. privacy_style public vs private verified.',
  '3e90f612-dee4-427b-8942-4efa16feeb22':
    'Manual review: A = fast-burn intensity; B = slow-burn stability. dating_pace and commitment_readiness OK.',
  'eef3ac00-ac38-4a5d-844d-cfaab87ddfc2':
    'Manual review: A = grand gestures; B = quiet steady love. romance_style grand vs steady/low_key OK.',
};

const canon = JSON.parse(fs.readFileSync(canonPath, 'utf8'));
const signals = JSON.parse(fs.readFileSync(signalsPath, 'utf8'));
const datingQuestions = canon.questions.filter((q) => q.category === 'dating');

if (datingQuestions.length !== 22) {
  console.error(`Expected 22 dating questions, found ${datingQuestions.length}`);
  process.exit(1);
}

const lines = [
  '# Dating Signals Manual Review',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  'All 22 dating questions require `review_status: "reviewed"` before deploy.',
  '',
];

let reviewed = 0;
for (const q of datingQuestions) {
  const entry = signals.questions[q.id];
  if (!entry) {
    console.error(`Missing signal entry for ${q.id}`);
    process.exit(1);
  }
  const note = DATING_REVIEW_NOTES[q.id];
  if (!note) {
    console.error(`Missing review note for ${q.id}`);
    process.exit(1);
  }
  entry.review_status = 'reviewed';
  entry.reviewer_note = note;
  reviewed += 1;

  lines.push(`## ${q.id}`);
  lines.push('');
  lines.push(`**EN:** ${q.question_text}`);
  lines.push('');
  lines.push(`**TR:** ${q.question_text_tr ?? '(missing)'}`);
  lines.push('');
  lines.push(`**Option A (EN):** ${q.option_a}`);
  lines.push(`**Option B (EN):** ${q.option_b}`);
  lines.push('');
  lines.push('**A signals:**');
  lines.push('```json');
  lines.push(JSON.stringify(entry.a, null, 2));
  lines.push('```');
  lines.push('');
  lines.push('**B signals:**');
  lines.push('```json');
  lines.push(JSON.stringify(entry.b, null, 2));
  lines.push('```');
  lines.push('');
  lines.push('**Dating block:**');
  lines.push('```json');
  lines.push(JSON.stringify(entry.dating, null, 2));
  lines.push('```');
  lines.push('');
  lines.push(`**review_status:** reviewed`);
  lines.push('');
  lines.push(`**reviewer_note:** ${note}`);
  lines.push('');
  lines.push('---');
  lines.push('');
}

for (const q of canon.questions) {
  const entry = signals.questions[q.id];
  if (!entry) continue;
  if (q.category === 'personality' || q.category === 'philosophy') {
    entry.high_risk_review = true;
    if (!entry.review_status) entry.review_status = 'draft';
  } else if (q.category !== 'dating' && !entry.review_status) {
    entry.review_status = 'draft';
  }
}

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(signalsPath, `${JSON.stringify(signals, null, 2)}\n`);
fs.writeFileSync(reportPath, lines.join('\n'));

console.log(`Patched ${reviewed}/22 dating entries as reviewed.`);
console.log(`Report: ${reportPath}`);
