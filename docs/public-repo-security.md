# Public repository security

## What must never be committed

| Item | Use instead |
|------|-------------|
| `.env`, `.env.local`, `.env.production` | `.env.example` (placeholders only) |
| Supabase **service_role** key | **anon** key in `.env` only |
| Apple `.p8`, `.p12`, provisioning profiles | EAS credentials / GitHub Secrets |
| `EXPO_TOKEN`, `EAS_TOKEN` | GitHub Actions secrets |
| Database URLs with real passwords | Local env / CI secrets |

## Local setup

```bash
cp .env.example .env
# Edit .env with your Supabase Project URL + anon key
```

## Push protection (recommended)

Enable the repo hook once per clone:

```bash
git config core.hooksPath .githooks
```

On Windows, Git Bash is used for hooks by default. Before each `git push`, `scripts/verify-no-secrets.mjs` runs.

Manual check:

```bash
npm run secrets:check
```

## If `.env` was ever committed

1. Remove from git (keep local file): `git rm --cached .env`
2. Rotate Supabase anon key if the repo was ever public
3. Consider `git filter-repo` if history contained secrets

## CI

The **Secret guard** workflow runs on push/PR and fails if sensitive paths or patterns are detected.
