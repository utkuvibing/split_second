# Split Second

**[English README](README.en.md)**

React Native ve Expo ile geliştirilmiş günlük "Hangisini Tercih Edersin?" mobil uygulaması. Her gün bir soru, geri sayım baskısı altında oy ver ve dünyanın nasıl düşündüğünü gör.

## Özellikler

- **Günlük Soru** — Her gece yarısı yeni bir "hangisini tercih edersin" sorusu
- **Geri Sayım** — Süre dolmadan oy ver, gerilimi hisset
- **Canlı Sonuçlar** — Oyunu verdikten sonra küresel oy dağılımını gör
- **Seri Takibi** — Günlük oylama serini devam ettir
- **Global İstatistikler** — Bugün kaç kişi oy verdi, genel trendler
- **Paylaşım Kartları** — Oyunu görsel olarak oluştur ve paylaş
- **Deep Link** — Herhangi bir günün sorusuna doğrudan link (`split-second://q/2025-01-15`)
- **Çoklu Dil (i18n)** — Cihaz diline göre otomatik algılama
- **Titreşim & Ses Efektleri** — Etkileşimlerde dokunsal ve sesli geri bildirim
- **Onboarding** — İlk açılışta tanıtım ekranı

## Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| Framework | [Expo SDK 54](https://expo.dev/) (React Native 0.81) |
| Routing | [expo-router](https://docs.expo.dev/router/introduction/) (dosya tabanlı) |
| Backend | [Supabase](https://supabase.com/) (Postgres + Auth + RPC) |
| Auth | Supabase anonim kimlik doğrulama |
| Animasyonlar | react-native-reanimated |
| State | React hooks (harici state kütüphanesi yok) |
| Test | Jest 30 + React Native Testing Library |
| Linting | ESLint + TypeScript |

## Proje Yapısı

```
split-second/
├── app/                    # Dosya tabanlı routing (expo-router)
│   ├── _layout.tsx         # Ana layout (gesture handler, error boundary, onboarding)
│   ├── (tabs)/             # Tab navigator
│   │   ├── index.tsx       # Ana Sayfa — günlük soru + oylama
│   │   └── profile.tsx     # Profil — istatistikler, geçmiş, seriler
│   └── q/[date].tsx        # Deep link route (tarihe göre)
├── components/             # UI bileşenleri (17)
├── hooks/                  # Custom React hook'ları (10)
├── lib/                    # İş mantığı & yardımcı modüller (15)
├── constants/              # Renk, tipografi token'ları
├── types/                  # TypeScript tip tanımları
├── __mocks__/              # Jest mock'ları (Expo & RN modülleri)
├── supabase/
│   ├── migrations/         # SQL migration'ları (sırayla çalıştır)
│   └── seed.sql            # Örnek soru verileri
├── tasks/                  # Geliştirme notları, planlar, doğrulama raporları
└── assets/sounds/          # Ses efekti dosyaları (manuel ekle)
```

## Kurulum

### Gereksinimler

- [Node.js](https://nodejs.org/) >= 18
- Telefonunda [Expo Go](https://expo.dev/go) uygulaması

### 1. Klonla & Kur

```bash
git clone https://github.com/imgevio/split_second.git
cd split_second
npm install --legacy-peer-deps
```

### 2. Ortam Değişkenleri

Proje kök dizininde `.env` dosyası oluştur:

```env
EXPO_PUBLIC_SUPABASE_URL=https://rsfxbqfvunmzjdwkmyit.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzZnhicWZ2dW5tempkd2tteWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTQ1MDksImV4cCI6MjA4NTg5MDUwOX0.ozK8b0thPmLDvOrBdSOYY_WfFa4ET59l-o0CgqcfaqU
```

> **Not**: Bunlar paylaşılan test ortamı bilgileridir. Anon key, istemci tarafı public bir anahtardır — tüm veriler veritabanında Row Level Security (RLS) ile korunmaktadır. Production'da bu bilgileri KULLANMAYIN.

### 3. Ses Dosyaları (Opsiyonel)

`assets/sounds/` klasörüne kısa ses efektleri ekle:
- `tick.mp3` — geri sayım tik sesi
- `vote.mp3` — oy verme dokunma sesi
- `result.mp3` — sonuç açılış sesi

Uygulama ses dosyaları olmadan da çalışır — sesler sessizce atlanır.

### 4. Çalıştır

```bash
npx expo start
```

Telefonundaki Expo Go ile QR kodu tara.

### Supabase Migration'ları (Sadece Admin)

Sıfırdan Supabase projesi kurman gerekiyorsa, migration'ları SQL editöründe **sırayla** çalıştır:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_streaks.sql
supabase/migrations/003_history_stats.sql
supabase/migrations/004_global_stats.sql
supabase/migrations/005_question_translations.sql
```

Ardından örnek soruları ekle:

```sql
-- Supabase SQL editöründe çalıştır
supabase/seed.sql
```

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm start` | Expo geliştirme sunucusunu başlat |
| `npm test` | Jest test suite'ini çalıştır |
| `npm run test:watch` | Testleri izleme modunda çalıştır |
| `npm run test:coverage` | Testleri kapsam raporuyla çalıştır |
| `npm run lint` | ESLint ile kontrol et |
| `npm run lint:fix` | Lint hatalarını otomatik düzelt |
| `npm run typecheck` | TypeScript tip kontrolü |

## Veritabanı Mimarisi

Uygulama tüm yazma işlemleri için Supabase **atomik RPC fonksiyonları** kullanır — oy gönderimi, sonuç hesaplama ve seri güncellemesi tek bir veritabanı çağrısında gerçekleşir (race condition önlenir).

**Tablolar**: `questions`, `votes`, `user_streaks`
**View'lar**: `question_results` (toplu oy yüzdeleri)
**RPC**: `submit_vote_and_get_results()` — atomik oy + sonuç + seri güncelleme

Tüm tablolarda Row Level Security (RLS) aktiftir. Anonim auth ile her cihaz benzersiz bir kullanıcı ID'si alır.

## Lisans

Özel — Tüm hakları saklıdır.
