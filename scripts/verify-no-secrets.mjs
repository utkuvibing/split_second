#!/usr/bin/env node
/**
 * Blocks commits/pushes that include env files or common secret patterns.
 * Run: node scripts/verify-no-secrets.mjs
 * Optional: git config core.hooksPath .githooks
 */

import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { basename, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const BLOCKED_PATH_PATTERNS = [
  /^\.env$/i,
  /^\.env\.(?!example$)[^.]+$/i,
  /\.env\.local$/i,
  /^\.env\.local$/i,
  /credentials\.json$/i,
  /^secrets\.json$/i,
  /google-services\.json$/i,
  /GoogleService-Info\.plist$/i,
  /\.p8$/i,
  /\.p12$/i,
  /\.jks$/i,
  /\.keystore$/i,
  /\.mobileprovision$/i,
  /AuthKey_.*\.p8$/i,
];

const ALLOWED_ENV_FILES = new Set(['.env.example']);

const CONTENT_PATTERNS = [
  { name: 'Supabase service_role JWT', regex: /service_role['"]?\s*[:=]\s*['"]?eyJ/i },
  { name: 'Hardcoded Supabase service key', regex: /SUPABASE_SERVICE_ROLE_KEY\s*=\s*['"]?[^\s'"]+/i },
  { name: 'Private key block', regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'Expo access token', regex: /EXPO_TOKEN\s*=\s*[^\s#]+/i },
  { name: 'Ngrok authtoken in file', regex: /NGROK_AUTHTOKEN\s*=\s*[a-zA-Z0-9_]{10,}/i },
];

function git(args) {
  try {
    return execSync(`git ${args}`, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function listFilesToScan() {
  const sets = new Set();

  const tracked = git('ls-files -z');
  if (tracked) {
    for (const f of tracked.split('\0').filter(Boolean)) sets.add(f);
  }

  const staged = git('diff --cached --name-only --diff-filter=ACMR');
  for (const f of staged.split('\n').filter(Boolean)) sets.add(f);

  const unstaged = git('diff --name-only --diff-filter=ACMR');
  for (const f of unstaged.split('\n').filter(Boolean)) sets.add(f);

  return [...sets];
}

function isBlockedPath(filePath) {
  const base = basename(filePath);
  if (ALLOWED_ENV_FILES.has(base)) return false;
  return BLOCKED_PATH_PATTERNS.some((re) => re.test(filePath) || re.test(base));
}

function scanContent(filePath) {
  const full = join(ROOT, filePath);
  if (!existsSync(full)) return [];
  if (/\.(png|jpg|jpeg|gif|webp|mp3|wav|ico|woff2?|ttf|eot)$/i.test(filePath)) return [];

  let text;
  try {
    text = readFileSync(full, 'utf8');
  } catch {
    return [];
  }

  const hits = [];
  for (const { name, regex } of CONTENT_PATTERNS) {
    if (regex.test(text)) hits.push(name);
  }
  return hits;
}

function main() {
  const files = listFilesToScan();
  const pathViolations = files.filter(isBlockedPath);
  const contentViolations = [];

  for (const file of files) {
    if (isBlockedPath(file)) continue;
    if (!/\.(ts|tsx|js|jsx|mjs|cjs|json|md|sh|yml|yaml|env\.example)$/i.test(file)) continue;
    const hits = scanContent(file);
    if (hits.length) contentViolations.push({ file, hits });
  }

  if (pathViolations.length === 0 && contentViolations.length === 0) {
    console.log('verify-no-secrets: OK');
    process.exit(0);
  }

  console.error('\nverify-no-secrets: FAILED — sensitive files or patterns detected.\n');

  if (pathViolations.length) {
    console.error('Blocked paths (must not be committed):');
    for (const f of pathViolations) console.error(`  - ${f}`);
    console.error('\nIf .env was tracked before: git rm --cached .env\n');
  }

  if (contentViolations.length) {
    console.error('Suspicious content in tracked files:');
    for (const { file, hits } of contentViolations) {
      console.error(`  - ${file}: ${hits.join(', ')}`);
    }
  }

  console.error('\nSee docs/public-repo-security.md\n');
  process.exit(1);
}

main();
