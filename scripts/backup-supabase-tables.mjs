#!/usr/bin/env node
/**
 * Full export of questions + votes to data/backups/{timestamp}/
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { ROOT, fetchTable, backupTimestamp, getSupabaseConfig } from './lib/supabase-env.mjs';

const ts = backupTimestamp();
const dir = path.join(ROOT, 'data', 'backups', ts);
fs.mkdirSync(dir, { recursive: true });

let gitCommit = null;
try {
  gitCommit = execSync('git rev-parse HEAD', { cwd: ROOT, encoding: 'utf8' }).trim();
} catch {
  /* optional */
}

const { url } = getSupabaseConfig();
const projectRef = url.match(/https:\/\/([^.]+)/)?.[1] ?? 'unknown';

console.log(`Backing up to ${dir}...`);

const questions = await fetchTable('questions', {
  select: '*',
  order: 'scheduled_date.asc,time_slot.asc',
});
const votes = await fetchTable('votes', {
  select: '*',
  order: 'created_at.asc',
});

fs.writeFileSync(path.join(dir, 'questions.json'), JSON.stringify(questions, null, 2), 'utf8');
fs.writeFileSync(path.join(dir, 'votes.json'), JSON.stringify(votes, null, 2), 'utf8');

const manifest = {
  timestamp: ts,
  created_at: new Date().toISOString(),
  supabase_project_ref: projectRef,
  git_commit: gitCommit,
  questions_count: questions.length,
  votes_count: votes.length,
  paths: {
    questions: `data/backups/${ts}/questions.json`,
    votes: `data/backups/${ts}/votes.json`,
  },
};
fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

console.log(`questions: ${questions.length} rows`);
console.log(`votes: ${votes.length} rows`);
console.log(`manifest: data/backups/${ts}/manifest.json`);
