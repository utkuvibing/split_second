# Split Second — Soru envanteri denetim raporu

**Tarih:** 2026-05-29  
**Son güncelleme:** Canlı apply tamamlandı (transactional RPC)

## Canlı apply özeti

| Alan | Değer |
|------|--------|
| Validation (apply öncesi) | **PASS** |
| Backup (apply öncesi) | `data/backups/2026-05-29T16-36-08-267Z/` |
| Transaction | `apply_question_inventory_batch` (migration 026) |
| Güncellenen satır | **214** |
| Rollback | **Gerekmedi** — RPC tek transaction; hata yok |
| Live rapor | `data/reports/apply-live-2026-05-29T16-36-12-171Z.json` |

## Backup paths (apply öncesi)

| Dosya | Path |
|-------|------|
| questions | `data/backups/2026-05-29T16-36-08-267Z/questions.json` |
| votes | `data/backups/2026-05-29T16-36-08-267Z/votes.json` |
| manifest | `data/backups/2026-05-29T16-36-08-267Z/manifest.json` |

- questions: **214** rows  
- votes: **2** rows  

Önceki plan backup: `data/backups/2026-05-29T16-23-05-438Z/`

## Validation

**PASS** (canonical + canlı DB doğrulaması)

- Soru sayısı: **214**
- Dating: **22**
- Tarih aralığı: **2026-05-29** → **2026-08-08**
- Boş TR alanı: **0**
- Kategoriler: canonical (11 kategori)

Komut: `npm run validate:questions` · `node scripts/verify-questions-db.mjs`

## DB doğrulama (apply sonrası)

| Kontrol | Sonuç |
|---------|--------|
| 214 active question | OK |
| first date 2026-05-29 | OK |
| last date 2026-08-08 | OK |
| dating count 22 | OK |
| 2026-05-29 → 3 slot (morning, afternoon, evening) | OK |
| 2026-08-08 → yalnızca morning | OK |
| null/empty TR | OK (0) |
| canonical categories | OK |

### İlk 3 gün (DB)

| Tarih | Slotlar |
|-------|---------|
| 2026-05-29 | morning, afternoon, evening |
| 2026-05-30 | morning, afternoon, evening |
| 2026-05-31 | morning, afternoon, evening |

### Son gün (DB)

| Tarih | Slotlar |
|-------|---------|
| 2026-08-08 | morning (1 soru) |

## Apply (canlı)

**Durum:** completed

```text
APPLY_CONFIRM=1 node scripts/apply-questions-canonical.mjs --confirm --skip-backup
```

- İki aşamalı staging + final update (unique `(scheduled_date, time_slot)` çakışması yok)
- Tek PostgreSQL transaction; partial update oluşmadı

## Canonical kaynak

- `data/questions-canonical.json` (apply sonrası DB export ile senkron)
- Export: `output/doc/questions-export.json`

## Dating dönüşümleri

**Rapor:** `data/reports/dating-conversions.json` — **22** kayıt

## Scriptler

| Script | Amaç |
|--------|------|
| `scripts/backup-supabase-tables.mjs` | Timestamp backup |
| `scripts/export-questions-canonical.mjs` | DB → canonical JSON |
| `scripts/verify-questions-db.mjs` | Post-apply DB kontrolleri |
| `scripts/validate-questions.mjs` | Validation gate |
| `scripts/apply-questions-canonical.mjs` | dry-run / transactional `--confirm` apply |
| `scripts/deploy-inventory-rpc.mjs` | RPC deploy (pg + `SUPABASE_DB_URL`) |
| `supabase/migrations/026_apply_question_inventory_batch.sql` | Batch RPC |

## Faz 2 (yapılmadı)

- `026_questions_category_check.sql` — CHECK constraint; ayrı karar
