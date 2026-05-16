# Split Second — Launch Goal

**Mission:** Split Second uygulamasını App Store'da yayına almak.

## ✅ TAMAMLANANLAR
- Kod: V16 features (avatars, compatibility, matching, shop, badges, streaks, friends, personality, mystery boxes, live events)
- 301 test: ✅ hepsi geçiyor
- TypeScript: ✅ 0 error
- Supabase DB: ✅ migration + seed çalıştı (115 soru, 18 tablo, 43 RPC)
- Assets: ✅ icon, splash, adaptive icon, favicon
- Sound: ✅ tick.mp3, vote.mp3, result.mp3
- Docs: ✅ migration-runbook.md, build-readiness.md
- App Store metadata: ✅ EN+TR descriptions, release notes, screenshot-spec

## ⏳ BEKLEYEN
- **Apple Developer**: Hesap aktif olana kadar bekliyoruz (~48h)
- Aktif olunca: `eas.json` → Apple ID + ASC App ID → build → submit

## TODO: Kodex CLI ile yapılacaklar
1. GitHub Actions CI/CD pipeline (auto build + test on push)
2. App Store screenshot placeholder görselleri (1290x2796)
3. eas.json template'ini Apple ID olmadan da build alabilecek şekilde hazırla (only build, no submit)
4. TestFlight dağıtım otomasyonu scripti
5. App Store Connect API ile metadata upload otomasyonu
6. EAS build öncesi tüm validation check'leri
