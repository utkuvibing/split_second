# Split Second

**[English README](README.en.md)**

React Native ve Expo ile geliştirilmiş günlük "Hangisini Tercih Edersin?" mobil uygulaması. Her gün bir soru, geri sayım baskısı altında oy ver ve dünyanın nasıl düşündüğünü gör.

## Özellikler

### Temel
- **Günlük Soru** — Her gece yarısı yeni bir "hangisini tercih edersin" sorusu
- **Geri Sayım** — Süre dolmadan oy ver, gerilimi hisset
- **Canlı Sonuçlar** — Oyunu verdikten sonra küresel oy dağılımını gör
- **Seri Takibi** — Günlük oylama serini devam ettir
- **Global İstatistikler** — Bugün kaç kişi oy verdi, genel trendler
- **Liderlik Tablosu** — En aktif oyuncuları ve en uzun serileri gör
- **Rozet Sistemi** — 14+ rozet: ilk oy, seri başarıları, hız şeytanı, gece kuşu ve daha fazlası
- **Oy Sonrası Analizler** — Oylama sonrasında istatistiksel bilgiler ve sonraki rozet ilerlemesi

### Premium & Kozmetik
- **Tema Motoru** — 6 tema: Gece Yarısı (varsayılan), Okyanus, Gün Batımı, Orman, Gül Altını, Noir
- **Kozmetik Mağaza** — Temalar, profil çerçeveleri ve oy efektleri satın al ve tak
- **Premium Abonelik** — Sınırsız geçmiş, detaylı istatistikler, tüm rozetler, analizler (Faz 1: dev stub)
- **Paywall** — Aylık/yıllık plan seçimi (gerçek ödeme Faz 2'de RevenueCat ile gelecek)
- **Geliştirici Araçları** — Premium simülasyonu, tüm kozmetiklere sahip olma toggle'ları (__DEV__ modunda)

### Genel
- **Paylaşım Kartları** — Oyunu görsel olarak oluştur ve paylaş
- **Deep Link** — Herhangi bir günün sorusuna doğrudan link (`split-second://q/2025-01-15`)
- **Çoklu Dil (i18n)** — Cihaz diline göre otomatik algılama (TR + EN)
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
│   ├── _layout.tsx         # Ana layout (ThemeProvider, gesture handler, onboarding)
│   ├── (tabs)/             # Tab navigator
│   │   ├── index.tsx       # Ana Sayfa — günlük soru + oylama
│   │   ├── profile.tsx     # Profil — istatistikler, geçmiş, mağaza, rozetler
│   │   └── leaderboard.tsx # Liderlik Tablosu
│   └── q/[date].tsx        # Deep link route (tarihe göre)
├── components/             # UI bileşenleri (30+)
│   ├── Shop.tsx            # Kozmetik mağaza modali
│   ├── Paywall.tsx         # Premium paywall modali
│   ├── DevMenu.tsx         # Geliştirici araçları (__DEV__)
│   └── ...                 # QuestionCard, ResultBar, BadgeGrid, vb.
├── hooks/                  # Custom React hook'ları (12)
│   ├── usePremium.ts       # Premium durum yönetimi
│   ├── useCosmetics.ts     # Kozmetik sahipliği & takma
│   └── ...                 # useAuth, useVote, useBadges, vb.
├── lib/                    # İş mantığı & yardımcı modüller (19)
│   ├── themes.ts           # 6 tema renk tanımı
│   ├── themeContext.tsx     # ThemeProvider + useTheme hook
│   ├── premium.ts          # Premium kontrol fonksiyonları
│   ├── cosmetics.ts        # Çerçeve & efekt kataloğu
│   └── ...                 # supabase, badges, i18n, share, vb.
├── constants/              # Tipografi token'ları
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
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

> **Not**: Kendi Supabase projenizi oluşturup URL ve anon key bilgilerinizi buraya girin. Proje şeması için `supabase/migrations/` klasöründeki migration dosyalarını sırasıyla çalıştırın. Ayrıca `.env.example` dosyasını referans olarak kullanabilirsiniz.

### 3. Ses Dosyaları (Opsiyonel)

`assets/sounds/` klasörüne kısa ses efektleri ekle:
- `tick.mp3` — geri sayım tik sesi
- `vote.mp3` — oy verme dokunma sesi
- `result.mp3` — sonuç açılış sesi

Uygulama ses dosyaları olmadan da çalışır — sesler sessizce atlanır.

### 4. Çalıştır

```bash
npx expo start --tunnel
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
supabase/migrations/008_premium.sql
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

**Tablolar**: `questions`, `votes`, `user_streaks`, `user_profiles`, `user_cosmetics`, `user_equipped`
**View'lar**: `question_results` (toplu oy yüzdeleri)
**RPC'ler**:
- `submit_vote_and_get_results()` — atomik oy + sonuç + seri güncelleme
- `get_or_create_profile()` — premium profil oluştur/getir
- `get_user_cosmetics()` — sahip olunan kozmetikleri getir
- `purchase_cosmetic()` — kozmetik satın al
- `equip_cosmetic()` — kozmetik tak/çıkar

Tüm tablolarda Row Level Security (RLS) aktiftir. Anonim auth ile her cihaz benzersiz bir kullanıcı ID'si alır.

## Lisans

Özel — Tüm hakları saklıdır.
