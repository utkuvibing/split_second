# Split Second

**[English README](README.md)**

React Native ve Expo ile geliştirilmiş günlük "Hangisini Tercih Edersin?" mobil uygulaması. Her gün bir soru, geri sayım baskısı altında oy ver ve dünyanın nasıl düşündüğünü gör.

## Özellikler

- **Günlük Soru** — Her gece yarısı yeni bir "hangisini tercih edersin" ikilemi
- **Geri Sayım** — Süre dolmadan oy ver, gerilimi hisset
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

### Çalıştır

```bash
npx expo start --tunnel
```

Telefonundaki Expo Go ile QR kodu tara.

## Lisans

Özel — Tüm hakları saklıdır.
