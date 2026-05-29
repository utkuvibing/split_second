# Split Second

**[English README](README.md)**

React Native ve Expo ile geliştirilmiş günlük "Hangisini Tercih Edersin?" mobil uygulaması. Her gün **3 soru**: **08:00**, **14:00** ve **20:00** (cihaz yerel saati). Her soruda 10 saniyelik geri sayım; günü tamamlayınca seri ve ödüller.

## Özellikler

- **Günde 3 Soru** — Sabah (08:00), öğle (14:00) ve akşam (20:00) ikilemleri (yerel saat)
- **10 Saniye Geri Sayım** — Her soruda süre dolmadan oy ver
- **Gün Tamamlama** — Bugünün tüm aktif sorularını cevaplayınca gün tamamlanır; seri güncellenir ve mystery box şansı açılır
- **Canlı Sonuçlar** — Oyunu verdikten sonra küresel oy dağılımını gör
- **Seri Takibi** — Günlük oylama serini devam ettir
- **Liderlik Tablosu** — En aktif oyuncular ve en uzun seriler
- **Rozet Sistemi** — 14+ rozet: kilometre taşları, hız ve bağlılık
- **Kişilik Analizi** — Yeterli oy sonrası karar verme stilini keşfet
- **Tema Motoru** — Uygulamayı kişiselleştirmek için 6 görsel tema
- **Kozmetik Mağaza** — Profil çerçeveleri, oy efektleri ve daha fazlası
- **Arkadaşlar & Uyumluluk** — Arkadaş ekle, tercihlerinizi karşılaştırın
- **Paylaşım Kartları** — Oyunu görsel olarak oluştur ve paylaş
- **Deep Link** — Herhangi bir günün sorusuna doğrudan link
- **Çoklu Dil** — Türkçe ve İngilizce, cihaz diline göre otomatik algılama

## Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| Framework | [Expo SDK 54](https://expo.dev/) (React Native) |
| Routing | [expo-router](https://docs.expo.dev/router/introduction/) (dosya tabanlı) |
| Backend | [Supabase](https://supabase.com/) (Postgres + Auth + RPC) |
| Animasyonlar | react-native-reanimated |
| State | React hooks |
| Test | Jest + React Native Testing Library |

## Kurulum

### Gereksinimler

- [Node.js](https://nodejs.org/) >= 18
- Telefonunda [Expo Go](https://expo.dev/go)

### Hazırlık

```bash
git clone https://github.com/utkuvibing/split_second.git
cd split_second
npm install --legacy-peer-deps
```

`.env.example` dosyasını `.env` olarak kopyala ve kendi Supabase proje bilgilerini gir. Ardından `supabase/migrations/` klasöründeki SQL migration'larını sırasıyla Supabase projenizde çalıştırın.

**`.env` dosyasını asla commit etme.** Push öncesi kontrol için (clone başına bir kez):

```bash
git config core.hooksPath .githooks
npm run secrets:check
```

Repoyu public yapmadan önce [docs/public-repo-security.md](docs/public-repo-security.md) dosyasına bak.

### Çalıştır

```bash
npx expo start --tunnel
```

Telefonundaki Expo Go ile QR kodu tara.

## Lisans

Özel — Tüm hakları saklıdır.
