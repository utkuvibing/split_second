# Split Second — Core Logic Brief

> Bu belge yalnızca codebase’den çıkarılmıştır. Dosya değiştirilmedi. README ile kod çelişirse ayrıca işaretlenir.

---

# 1. Split Second Aslında Ne?

## Bu oyun / uygulama ne?

**Split Second**, mobil bir **“Hangisini tercih edersin?” (Would You Rather?)** uygulamasıdır. Her soruda iki metin seçenek (**A** ve **B**) sunulur; kullanıcı birini seçer ve küresel oy dağılımını görür.

- Ürün tanımı: `README.md`, `README.tr.md`
- Soru UI: `components/QuestionCard.tsx`
- Veri modeli: `types/database.ts` → `Question`, seçenekler `option_a` / `option_b`

## Kullanıcı ne yapıyor?

1. Uygulamayı açar (ilk seferde onboarding).
2. Bugünün sorularını görür (kilitli olanlar saat gelene kadar bekler).
3. Açık bir soruda **10 saniyelik** geri sayım içinde **A** veya **B** seçer (süre dolarsa rastgele oy gider).
4. Sonuç yüzdelerini görür.
5. Gün içinde diğer slot sorularına geçer; tüm günlük sorular bitince özet, seri, rozet, kutu vb. tetiklenir.
6. İsteğe bağlı: arkadaşlar, liderlik tablosu, community önerileri, canlı etkinlik.

Ana ekran: `app/(tabs)/index.tsx`

## Ana fikir “Hangisini tercih edersin?” mi?

**Evet.** Soru metni + iki seçenek yapısı tüm günlük akışın merkezinde (`Question`, `QuestionCard`, `submit_vote_and_get_results`).

## Günlük oyun mantığı ne?

- Supabase’te `questions` tablosunda **`scheduled_date`** ile planlanmış, **`is_active = true`** sorular çekilir.
- Client bugünü **cihazın yerel takvim günü** ile hesaplar: `getTodayQuestions()` → `lib/questions.ts`
- Sorular **`time_slot`**: `morning` | `afternoon` | `evening` — migration `012_multiple_questions.sql`

## Oyunun ana loop’u ne?

```
Auth → bugünün soruları → slot kilidi kontrolü → oy (A/B, 10 sn) → RPC sonuçları
→ yerel sonuç UI → (gün tamamsa) streak/coin/badge/mystery box/personality
→ gece yarısı yeni gün / yeni scheduled_date soruları
```

---

## README vs kod (kritik çelişki)

| Kaynak | İddia |
|--------|--------|
| `README.md` L5, L9 | **“One question per day”**, “Daily Question” at midnight |
| `README.tr.md` | **“Her gün bir soru”** |
| **Kod + `012_multiple_questions.sql`** | Günde **slot başına bir soru**, en fazla **3 slot/gün** (`morning`, `afternoon`, `evening`), unique `(scheduled_date, time_slot)` |

**Gerçek davranış:** Günde **3 soruya kadar** (DB’de o gün için 3 aktif satır varsa). Ana ekran `QuestionCarousel` ile yatay kaydırmalı çoklu soru (`app/(tabs)/index.tsx`).

Eski tek-soru API hâlâ var: `getTodayQuestion()` = `getTodayQuestions()[0]` (`lib/questions.ts`) — çoğu akış çoklu soru kullanıyor.

---

# 2. Oyunun Ana Döngüsü

## Adım adım (dosya referanslı)

| Adım | Ne olur | Dosya / fonksiyon |
|------|---------|-------------------|
| 1 | Uygulama açılır; splash | `app/_layout.tsx`, `expo-splash-screen` |
| 2 | Onboarding tamamlanmamışsa 4 slayt | `hooks/useOnboarding.ts`, `components/Onboarding.tsx`, AsyncStorage `onboarding_complete` |
| 3 | Auth: oturum yoksa anonim giriş | `lib/auth.ts` → `initAuth()`, `hooks/useAuth.ts` |
| 4 | Bugünün soruları çekilir | `hooks/useTodayQuestions.ts` → `getTodayQuestions()` |
| 5 | Her soru için kilit: `!isQuestionUnlocked(time_slot)` | `lib/questions.ts`, `carouselItems` in `index.tsx` |
| 6 | Açık soruda `QuestionCard` + 10 sn sayaç | `components/QuestionCarousel.tsx`, `useCountdownTimer` |
| 7 | Oy → RPC | `handleVote` → `useMultiVote.submitVote` → `lib/votes.ts` → `submit_vote_and_get_results` |
| 8 | Sonuç JSON: sayılar, streak, coin, `all_today_voted` | `types/database.ts` → `VoteResults`, migration `012` |
| 9 | `voteStates`, `lastVoteResult` güncellenir | `app/(tabs)/index.tsx` |
| 10 | Sonuç UI: `ResultBars` | `components/ResultBar.tsx` |
| 11 | `all_today_voted` ise rozet + mystery box kontrolü | `index.tsx` `useEffect` on `lastVoteResult` |
| 12 | Personality recalc (eşik sonrası) | `hooks/usePersonality.ts`, `recalcPersonality` |
| 13 | Tüm sorular oylandıysa “gün tamamlandı” | `allVoted && lastVoteResult` branch |
| 14 | Paralel: canlı etkinlik banner/modal | `hooks/useLiveEvent.ts`, `LiveEventBanner`, `LiveEventModal` |

## UI modları (`app/(tabs)/index.tsx`)

```
loading → error → NoQuestion (0 soru) → QuestionCarousel (oynanıyor)
→ kısmi sonuç (lastVoteResult && kilitli slot kaldı)
→ gün tamam (allVoted && lastVoteResult)
```

---

# 3. Günlük Soru Kuralı

## Bir günde kaç soru?

- **Teorik üst sınır:** 3 (`time_slot` başına 1) — `012_multiple_questions.sql`
- **Pratik:** `getTodayQuestions()` o gün için DB’deki tüm `is_active` satırlarını döner; 1 veya 2 satır da olabilir (seed/admin’e bağlı).

## Sorular hangi saatlerde açılıyor?

`lib/questions.ts` → `UNLOCK_HOURS` (**cihaz yerel saati**, `Date.getHours()`):

| Slot | Saat |
|------|------|
| `morning` | **08:00** |
| `afternoon` | **14:00** |
| `evening` | **20:00** |

- Kilit kontrolü: `isQuestionUnlocked(timeSlot)`
- Kilit geri sayımı: `getSecondsUntilUnlock`, `hooks/useCountdownToUnlock.ts`, `components/LockedQuestionCard.tsx`
- Bildirimler aynı saatlerde: `lib/notifications.ts` → `scheduleDailyReminders()` (08:00, 14:00, 20:00)

## Kilitli soru davranışı

- Carousel’de `LockedQuestionCard` gösterilir; oy verilemez (`QuestionCarousel` → `item.isLocked`).
- Metin: `t('questionUnlocksAt')` + `getUnlockHour` — `components/LockedQuestionCard.tsx`
- Saat gelince `onUnlock` → `refetch` (`index.tsx` → `onRefresh={refetch}`)

## Kilit açılmadan oy verilebilir mi?

**Ana ekranda hayır** — `isLocked` true iken `QuestionCard` render edilmez.

**İstisna:** Deep link ekranı `app/q/[date].tsx` slot kilidi **kontrol etmez**; tarihe göre soru çeker ve oy alır.

## Günün tamamlanması için kaç oy?

| Katman | Kural |
|--------|--------|
| **UI `allVoted`** | `questions` listesindeki **her** soru için `voteStates[id].hasVoted` — `index.tsx` |
| **RPC `all_today_voted`** | Bugün (`CURRENT_DATE` **sunucu**) için tüm **aktif** sorulara en az bir oy; `v_today_voted >= v_today_questions` — `012_multiple_questions.sql` |

**Önemli:** RPC sunucu tarihini kullanır; soru listesi client yerel tarihini. Gece yarısı / saat dilimi farkında UI ile RPC ayrışabilir.

**Streak / gün bonusu / mystery box / badge (günlük tamamlama):** `results.all_today_voted` (RPC) — `index.tsx` L227–254.

## `all_today_voted` kullanım yerleri

- `types/database.ts` → `VoteResults.all_today_voted`
- `submit_vote_and_get_results` dönüşü — `012_multiple_questions.sql`
- `app/(tabs)/index.tsx` → badge `checkNewUnlocks`, `checkDrop` (mystery box) yalnızca `all_today_voted` iken

---

# 4. Oy Verme Kuralları

## Kullanıcı nasıl oy veriyor?

- Dokunma: `QuestionCard` → `onVote('a' | 'b')` — `components/QuestionCard.tsx`
- Carousel: `QuestionCarousel.handleVote` → `onVote(questionId, choice)` — `index.tsx`
- Otomatik: 10 sn dolunca `handleTimerExpire` → rastgele `a` veya `b` — `QuestionCarousel.tsx` L107–112

## Seçenekler

Sadece **`'a'` | `'b'`** — DB `votes.choice` CHECK, RPC parametreleri.

## Aynı soruya ikinci oy?

**Hayır.** `votes` tablosu `UNIQUE (user_id, question_id)` — `001_initial_schema.sql`.

- RPC INSERT duplicate’ta hata → `submitVote` `null` döner — `lib/votes.ts`
- UI: `hasVoted` / `disabled={submitting || hasVoted}` — `QuestionCarousel`, `QuestionCard`

## Oy süresi ölçümü

- `useMultiVote` (`index.tsx` altı): `markShown(questionId)` → `questionShownAt` kaydı
- Oy anında: `elapsed = (Date.now() - shownAt) / 1000` → `submitVote(..., elapsed)` — `lib/votes.ts` → `p_vote_time`
- DB: `votes.vote_time_seconds` — migration `010_personality.sql`, RPC `012`

## `voteTimeSeconds` ne işe yarıyor?

- Personality eksenlerinde **hız** skoru (`lib/personality.ts`, `get_personality_context` / client `calculateAxes`)
- Rozet `speed_demon`: `vote_time_seconds < 3` — `lib/badges.ts`, `checkNewUnlocks({ vote_hour })` (client tarafı `vote_time_seconds` merge edilir)

## Local state oy sonrası

`index.tsx` → `voteStates[questionId]`: `hasVoted: true`, `userChoice`, `results`, `coinsEarned`  
`lastVoteResult`: son oy özeti (sonuç ekranı için)

## Backend çağrısı

`lib/votes.ts` → `supabase.rpc('submit_vote_and_get_results', { p_question_id, p_choice, p_vote_time })`

Güncel mantık: **`012_multiple_questions.sql`** (önceki `001`, `002`, `010` üzerine evrilmiş).

## Sonuç dönüşü (`VoteResults`)

- `count_a`, `count_b`, `total`, `success`
- Opsiyonel: `current_streak`, `longest_streak`, `total_votes`, `coins_earned`, `total_coins`, `votes_today`, **`all_today_voted`**

## Oy başarısız olursa

- RPC hata / duplicate → `submitVote` → `null` — `lib/votes.ts`
- `handleVote`: `submitting` geri alınır, `hasVoted` false kalır — `index.tsx` L208–212
- Kullanıcıya özel hata toast’ı bu akışta **yok** (sessiz başarısızlık)

---

# 5. Sonuç Gösterme Mantığı

## Ne zaman gösterilir?

| Durum | Ekran | Koşul |
|--------|--------|--------|
| Tek oy sonrası, hâlâ açık cevapsız soru yok, kilitli slot var | Kısmi sonuç + ilerleme banner | `lastVoteResult && !hasAnyUnvotedUnlocked` |
| Tüm liste oylandı | Gün tamamlandı özeti | `allVoted && lastVoteResult` |
| Carousel aktif | Sonuç yok, soru kartı | `hasAnyUnvotedUnlocked` |

## Yüzde hesabı

`ResultBars`: `percentA = round(countA/total*100)`, `percentB` aynı — `components/ResultBar.tsx` L58–59

## Kullanıcı tarafı vurgusu

`ResultBar` → `isUserChoice={userChoice === 'a'|'b'}` — animasyonlu bar + etiket  
`SocialProofBadge`: kullanıcının yüzdesi ≥50 majority, değilse minority mesajı

## ShareCard

`components/ShareCard.tsx` — gizli view’da screenshot; `shareImage(shareCardRef)` — gün tamam / kısmi sonuç ekranlarında `index.tsx`  
Alanlar: soru metni, option A/B, percentA/B, `userChoice`

## Kategori içgörüsü

`getCategoryInsight(category)` — `ResultBars` içinde (premium kapıları başka yerde olabilir)

---

# 6. Streak Sistemi

## Streak neye göre artıyor?

**Günlük tamamlama + ardışık takvim günleri** (sunucu `CURRENT_DATE`):

- `012`: Streak **yalnızca** `v_all_today_voted` true ve bugün streak henüz güncellenmemişse
- Dün oy verilmiş seri günü: `current_streak + 1`
- Boşluk: streak `1`’e reset
- İlk kullanıcı: streak 0 başlar; ilk **tam gün** bitince streak 1

(`002_streaks.sql` her oyda streak güncelliyordu; **012 bunu değiştirdi**.)

## Current / longest streak kaynağı

- Oy RPC yanıtı: `VoteResults.current_streak`, `longest_streak`
- Profil / ayrı okuma: `lib/streaks.ts` → `getUserStreak()` → `user_streaks` tablosu

## Milestone

- Client: `MILESTONES = [3, 7, 14, 30, 50, 100]` — `lib/streaks.ts`
- `isNewMilestone(currentStreak)` → confetti — `index.tsx` gün tamam ekranı
- Coin bonusları RPC’de streak 3/7/14/30 **gün tamamlanınca** — `012` L159–167

## Streak reminder

`scheduleStreakReminder(currentStreak)` — yalnızca `currentStreak >= 3`, günlük 21:00 — `lib/notifications.ts`, `index.tsx` post-vote effect

## StreakBadge

Gün tamam / sonuç ekranında `results.current_streak > 0` — `components/StreakBadge.tsx`, `index.tsx`

---

# 7. Coin ve Reward Mantığı

## Coin ne zaman kazanılır? (SQL `012` + diğer RPC’ler)

| Kaynak | Miktar (kodda görülen) |
|--------|------------------------|
| Her günlük soru oyu | **+5** (`v_coins_earned := 5` başlangıç) |
| Gün tamamlanınca (streak güncelleme anı) | **+5** ek |
| Streak milestone aynı gün | +5 (3), +15 (7), +25 (14), +50 (30) |
| Live event oy | `coin_reward` (varsayılan **20**) — `017_live_events.sql` |
| Rozet unlock RPC | **+20** — `award_badge_coins` (006+) |
| Share | **+5**, günde 1 — migration `009_coins.sql` (referans) |
| Mystery box açılışı | Rarity’ye göre rastgele coin aralığı — `015` / `022` |

Frontend özet sabitleri: `lib/coins.ts` → `COIN_REWARDS` (UI metinleri için; kutu içi miktar sunucuda rastgele).

## Her oy coin verir mi?

**Evet**, günlük soru oyu başına en az 5 (RPC her başarılı `submit_vote_and_get_results`).

## Shop / cosmetic bağlantısı

- Coin harcama: `COIN_PRICES`, `purchase_cosmetic_with_coins` — `lib/coins.ts`, `components/Shop.tsx`
- Community soru gönderme: **50** coin — `COIN_COSTS.submit_question`, `016` / `023`
- Nickname değişimi: **100** coin — `COIN_COSTS.change_nickname`, `019_nickname_cost.sql`

## Coin UI

- `hooks/useCoins.ts` → `user_profiles.coins`
- Profile, Shop, Community submit, coin toast’ları — `app/(tabs)/profile.tsx`, `index.tsx`

## `double_coins` boost

Mystery box epic/legendary ödülü olarak `user_boosts` kaydı oluşabilir — **oy RPC’leri bu boost’u okumuyor** (kodda uygulanmıyor; edge case).

---

# 8. Badge Sistemi

## Ne işe yarıyor?

Oy alışkanlığı, hız, seri, çoğunluk/azınlık, kategori çeşitliliği vb. için **kalıcı rozetler** — `lib/badges.ts` → `BADGES[]`

## Ne zaman kontrol?

`app/(tabs)/index.tsx`: `lastVoteResult` effect içinde, **`results.all_today_voted`** ve `badgeCheckDone` false iken:

```ts
checkNewUnlocks({ vote_hour: hour })
```

**Her tek oyda değil** — günlük tüm aktif sorular tamamlanınca (RPC bayrağı).

## Nasıl çalışır?

1. `fetchBadgeContext()` → RPC `get_badge_context()` — `006_badges.sql`
2. Client `vote_hour` (ve teoride `vote_time_seconds`) merge — `hooks/useBadges.ts`
3. Her `BADGES` için `badge.check(ctx)` → true ise `unlockBadge(id)`
4. İlk yeni rozet → `BadgeUnlockToast` — `index.tsx`

## `getNextBadgeProgress`

`lib/badges.ts` — henüz açılmamış, `progress` fonksiyonu olan ilk rozet için `{ current, target }` — `PostVoteInsights` — `index.tsx`

## Premium rozetler

`PREMIUM_BADGE_IDS` — `lib/premium.ts`; free kullanıcı UI’da `FREE_BADGE_IDS` ile sınırlı görünüm

## Kod–SQL boşlukları (gerçek)

`BadgeContext` alanları (`boxes_opened`, `live_events_joined`, `questions_submitted`, …) client’ta tanımlı ama **`get_badge_context()` SQL’de dönmüyor** — `006_badges.sql` yalnızca: `total_votes`, `majority_count`, `rebel_count`, `categories`, streak.

Bu yüzden `box_opener`, `lucky`, `creator`, `live_voter` vb. **mevcut RPC ile unlock olmaz** (kod yazılmış, veri yok).

---

# 9. Mystery Box Sistemi

## Ne?

Rastgele düşen, açılınca coin / kozmetik / boost veren kutu — `lib/mysteryBox.ts`, tablo `user_mystery_boxes` — `015_mystery_boxes.sql`

## Ne zaman düşer?

`index.tsx`: **`results.all_today_voted`** sonrası, günde bir kez kontrol akışı (`badgeCheckDone` ile aynı blok) → `checkDrop()` → RPC `check_mystery_box_drop`

**Her oyda değil** — günlük tamamlama sonrası.

## Drop kuralları (`022_mystery_box_daily_limit.sql` özeti)

- Son **24 saat** içinde kutu oluşturulmuşsa drop yok
- `user_streaks` yoksa drop yok
- Pity: `votes_since_box` artar; şans `15% + 5%*(votes_since-1)`; **10. denemede garanti**
- Rarity: common 60%, rare 25%, epic 10%, legendary 5%
- `source: 'vote'`

## Açılış (`open_mystery_box`)

| Rarity | Ödül örnekleri (migration) |
|--------|----------------------------|
| common | 10–20 coin |
| rare | coin veya kozmetik `aurora`/`galaxy` |
| epic | coin, `diamond`/`rainbow`, veya `double_coins` 1h |
| legendary | coin, `phoenix`/`supernova`, veya `double_coins` 1h |

## Açmazsa?

Kutu envanterde kalır — `MysteryBoxInventory`, `hooks/useMysteryBox.ts` (profile tarafı)

## UI akışı

`MysteryBoxDrop` → kullanıcı açar → `openBox` → `MysteryBoxOpenModal` — `index.tsx`

---

# 10. Personality Sistemi

## Ne?

4 eksen + 8 tip ile “karar verme stili” — `lib/personality.ts`

## Kaç oy sonra?

`PERSONALITY_UNLOCK_VOTES = 6` — `lib/personality.ts`  
**Not:** `hooks/usePersonality.ts` yorumu “>= 7 votes” diyor — **kod 6 kullanıyor** (çelişki).

## Hangi veriler?

RPC `get_personality_context()` — `010_personality.sql`: toplam oy, majority/rebel sayıları, kategori çeşitliliği, ortalama oy süresi, çarpık sorularda azınlık yüzdesi vb.  
Client: `calculateAxes`, `determineType`, `save_personality`

## İlk reveal

`usePersonality`: `total_votes >= 6` ve `current_type === 'unknown'` → hesapla + kaydet → `isFirstReveal`  
`index.tsx`: `recalcPersonality()` sonra `isFirstReveal` → 2 sn gecikmeyle `PersonalityRevealModal`

## Tip nerede?

`user_profiles` / personality RPC’leri — `save_personality`, `fetchPersonalityContext` — `lib/personality.ts`

## Matching tab

`app/(tabs)/matching.tsx` — `useCompatibility(axes)` eksen benzerliği; personality unlock şart

---

# 11. Friends / Compatibility / Social

## Arkadaş sistemi

- Var — `lib/friends.ts`, `014_friend_requests.sql`
- Friend code, istek gönder/kabul — `components/AddFriendModal`, `FriendRequestsList`
- **Free limit: 3 arkadaş** — `FREE_FRIEND_LIMIT` — `lib/friends.ts`, `lib/premium.ts`
- Premium: `unlimitedFriends` — `PREMIUM_FEATURES`

## FriendVotesFeed

Son oy verilen günlük soruda arkadaşların **A/B seçimlerini** gösterir — `hooks/useFriendVotes.ts`, `components/FriendVotesFeed.tsx`, `index.tsx` gün tamam ekranı

## İki “uyumluluk” sistemi

1. **Oy eşleşme %** — `get_friends_list` / friends RPC: ortak sorularda aynı seçim yüzdesi; **≥3 ortak soru** yoksa skor yok — `lib/friends.ts`
2. **Personality eksenleri** — `lib/compatibility.ts`, `calculateCompatibility`, `hooks/useCompatibility.ts`, Matching tab

## Challenge / deep link

- Link: `split-second://q/{date}?slot=` opsiyonel — `lib/deeplink.ts`
- Paylaşım: `ChallengeButton` → `shareChallenge` — `index.tsx`
- Hedef ekran: `app/q/[date].tsx` — **slot kilidi yok**, 10 sn timer, `useVote`, bitince `router.replace('/')`

---

# 12. Live Event Mantığı

## Nedir?

Zaman sınırlı, tek soruluk **FOMO** etkinlik — tablo `live_events` — `017_live_events.sql`

## Günlük sorudan farkı

- Ayrı tablo / RPC; `scheduled_date` / `time_slot` yok
- `starts_at` / `ends_at` aralığında aktif
- Gerçek zamanlı sayaç: `live_event_votes` + Supabase realtime — `hooks/useLiveEvent.ts` → `subscribeLiveVotes`

## Ne zaman aktif?

`get_live_event()`: `starts_at <= now() < ends_at` → `status: 'active'`  
Yoksa 24 saat içindeki yaklaşan → `status: 'upcoming'` (sayılar yok)

## Oy

`submit_live_event_vote` — etkinlik aktif, kullanıcı başına **1 oy** (`UNIQUE(event_id, user_id)`)

## Coin

`coin_reward` (default 20) → `user_profiles.coins` — `017` L151–154

## `mystery_box_guaranteed`

Kolon ve `get_live_event` yanıtında var — **`submit_live_event_vote` kullanmıyor** (ölü alan).

## UI

`LiveEventBanner` + `LiveEventModal` — `index.tsx`; modal yalnızca `status === 'active'`

---

# 13. Community Questions Mantığı

## Kullanıcı soru önerebilir mi?

**Evet** — `submitCommunityQuestion` → RPC `submit_community_question` — `lib/communityQuestions.ts`

## Maliyet / limit

- **50 coin** — `COIN_COSTS.submit_question`, `016`
- **Günde 1 gönderim** — `023_community_daily_limit_1.sql`

## Onay

`status`: `pending` | `approved` | `rejected` | `promoted` — `016`  
Feed: `pending` ve `approved` görünür — RPC `get_community_questions`  
**Otomatik günlük soruya dönüşüm kodu bu migration’larda yok** — community **ayrı havuz**.

## Community tab

`app/(tabs)/community.tsx` — sıralama hot/new/top, up/down/report, `SubmitQuestionModal`

## Günlük sorularla bağ

**Doğrudan bağlı değil** — ayrı `community_questions` tablosu; günlük carousel `questions` tablosu.

---

# 14. Ekran Akışı (kullanıcı gözüyle)

| Ekran | Amaç | Ne gösterir | State / koşul | Dosya |
|--------|------|-------------|---------------|--------|
| Splash / gate | Yükleme | Boş veya onboarding | `useOnboarding.loading` | `app/_layout.tsx` |
| Onboarding | Tanıtım | 4 slayt | `showOnboarding` | `components/Onboarding.tsx` |
| Today — loading | Bekleme | Spinner | `authLoading \|\| questionLoading` | `index.tsx` |
| Today — oy | Ana oyun | Carousel, timer, canlı banner | Soru var, oy süreci | `index.tsx`, `QuestionCarousel` |
| Today — kilitli slot | Bekleme | Kilit + geri sayım | `isLocked` | `LockedQuestionCard` |
| Today — kısmi sonuç | Ara özet | ResultBars, ilerleme, kutu teaser | `lastVoteResult`, kilitli slot kaldı | `index.tsx` |
| Today — gün tamam | Tamamlama | Sonuç, streak, rozet, kutu, paylaş | `allVoted` | `index.tsx` |
| Today — soru yok | Boş gün | `NoQuestion` | `questions.length === 0` | `components/NoQuestion.tsx` |
| Leaderboard | Rekabet | Global / friends sıralama | `activeTab` | `app/(tabs)/leaderboard.tsx` |
| Matching | Sosyal analiz | Uyumluluk kartları | personality unlock + friends | `app/(tabs)/matching.tsx` |
| Community | UGC | Öneri listesi, submit | `useCommunityQuestions` | `app/(tabs)/community.tsx` |
| Profile | Hub | Stats, rozet, shop, arkadaş | çok hook | `app/(tabs)/profile.tsx` |
| Challenge / deep link | Tek soru linki | Oy + sonuç | `date`, `slot?` | `app/q/[date].tsx` |
| Live event modal | FOMO oy | A/B + sayaç | `liveEvent.status === 'active'` | `LiveEventModal` |
| 404 | Hata | Mesaj | bilinmeyen route | `app/+not-found.tsx` |

**Tab sırası:** Leaderboard → Matching → **Today (merkez)** → Community → Profile — `app/(tabs)/_layout.tsx`

---

# 15. Core State Mantığı (`app/(tabs)/index.tsx`)

| State | Ne tutar |
|-------|----------|
| `voteStates` | `Record<questionId, { userChoice, results, hasVoted, submitting, coinsEarned }>` |
| `lastVoteResult` | Son oy için tam özet (sonuç ekranı verisi) |
| `allVoted` | `questions.every(q => voteStates[q.id]?.hasVoted)` |
| `votedCount` | `questions.filter(hasVoted).length` |
| `hasAnyUnvotedUnlocked` | Carousel’de oy verilebilir açık soru var mı |
| `carouselItems` | `{ question, hasVoted, isLocked: !isQuestionUnlocked(time_slot) }` |
| `badgeCheckDone` | Rozet/kutu kontrolünün günde bir kez |
| `personalityCheckDone` | Personality recalc bir kez |

## `useMultiVote` (aynı dosya altı)

| Parça | Rol |
|-------|-----|
| `questionShownAt` | Soru ID → ilk gösterilme zamanı (ms) |
| `markShown(id)` | Timer süresi ölçümü başlatır |
| `submitVote(id, choice)` | elapsed saniye ile `lib/votes.submitVote` |

**İlişki:** Carousel aktif karta geçince `markShown` (unlocked + not voted effect); oy `handleVote` → `submitVoteFn`.

---

# 16. Backend Mantığı (yalnızca oyun kuralları)

| Backend objesi | Oyun kuralındaki rolü | Hangi kod kullanıyor |
|----------------|----------------------|----------------------|
| `questions` | Günlük soru metni, tarih, slot, aktiflik | `getTodayQuestions`, admin/seed |
| `votes` | Kullanıcı başına soru başına 1 oy, choice, süre | `lib/votes.ts`, RPC insert |
| `question_results` (view) | Soru bazlı A/B sayıları | `getResults` |
| `user_streaks` | Seri, toplam oy, kutu pity | RPC `012`, `lib/streaks.ts` |
| `user_profiles` | Coin, nickname, personality type | coins, profile |
| `user_badges` | Kazanılan rozetler | `fetchUserBadges`, `unlock_badge` |
| `user_mystery_boxes` | Kutu envanteri | `useMysteryBox` |
| `live_events` / `live_event_votes` | Zamanlı etkinlik | `lib/liveEvents.ts` |
| `community_questions` | Kullanıcı önerileri | `lib/communityQuestions.ts` |
| `friendships` / friend requests | Sosyal limit | `lib/friends.ts` |
| `submit_vote_and_get_results` | Oy + sonuç + streak + coin + `all_today_voted` | `lib/votes.ts` |
| `get_badge_context` | Rozet kontrol verisi | `hooks/useBadges.ts` |
| `check_mystery_box_drop` / `open_mystery_box` | Kutu düşür/aç | `lib/mysteryBox.ts` |
| `get_live_event` / `submit_live_event_vote` | Canlı etkinlik | `lib/liveEvents.ts` |
| `submit_community_question` | 50 coin, 1/gün | `useSubmitQuestion` |

## Duplicate vote engeli

DB `UNIQUE (user_id, question_id)` — `001_initial_schema.sql`  
RLS: kullanıcı yalnızca **kendi** oyunu INSERT; UPDATE/DELETE yok — değiştirme yok.

## Daily schedule

Kod **otomatik soru üretmez**; `scheduled_date` + `time_slot` ile **seed/admin** doldurur (`supabase/seed*.sql`, `docs/migration-runbook.md`).

---

# 17. Edge Case’ler

| Durum | Davranış |
|-------|----------|
| Bugün soru yok | `NoQuestion` — `index.tsx` |
| Auth başarısız | `useTodayQuestions` fetch yapmaz; loading/auth gate |
| Daha önce oy vermiş | `getUserVote` ile `hasVoted`; sonuç yüklenir — `index.tsx` load effect |
| Slot kilitli | `LockedQuestionCard`; oy yok |
| RPC fail / null | `submitting` false; kullanıcı mesajı yok |
| Duplicate vote | DB hata; client null |
| Gün tamamlanmadan mystery box | `checkDrop` çağrılmaz (`all_today_voted` şart) |
| Client gece yarısı vs sunucu `CURRENT_DATE` | `all_today_voted` / streak vs `getTodayQuestions` tarihi uyumsuz olabilir |
| Deep link geçmiş gün | Kilitsiz oy mümkün `app/q/[date].tsx` |
| README 1 soru vs kod 3 | Ürün beklentisi karışıklığı |
| Badge’ler eksik context | Bazı rozetler hiç açılmaz |
| `double_coins` boost | Kayıt var, oy ekonomisine uygulanmıyor |
| Timer expire | Rastgele A/B — kullanıcı “seçmedi” sayılır ama oy gider |

---

# 18. Oyunun Basit Mental Modeli

**Split Second şudur:**

Her gün veritabanında planlanmış **en fazla 3** “hangisini tercih edersin” sorusu vardır (`morning` 08:00, `afternoon` 14:00, `evening` 20:00 — **telefon saati**).

Kullanıcı açık soruda **10 saniye** içinde **A veya B** seçer (süre dolarsa rastgele seçilir). Oy sunucuya gider; küresel yüzdeler döner.

**Günün tüm aktif sorularına** oy verince (`all_today_voted`) seri güncellenir, ekstra coin ve rozet kontrolü çalışır; ardından şansla **mystery box** düşebilir.

**6+** toplam oy sonrası **personality** hesaplanabilir. Arkadaşlarla oy eşleşmesi veya personality eksenleriyle **uyumluluk** görülür.

**Community** ve **live event** günlük döngünün yanında ayrı sistemlerdir.

*(README hâlâ “günde 1 soru” der; oyun kodu 3 slot mantığıyla çalışır.)*

---

# 19. Benim Hatırlamam Gereken En Önemli 20 Şey

1. **Gerçek günlük model = 3 slot** (`012`), README tek soru diyor — çelişki.
2. Açılış saatleri: **8 / 14 / 20** yerel — `lib/questions.ts`.
3. Oy süresi UI: **10 sn** — `QuestionCarousel.tsx`.
4. Soru başına **1 oy** — DB unique.
5. **Streak** = sunucuda günün **tüm aktif** soruları tamamlanınca — `012`.
6. **`all_today_voted`** = rozet + mystery box tetikleyici — `index.tsx`.
7. Her oy **+5 coin**; gün bitince +5 ve seri bonusları — `012`.
8. Mystery box **günlük tamamlama sonrası**, 24h cooldown + pity — `022`.
9. Personality eşiği **6 oy** (yorum 7 diyor) — `lib/personality.ts`.
10. Auth = **anonim** Supabase — `lib/auth.ts`.
11. Deep link **kilit kontrolü yapmaz** — `app/q/[date].tsx`.
12. Live event **ayrı** tablo, tek oy, varsayılan 20 coin — `017`.
13. Community **50 coin, 1/gün**, günlük sorudan ayrı — `016`/`023`.
14. Free kullanıcı **max 3 arkadaş** — `lib/premium.ts`.
15. `vote_time_seconds` → hız rozeti + personality — `010`.
16. Timer bitince **random oy** — kullanıcı deneyimi açısından önemli.
17. Sonuç yüzdeleri RPC’den aggregate — `question_results`.
18. Bazı badge’ler **SQL context eksik** — unlock olmaz.
19. Client bugün tarihi ≠ sunucu `CURRENT_DATE` riski.
20. Sorular **seed/admin** ile gelir; uygulama üretmez.

## En kritik 15 dosya

1. `app/(tabs)/index.tsx` — ana oyun state machine  
2. `lib/questions.ts` — slot saatleri, bugünün soruları  
3. `lib/votes.ts` — oy RPC  
4. `components/QuestionCarousel.tsx` — timer + carousel  
5. `supabase/migrations/012_multiple_questions.sql` — ekonomi + streak + `all_today_voted`  
6. `types/database.ts` — tipler  
7. `lib/badges.ts` — rozet kuralları  
8. `lib/mysteryBox.ts` — kutu  
9. `lib/personality.ts` — kişilik  
10. `lib/liveEvents.ts` — canlı etkinlik  
11. `lib/communityQuestions.ts` — community  
12. `lib/friends.ts` + `lib/compatibility.ts` — sosyal  
13. `app/_layout.tsx` — onboarding gate  
14. `app/q/[date].tsx` — deep link  
15. `supabase/migrations/001_initial_schema.sql` — temel oy unique  

## Devam ederken ilk bakılacak 10 mantık noktası

1. `UNLOCK_HOURS` değişti mi?  
2. Bugün DB’de kaç `questions` satırı var?  
3. `submit_vote_and_get_results` dönüş alanları  
4. `allVoted` vs `all_today_voted` farkı  
5. Timer 10 sn + auto-vote  
6. Streak RPC (`012`) vs eski `002` dokümantasyonu  
7. Mystery box `checkDrop` şartları  
8. Badge `get_badge_context` alanları  
9. Personality `PERSONALITY_UNLOCK_VOTES`  
10. Live event zaman penceresi  

---

# 20. Açık Sorular (ürün kararları — kod cevaplamaz)

1. **Final ürün günde 1 soru mu, 3 mü?** README 1; kod 3 slot. Hangisi doğru ürün?
2. **Kilitli slot varken RPC `all_today_voted`** sunucuda 3 soru sayıyorsa, kullanıcı 1–2 oy verip gün bonusu alabilir mi? (Evet, teorik — `012` sayımı kilitle uyumsuz.)
3. **Mystery box** kalıcı feature mı, pity oranları doğru mu?
4. **Coin/shop** gerçek monetization mı yoksa sadece retention?
5. **Anonymous auth** production için yeterli mi? Hesap bağlama planı var mı?
6. **TR odaklı mı global mi?** i18n var; içerik/seed dili?
7. **Live event** ana feature mı yan mı? `mystery_box_guaranteed` kullanılacak mı?
8. **Community approved** sorular günlük havuza girecek mi?
9. **Deep link** geçmiş günlere sınırsız oy — istenen mi?
10. **Saat dilimi:** tamamen yerel mi, TR sabit mi, sunucu UTC mi?
11. **10 sn zorunlu timer** — her zaman mı, ayarlanabilir mi?
12. **Eksik badge context** — SQL mi genişletilecek client mı sadeleştirilecek?
13. **`double_coins` boost** uygulanacak mı?
14. **Premium** gerçek ödeme mi `__DEV__` simülasyon mu?
15. **Personality eşiği** 6 mı 7 mi?

---

*Belge oluşturma tarihi: codebase analizi — `hermes-v1` dalı, migration’lar ve listelenen kaynak dosyalar.*
