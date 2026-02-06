import { getLocales } from 'expo-localization';

type Language = 'tr' | 'en';

function getDeviceLanguage(): Language {
  try {
    const locales = getLocales();
    const lang = locales[0]?.languageCode;
    return lang === 'tr' ? 'tr' : 'en';
  } catch {
    return 'en';
  }
}

const currentLang: Language = getDeviceLanguage();

const tr = {
  // Tabs
  tabToday: 'Bugün',
  tabLeaderboard: 'Sıralama',
  tabProfile: 'Profil',

  // App
  appName: 'Split Second',

  // Home - error
  somethingWentWrong: 'Bir şeyler ters gitti',
  tryAgain: 'Tekrar Dene',

  // Voting
  swipeHint: '← Kaydır veya butonlara bas →',

  // Results
  socialProofMajority: 'Oylayanların %{percent}\'i ile aynı düşünüyorsun!',
  socialProofMinority: 'Cesur seçim! Sadece %{percent} bunu seçti!',
  totalVotesLabel: '{count} toplam oy',
  voteSingular: 'oy',
  votePlural: 'oy',
  share: 'Paylaş',
  story: 'Story',
  challengeFriend: '🎯 Arkadaşa Meydan Oku',

  // Countdown
  nextQuestionIn: 'Sonraki soru',

  // No question
  noQuestionToday: 'Bugün soru yok',
  comeBackTomorrow: 'Yarın yeni bir ikilem için geri gel!',

  // Streak
  dayStreak: 'günlük seri',
  nextGoal: 'Sonraki hedef: {milestone} gün!',
  longestStreakLabel: 'En uzun seri: {streak} gün',

  // Profile
  statistics: 'İstatistikler',
  pastVotes: 'Geçmiş Oylar',
  noVotesYet: 'Henüz oy vermedin',
  castFirstVote: 'Bugün sekmesinden ilk oyunu ver!',

  // Stats grid
  totalVotesStat: 'Toplam Oy',
  dailyStreak: 'Günlük Seri',
  longestStreakStat: 'En Uzun Seri',
  withMajority: 'Çoğunlukla',
  favoriteCategory: 'Favori Kategori',

  // Categories
  catSuperpower: 'Süper Güç',
  catLifestyle: 'Yaşam',
  catPhilosophy: 'Felsefe',
  catTechnology: 'Teknoloji',
  catFood: 'Yemek',
  catSkills: 'Yetenek',
  catPersonality: 'Kişilik',
  catEntertainment: 'Eğlence',
  catAdventure: 'Macera',
  catFunny: 'Komik',

  // Onboarding
  onboardingTitle1: 'Bir soru. Her gün.\n10 saniye.',
  onboardingDesc1: 'Günlük "ya bu ya şu" sorularına hızlıca karar ver!',
  onboardingTitle2: 'Dünya nasıl oy verdi\ngör.',
  onboardingDesc2: 'Sonuçlarını paylaş, arkadaşlarına meydan oku!',
  start: 'Başla!',
  continue: 'Devam',
  skip: 'Atla',

  // Global stats
  todayVotedCount: 'Bugün {count} kişi oy verdi',

  // Challenge screen
  challenge: '🎯 Meydan Okuma',
  questionNotFound: 'Soru bulunamadı',
  goHome: 'Ana Sayfaya Dön',
  goToTodayQuestion: 'Bugünkü Soruya Git',

  // Share
  shareText: '{question}\n\nBen "{choice}" seçtim (%{percent} katıldı!)\n\n#SplitSecond',
  shareCardFooter: 'Sen ne seçerdin? #SplitSecond',
  shareFallback: 'Benim sonucumu gör! #SplitSecond',
  shareDialogTitle: 'Sonucunu paylaş!',

  // Deeplink
  challengeShareText: 'Sana meydan okuyorum! 🎯\n\n"{question}"\n\nSen ne seçerdin? 👉 {link}\n\n#SplitSecond',

  // Notifications
  dailyReminderChannel: 'Günlük hatırlatma',
  dailyReminderTitle: 'Bugünün sorusu hazır! ⚡',
  dailyReminderBody: 'Karar zamanın geldi. 10 saniyede seç!',
  streakReminderTitle: '{streak} günlük serin tehlikede! 🔥',
  streakReminderBody: 'Bugün oy vermeyi unutma, serin kırılmasın!',

  // Badges
  badges: 'Rozetler',
  badgeUnlocked: 'Rozet Açıldı!',
  badgeFirstVote: 'İlk Oy',
  badgeFirstVoteDesc: 'İlk oyunu ver',
  badgeSpeedDemon: 'Hız Şeytanı',
  badgeSpeedDemonDesc: '3 saniyeden kısa sürede oy ver',
  badgeNightOwl: 'Gece Kuşu',
  badgeNightOwlDesc: 'Gece yarısı-05:00 arası oy ver',
  badgeStreak3: '3 Gün Seri',
  badgeStreak3Desc: '3 günlük seri yap',
  badgeStreak7: '7 Gün Seri',
  badgeStreak7Desc: '7 günlük seri yap',
  badgeStreak14: '14 Gün Seri',
  badgeStreak14Desc: '14 günlük seri yap',
  badgeStreak30: '30 Gün Seri',
  badgeStreak30Desc: '30 günlük seri yap',
  badgeStreak50: '50 Gün Seri',
  badgeStreak50Desc: '50 günlük seri yap',
  badgeCentury: 'Yüzyıl',
  badgeCenturyDesc: '100 günlük seri yap',
  badgeConformist: 'Uyumlu',
  badgeConformistDesc: '10 kez çoğunlukla aynı oy ver',
  badgeRebel: 'Asi',
  badgeRebelDesc: '10 kez çoğunluğa karşı oy ver',
  badgeExplorer: 'Kaşif',
  badgeExplorerDesc: '10 farklı kategoride oy ver',
  badgeDedicated: 'Adanmış',
  badgeDedicatedDesc: '50 toplam oy ver',
  badgeVeteran: 'Veteran',
  badgeVeteranDesc: '100 toplam oy ver',
  nextBadgeProgress: '{remaining} adım kaldı: {badge}',

  // Insights
  insightControversial: 'Tartışmalı soru!',
  insightClearFavorite: 'Net favori!',
  insightPopular: 'Popüler soru!',

  // Leaderboard
  leaderboardTitle: 'Sıralama',
  leaderboardYou: 'Sen',
  leaderboardVotes: '{count} oy',
  leaderboardEmpty: 'Henüz kimse yok',
  leaderboardEmptyDesc: 'İlk oy veren sen ol!',

  // Premium
  premiumFeature: 'Premium Özellik',
  premiumUnlock: 'Bu özelliğin kilidini açmak için Premium\'a geç',
  premiumUpgrade: 'Premium\'a Geç',
  premiumTitle: 'Split Second Premium',
  premiumSubtitle: 'Deneyimini bir üst seviyeye taşı',
  premiumMonthly: 'Aylık',
  premiumYearly: 'Yıllık',
  premiumMonthlyPrice: '₺89,99/ay',
  premiumYearlyPrice: '₺549,99/yıl',
  premiumYearlySave: '%45 tasarruf',
  premiumStartTrial: 'Ücretsiz Denemeyi Başlat',
  premiumRestore: 'Satın Alımları Geri Yükle',
  premiumActivated: 'Premium aktif (geliştirici modu)',
  premiumFeatureHistory: 'Sınırsız oy geçmişi',
  premiumFeatureStats: 'Detaylı istatistikler',
  premiumFeatureBadges: 'Tüm rozetler',
  premiumFeatureInsights: 'Oylama sonrası analizler',
  premiumFeatureThemes: 'Özel temalar',
  premiumFeatureNoAds: 'Reklamsız deneyim',
  premiumOnly: 'Premium',
  premiumHistoryLimit: 'Son 7 günün oyları gösteriliyor',
  premiumSeeAll: 'Tümünü Gör',

  // Themes
  themeMidnight: 'Gece Yarısı',
  themeOcean: 'Okyanus Derinliği',
  themeSunset: 'Gün Batımı',
  themeForest: 'Orman Gecesi',
  themeRose: 'Gül Altını',
  themeNoir: 'Noir',

  // Shop
  shopTitle: 'Mağaza',
  shopThemes: 'Temalar',
  shopFrames: 'Profil Çerçeveleri',
  shopEffects: 'Oy Efektleri',
  shopEquipped: 'Takılı',
  shopEquip: 'Tak',
  shopOwned: 'Sahip',
  shopGet: 'Al',
  shopPremiumRequired: 'Premium Gerekli',

  // Frames
  frameNone: 'Varsayılan',
  frameGold: 'Altın',
  frameNeon: 'Neon',
  frameFire: 'Ateş',
  frameIce: 'Buz',
  frameNoneDesc: 'Çerçeve yok',
  frameGoldDesc: 'Altın gradyan çerçeve',
  frameNeonDesc: 'Parlayan aksan çerçeve',
  frameFireDesc: 'Kırmızı-turuncu çerçeve',
  frameIceDesc: 'Mavi-beyaz çerçeve',

  // Vote effects
  effectDefault: 'Standart',
  effectConfetti: 'Parti',
  effectLightning: 'Yıldırım',
  effectHearts: 'Aşk',
  effectDefaultDesc: 'Varsayılan kaydırma animasyonu',
  effectConfettiDesc: 'Oy verince konfeti patlaması',
  effectLightningDesc: 'Şimşek çakması efekti',
  effectHeartsDesc: 'Kalp parçacıkları',

  // Premium badges
  badgeCollector: 'Koleksiyoncu',
  badgeCollectorDesc: '3+ kozmetik edin',
  badgeFashionista: 'Modacı',
  badgeFashionistaDesc: 'Temayı 5 kez değiştir',
  badgeSupporter: 'Destekçi',
  badgeSupporterDesc: '30+ gün Premium ol',
  badgeCompletionist: 'Tamamlayıcı',
  badgeCompletionistDesc: 'Tüm temel rozetleri aç',

  // Dev menu
  devMenu: 'Geliştirici Menüsü',
  devSimulatePremium: 'Premium Simüle Et',
  devOwnAllCosmetics: 'Tüm Kozmetiklere Sahip Ol',
  devResetPremium: 'Premium Durumunu Sıfırla',
  devReset: 'Sıfırla',
};

const en: typeof tr = {
  // Tabs
  tabToday: 'Today',
  tabLeaderboard: 'Ranking',
  tabProfile: 'Profile',

  // App
  appName: 'Split Second',

  // Home - error
  somethingWentWrong: 'Something went wrong',
  tryAgain: 'Try Again',

  // Voting
  swipeHint: '← Swipe or tap buttons →',

  // Results
  socialProofMajority: 'You think like {percent}% of voters!',
  socialProofMinority: 'Bold choice! Only {percent}% picked this!',
  totalVotesLabel: '{count} total votes',
  voteSingular: 'vote',
  votePlural: 'votes',
  share: 'Share',
  story: 'Story',
  challengeFriend: '🎯 Challenge a Friend',

  // Countdown
  nextQuestionIn: 'Next question in',

  // No question
  noQuestionToday: 'No question today',
  comeBackTomorrow: 'Come back tomorrow for a new dilemma!',

  // Streak
  dayStreak: 'day streak',
  nextGoal: 'Next goal: {milestone} days!',
  longestStreakLabel: 'Longest streak: {streak} days',

  // Profile
  statistics: 'Statistics',
  pastVotes: 'Past Votes',
  noVotesYet: 'No votes yet',
  castFirstVote: 'Cast your first vote from the Today tab!',

  // Stats grid
  totalVotesStat: 'Total Votes',
  dailyStreak: 'Daily Streak',
  longestStreakStat: 'Longest Streak',
  withMajority: 'Majority',
  favoriteCategory: 'Fav Category',

  // Categories
  catSuperpower: 'Superpower',
  catLifestyle: 'Lifestyle',
  catPhilosophy: 'Philosophy',
  catTechnology: 'Technology',
  catFood: 'Food',
  catSkills: 'Skills',
  catPersonality: 'Personality',
  catEntertainment: 'Entertainment',
  catAdventure: 'Adventure',
  catFunny: 'Funny',

  // Onboarding
  onboardingTitle1: 'One question. Every day.\n10 seconds.',
  onboardingDesc1: 'Quickly decide on daily "this or that" questions!',
  onboardingTitle2: 'See how the world\nvoted.',
  onboardingDesc2: 'Share your results, challenge your friends!',
  start: 'Start!',
  continue: 'Continue',
  skip: 'Skip',

  // Global stats
  todayVotedCount: '{count} people voted today',

  // Challenge screen
  challenge: '🎯 Challenge',
  questionNotFound: 'Question not found',
  goHome: 'Go to Home',
  goToTodayQuestion: 'Go to Today\'s Question',

  // Share
  shareText: '{question}\n\nI chose "{choice}" ({percent}% agreed!)\n\n#SplitSecond',
  shareCardFooter: 'What would you choose? #SplitSecond',
  shareFallback: 'See my results! #SplitSecond',
  shareDialogTitle: 'Share your result!',

  // Deeplink
  challengeShareText: 'I challenge you! 🎯\n\n"{question}"\n\nWhat would you choose? 👉 {link}\n\n#SplitSecond',

  // Notifications
  dailyReminderChannel: 'Daily reminder',
  dailyReminderTitle: 'Today\'s question is ready! ⚡',
  dailyReminderBody: 'Time to decide. Choose in 10 seconds!',
  streakReminderTitle: 'Your {streak}-day streak is at risk! 🔥',
  streakReminderBody: 'Don\'t forget to vote today!',

  // Badges
  badges: 'Badges',
  badgeUnlocked: 'Badge Unlocked!',
  badgeFirstVote: 'First Vote',
  badgeFirstVoteDesc: 'Cast your first vote',
  badgeSpeedDemon: 'Speed Demon',
  badgeSpeedDemonDesc: 'Vote in under 3 seconds',
  badgeNightOwl: 'Night Owl',
  badgeNightOwlDesc: 'Vote between midnight and 5 AM',
  badgeStreak3: '3-Day Streak',
  badgeStreak3Desc: 'Reach a 3-day streak',
  badgeStreak7: '7-Day Streak',
  badgeStreak7Desc: 'Reach a 7-day streak',
  badgeStreak14: '14-Day Streak',
  badgeStreak14Desc: 'Reach a 14-day streak',
  badgeStreak30: '30-Day Streak',
  badgeStreak30Desc: 'Reach a 30-day streak',
  badgeStreak50: '50-Day Streak',
  badgeStreak50Desc: 'Reach a 50-day streak',
  badgeCentury: 'Century',
  badgeCenturyDesc: 'Reach a 100-day streak',
  badgeConformist: 'Conformist',
  badgeConformistDesc: 'Vote with the majority 10 times',
  badgeRebel: 'Rebel',
  badgeRebelDesc: 'Vote against the majority 10 times',
  badgeExplorer: 'Explorer',
  badgeExplorerDesc: 'Vote in 10 different categories',
  badgeDedicated: 'Dedicated',
  badgeDedicatedDesc: 'Cast 50 total votes',
  badgeVeteran: 'Veteran',
  badgeVeteranDesc: 'Cast 100 total votes',
  nextBadgeProgress: '{remaining} more to go: {badge}',

  // Insights
  insightControversial: 'Controversial question!',
  insightClearFavorite: 'Clear favorite!',
  insightPopular: 'Popular question!',

  // Leaderboard
  leaderboardTitle: 'Leaderboard',
  leaderboardYou: 'You',
  leaderboardVotes: '{count} votes',
  leaderboardEmpty: 'No one here yet',
  leaderboardEmptyDesc: 'Be the first to vote!',

  // Premium
  premiumFeature: 'Premium Feature',
  premiumUnlock: 'Upgrade to Premium to unlock this feature',
  premiumUpgrade: 'Go Premium',
  premiumTitle: 'Split Second Premium',
  premiumSubtitle: 'Take your experience to the next level',
  premiumMonthly: 'Monthly',
  premiumYearly: 'Yearly',
  premiumMonthlyPrice: '$2.99/mo',
  premiumYearlyPrice: '$19.99/yr',
  premiumYearlySave: 'Save 45%',
  premiumStartTrial: 'Start Free Trial',
  premiumRestore: 'Restore Purchases',
  premiumActivated: 'Premium activated (dev mode)',
  premiumFeatureHistory: 'Unlimited vote history',
  premiumFeatureStats: 'Detailed statistics',
  premiumFeatureBadges: 'All badges',
  premiumFeatureInsights: 'Post-vote insights',
  premiumFeatureThemes: 'Custom themes',
  premiumFeatureNoAds: 'Ad-free experience',
  premiumOnly: 'Premium',
  premiumHistoryLimit: 'Showing last 7 days of votes',
  premiumSeeAll: 'See All',

  // Themes
  themeMidnight: 'Midnight',
  themeOcean: 'Ocean Depth',
  themeSunset: 'Sunset Glow',
  themeForest: 'Forest Night',
  themeRose: 'Rose Gold',
  themeNoir: 'Noir',

  // Shop
  shopTitle: 'Shop',
  shopThemes: 'Themes',
  shopFrames: 'Profile Frames',
  shopEffects: 'Vote Effects',
  shopEquipped: 'Equipped',
  shopEquip: 'Equip',
  shopOwned: 'Owned',
  shopGet: 'Get',
  shopPremiumRequired: 'Premium Required',

  // Frames
  frameNone: 'Default',
  frameGold: 'Gold',
  frameNeon: 'Neon',
  frameFire: 'Fire',
  frameIce: 'Ice',
  frameNoneDesc: 'No frame',
  frameGoldDesc: 'Gold gradient border',
  frameNeonDesc: 'Glowing accent border',
  frameFireDesc: 'Red-orange border',
  frameIceDesc: 'Blue-white border',

  // Vote effects
  effectDefault: 'Standard',
  effectConfetti: 'Party',
  effectLightning: 'Thunder',
  effectHearts: 'Love',
  effectDefaultDesc: 'Default swipe animation',
  effectConfettiDesc: 'Confetti burst on vote',
  effectLightningDesc: 'Lightning flash effect',
  effectHeartsDesc: 'Heart particles',

  // Premium badges
  badgeCollector: 'Collector',
  badgeCollectorDesc: 'Own 3+ cosmetics',
  badgeFashionista: 'Fashionista',
  badgeFashionistaDesc: 'Change theme 5 times',
  badgeSupporter: 'Supporter',
  badgeSupporterDesc: 'Be premium for 30+ days',
  badgeCompletionist: 'Completionist',
  badgeCompletionistDesc: 'Unlock all basic badges',

  // Dev menu
  devMenu: 'Developer Menu',
  devSimulatePremium: 'Simulate Premium',
  devOwnAllCosmetics: 'Own All Cosmetics',
  devResetPremium: 'Reset Premium State',
  devReset: 'Reset',
};

const translations: Record<Language, typeof tr> = { tr, en };

export type TranslationKey = keyof typeof tr;

export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  let text = translations[currentLang][key] ?? translations['en'][key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

export function getLang(): Language {
  return currentLang;
}

export function getDateLocale(): string {
  return currentLang === 'tr' ? 'tr-TR' : 'en-US';
}

// Localize question/history items by swapping TR fields into standard fields
export function localizeQuestion<T extends {
  question_text: string;
  option_a: string;
  option_b: string;
  question_text_tr?: string | null;
  option_a_tr?: string | null;
  option_b_tr?: string | null;
}>(q: T): T {
  if (currentLang === 'tr' && q.question_text_tr) {
    return {
      ...q,
      question_text: q.question_text_tr,
      option_a: q.option_a_tr ?? q.option_a,
      option_b: q.option_b_tr ?? q.option_b,
    };
  }
  return q;
}
