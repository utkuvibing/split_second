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
  nextQuestionsIn: 'Yarının soruları',

  // No question
  noQuestionToday: 'Bugün soru yok',
  comeBackTomorrow: 'Yarın yeni bir ikilem için geri gel!',

  // Multi-question
  questionUnlocksAt: '{time}\'de açılır',
  dayComplete: 'Günü tamamladın!',
  questionsCompleted: '{count} soruyu yanıtladın',
  questionsProgress: '{voted}/{total} soru tamamlandı',

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
  onboardingTitle1: 'Günde 3 soru,\nher biri 10 saniye.',
  onboardingDesc1: '"Ya bu ya şu" ikilemlerine hızlıca karar ver!',
  onboardingTitle2: 'Dünya nasıl oy verdi\ngör.',
  onboardingDesc2: 'Sonuçlarını paylaş, arkadaşlarına meydan oku!',
  onboardingTitle3: '6 oyda kişilik tipini\nkeşfet.',
  onboardingDesc3: 'Kararların seni tanımlasın!',
  onboardingTitle4: 'Arkadaşlarınla\nkarşılaştır.',
  onboardingDesc4: 'Aynı mı düşünüyorsunuz, yoksa zıt mısınız?',
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
  morningReminderTitle: 'Sabah sorusu hazır! ☀️',
  morningReminderBody: 'Güne bir ikilemle başla!',
  afternoonReminderTitle: 'Öğle sorusu açıldı! 🌤️',
  afternoonReminderBody: 'Yeni bir soru seni bekliyor!',
  eveningReminderTitle: 'Akşam sorusu burada! 🌙',
  eveningReminderBody: 'Günü tamamla, streak\'ini koru!',
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
  leaderboardGlobal: 'Global',
  leaderboardFriends: 'Arkadaşlar',
  leaderboardYou: 'Sen',
  leaderboardVotes: '{count} oy',
  leaderboardFriendRank: 'Arkadaşların arasında {rank}. sıradasın!',
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
  premiumFeatureFriends: 'Sınırsız arkadaş',
  premiumFeaturePersonality: 'Detaylı kişilik profili',
  premiumFeaturesTitle: 'Premium\'un Avantajları',
  premiumFeatureHistoryDesc: 'Tüm oy geçmişine eriş',
  premiumFeatureStatsDesc: 'Detaylı analiz ve trendler',
  premiumFeatureBadgesDesc: '4 özel premium rozet',
  premiumFeatureInsightsDesc: 'Oylama sonrası derin analizler',
  premiumFeatureThemesDesc: '6 özel tema ile kişiselleştir',
  premiumFeatureNoAdsDesc: 'Kesintisiz deneyim',
  premiumFeatureFriendsDesc: 'Sınırsız arkadaş ekle',
  premiumFeaturePersonalityDesc: '4 eksen detaylı kişilik analizi',
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
  themeCyber: 'Siber',
  themeCherry: 'Sakura',
  themeArctic: 'Kutup',

  // Shop
  shopTitle: 'Mağaza',
  shopThemes: 'Temalar',
  shopFrames: 'Profil Çerçeveleri',
  shopEffects: 'Oy Efektleri',
  shopEquipped: 'Takılı',
  shopEquip: 'Kullan',
  shopOwned: 'Sahip',
  shopGet: 'Al',
  shopPremiumRequired: 'Premium Gerekli',
  shopPremiumBadge: 'Premium',
  shopPremiumUnlock: 'Premium ile Aç',

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
  framePlatinum: 'Platin',
  framePlatinumDesc: 'Gümüş gradyan çerçeve',
  framePrism: 'Prizma',
  framePrismDesc: 'Gökkuşağı kırılma çerçeve',
  frameVelvet: 'Kadife',
  frameVelvetDesc: 'Mor-pembe kadife çerçeve',

  // Vote effects
  effectDefault: 'Standart',
  effectConfetti: 'Parti',
  effectLightning: 'Yıldırım',
  effectHearts: 'Aşk',
  effectDefaultDesc: 'Varsayılan kaydırma animasyonu',
  effectConfettiDesc: 'Oy verince konfeti patlaması',
  effectLightningDesc: 'Şimşek çakması efekti',
  effectHeartsDesc: 'Kalp parçacıkları',
  effectFireworks: 'Havai Fişek',
  effectFireworksDesc: 'Havai fişek patlaması',
  effectSnowfall: 'Kar Yağışı',
  effectSnowfallDesc: 'Düşen kar taneleri',
  effectStardust: 'Yıldız Tozu',
  effectStardustDesc: 'Parıldayan yıldız tozu',

  // Premium badges
  badgeCollector: 'Koleksiyoncu',
  badgeCollectorDesc: '3+ kozmetik edin',
  badgeFashionista: 'Modacı',
  badgeFashionistaDesc: 'Temayı 5 kez değiştir',
  badgeSupporter: 'Destekçi',
  badgeSupporterDesc: '30+ gün Premium ol',
  badgeCompletionist: 'Tamamlayıcı',
  badgeCompletionistDesc: 'Tüm temel rozetleri aç',

  // Coins
  coinSymbol: 'coin',
  coinBalance: 'Bakiye',
  coinEarned: '+{amount} coin!',
  coinEarnedStreak: '+{amount} coin! (seri bonusu)',
  shopInsufficientCoins: 'Yetersiz Coin',
  shopInsufficientCoinsDesc: 'Bu öğeyi almak için yeterli coin\'in yok. Günlük oy vererek coin kazan!',
  shopBuyFor: '{price} coin ile Al',
  shopYourBalance: 'Bakiyen',
  shopPreviewQuestion: 'Ya bu ya şu?',
  shopPreviewOptionA: 'Seçenek A',
  shopPreviewOptionB: 'Seçenek B',

  // Profile card
  profileAnonymous: 'Oyuncu',

  // Personality
  personalityTitle: 'Karar Verme Profili',
  personalityLocked: '{remaining} oy daha ver ve tipini keşfet!',
  personalityProgress: '{current}/{target} oy',
  personalityRecalculated: 'Profil güncellendi!',
  personalityConformity: 'Uyum',
  personalitySpeed: 'Hız',
  personalityDiversity: 'Çeşitlilik',
  personalityCourage: 'Cesaret',
  personalityShareTitle: 'Karar Verme Tipim',
  personalityShareFooter: 'Senin tipin ne? #SplitSecond',
  personalityRevealed: 'Tipin Belirlendi!',
  personalityAnalyzing: 'Oyların analiz ediliyor...',

  // Personality Types
  personalityFlashRebelTitle: 'Ani Karar Asi',
  personalityFlashRebelDesc: 'Hızlı düşünür, kalabalığa karşı gider. Sezgilerin güçlü!',
  personalityCoolStrategistTitle: 'Soğukkanlı Stratejist',
  personalityCoolStrategistDesc: 'Düşünerek karar verir, çoğunluğun nabzını tutar.',
  personalityGutFeelerTitle: 'İçgüdüsel Sezgici',
  personalityGutFeelerDesc: 'Hızlı ama isabetli! Sezgilerin çoğunlukla örtüşüyor.',
  personalityLoneWolfTitle: 'Yalnız Kurt',
  personalityLoneWolfDesc: 'Zamanını alır, kendi yolunu çizer. Bağımsız ruh!',
  personalityExplorerSoulTitle: 'Kaşif Ruh',
  personalityExplorerSoulDesc: 'Her kategoride cesurca seçim yapar. Merak dolu!',
  personalitySpecialistSageTitle: 'Uzman Bilge',
  personalitySpecialistSageDesc: 'Belirli alanlarda derinleşir, güvenli seçimler yapar.',
  personalityChaosAgentTitle: 'Kaos Ajanı',
  personalityChaosAgentDesc: 'Hızlı, cesur ve çeşitli! Tahmin edilemez karar verici.',
  personalityWiseOwlTitle: 'Bilge Baykuş',
  personalityWiseOwlDesc: 'Sabırlı, tutarlı ve odaklı. Deneyimle karar verir.',

  // Friends
  friendsTitle: 'Arkadaşlar',
  friendCode: 'Arkadaş Kodun',
  friendCodeCopied: 'Kod kopyalandı!',
  friendCodeShare: 'Kodu Paylaş',
  addFriend: 'Arkadaş Ekle',
  addFriendTitle: 'Arkadaş Ekle',
  addFriendPlaceholder: '6 haneli kodu gir',
  addFriendSubmit: 'Ekle',
  addFriendSuccess: 'Arkadaş eklendi!',
  addFriendError: 'Kod bulunamadı',
  addFriendSelf: 'Kendi kodunu ekleyemezsin',
  addFriendAlready: 'Zaten arkadaşsınız',
  addFriendLimit: 'Arkadaş limitine ulaştın (Premium ile sınırsız)',
  removeFriend: 'Arkadaşı Kaldır',
  removeFriendConfirm: 'Bu arkadaşı kaldırmak istediğine emin misin?',
  friendVotesTitle: 'Arkadaşların Seçimi',
  friendSameChoice: 'Aynı düşünüyor! 🤝',
  friendOppositeChoice: 'Tam tersi! 😈',
  friendChoseA: '{name} A seçti',
  friendChoseB: '{name} B seçti',
  friendNotVoted: '{name} henüz oy vermedi',
  noFriendsYet: 'Henüz arkadaşın yok',
  noFriendsDesc: 'Kodunu paylaş veya arkadaşının kodunu gir!',
  compatibility: 'Uyum',
  compatibilityLow: 'Zıtlar çekişir!',
  compatibilityMedLow: 'Farklı bakış açıları',
  compatibilityMed: 'Dengeli düşünceler',
  compatibilityMedHigh: 'Benzer düşünceler!',
  compatibilityHigh: 'Ruh ikizi!',
  friendLimit: '{current}/{max} arkadaş',
  friendLimitFree: 'Free: {max} arkadaş',

  // Nickname
  editNickname: 'Takma Ad Düzenle',
  nicknamePlaceholder: 'Takma adını gir',
  nicknameSaved: 'Kaydedildi!',
  editNicknameError: 'Geçersiz isim (2-16 karakter)',
  nicknameServerError: 'Sunucu hatası, lütfen daha sonra tekrar deneyin',
  nicknameInsufficientCoins: 'Yeterli coin yok',
  nicknameCost: 'Değiştirmek {cost} coin',
  nicknameSaveWithCost: '{cost} coin ile Kaydet',
  save: 'Kaydet',

  // Friend Requests
  friendRequestSent: 'İstek gönderildi!',
  alreadyPending: 'Zaten bekleyen istek var',
  pendingRequests: 'Gelen İstekler',

  // Mystery Box
  mysteryBoxDropped: 'Kutu Düştü!',
  mysteryBoxOpen: 'Aç!',
  mysteryBoxBoost: '2x Coin (1 saat)',
  mysteryBoxInventory: 'Kutular',
  mysteryBoxTeaser: '3 soruyu cevapla, mystery box kazan!',
  mysteryBoxTeaserProgress: '{{voted}}/{{total}} tamamlandı',
  rarity_common: 'Sıradan',
  rarity_rare: 'Nadir',
  rarity_epic: 'Destansı',
  rarity_legendary: 'Efsanevi',
  badgeBoxOpener: 'Kutu Avcısı',
  badgeBoxOpenerDesc: '10 kutu aç',
  badgeLucky: 'Şanslı',
  badgeLuckyDesc: 'Efsanevi kutu aç',

  // Community
  tabCommunity: 'Topluluk',
  communityTitle: 'Topluluk',
  communityHot: 'Popüler',
  communityNew: 'Yeni',
  communityTop: 'En İyi',
  communityVs: 'YA DA',
  communityEmpty: 'Henüz soru yok',
  communityEmptyDesc: 'İlk soruyu gönderen sen ol!',
  communitySubmitBtn: 'Soru Sor',
  communitySubmitTitle: 'Soru Gönder',
  communitySubmitRemaining: 'Bugün {count} hakkın kaldı',
  communityOptionA: 'Seçenek A',
  communityOptionB: 'Seçenek B',
  communitySubmit: 'Gönder',
  communitySubmitSuccess: 'Soru gönderildi!',
  communitySubmitError: 'Gönderilemedi',
  communitySubmitCost: 'Soru göndermek {cost} coin',
  communityInsufficientCoins: 'Yeterli coin yok ({cost} coin gerekli)',
  badgeCreator: 'İçerik Üretici',
  badgeCreatorDesc: '5 soru gönder',
  badgeTrendsetter: 'Trend Belirleyici',
  badgeTrendsetterDesc: '50+ upvote alan soru gönder',

  // Live Events
  liveEventActive: 'CANLI',
  liveEventUpcoming: 'Yaklaşan',
  liveEventReward: 'Oy ver ve {coins} coin kazan!',
  badgeLiveVoter: 'Canlı Katılımcı',
  badgeLiveVoterDesc: '5 canlı etkinliğe katıl',

  // Avatar
  chooseAvatar: 'Avatar Seç',
  avatarSaved: 'Avatar kaydedildi!',
  avatarCategoryAnimals: 'Hayvanlar',
  avatarCategoryPeople: 'Karakterler',
  avatarCategoryObjects: 'Nesneler',
  avatarCategoryNature: 'Doğa',
  avatarNone: 'Avatar Yok',
  avatarBuy: 'Al',
  avatarInsufficientCoins: 'Yeterli coin yok',
  avatarPremiumOnly: 'Premium',

  // Badge Showcase
  badgeShowcase: 'Rozetlerin',

  // Matching / Compatibility Tab
  tabMatching: 'Eşleşme',
  bestMatch: 'En Uyumlu Eşin',
  soulmate: 'Ruh İkizi',
  veryCompatible: 'Çok Uyumlu',
  compatibleLabel: 'Uyumlu',
  differentPaths: 'Farklı Yollar',
  opposites: 'Zıt Kutuplar',
  commonGround: 'Ortak Noktalar',
  differencesLabel: 'Farklılıklar',
  addFriendsToMatch: 'Arkadaş ekle ve uyumluluğunu keşfet',
  friendNoPersonality: 'Henüz kişilik testi yapmamış',
  matchingTitle: 'Uyumluluk',
  noPersonalityYet: 'Kişilik tipini keşfet',
  noPersonalityMatchDesc: 'Eşleşme için önce 6 oy vererek kişilik tipini belirle!',

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
  nextQuestionsIn: 'Tomorrow\'s questions',

  // No question
  noQuestionToday: 'No question today',
  comeBackTomorrow: 'Come back tomorrow for a new dilemma!',

  // Multi-question
  questionUnlocksAt: 'Unlocks at {time}',
  dayComplete: 'Day Complete!',
  questionsCompleted: 'You answered {count} questions',
  questionsProgress: '{voted}/{total} questions done',

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
  onboardingTitle1: '3 questions a day,\n10 seconds each.',
  onboardingDesc1: 'Quickly decide on "this or that" dilemmas!',
  onboardingTitle2: 'See how the world\nvoted.',
  onboardingDesc2: 'Share your results, challenge your friends!',
  onboardingTitle3: 'Discover your type\nin 6 votes.',
  onboardingDesc3: 'Let your decisions define you!',
  onboardingTitle4: 'Compare with\nyour friends.',
  onboardingDesc4: 'Do you think alike, or are you opposites?',
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
  morningReminderTitle: 'Morning question is ready! ☀️',
  morningReminderBody: 'Start your day with a dilemma!',
  afternoonReminderTitle: 'Afternoon question unlocked! 🌤️',
  afternoonReminderBody: 'A new question is waiting for you!',
  eveningReminderTitle: 'Evening question is here! 🌙',
  eveningReminderBody: 'Complete your day, keep your streak!',
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
  leaderboardGlobal: 'Global',
  leaderboardFriends: 'Friends',
  leaderboardYou: 'You',
  leaderboardVotes: '{count} votes',
  leaderboardFriendRank: 'You\'re #{rank} among friends!',
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
  premiumFeatureFriends: 'Unlimited friends',
  premiumFeaturePersonality: 'Detailed personality profile',
  premiumFeaturesTitle: 'Premium Benefits',
  premiumFeatureHistoryDesc: 'Access all your vote history',
  premiumFeatureStatsDesc: 'Detailed analysis and trends',
  premiumFeatureBadgesDesc: '4 exclusive premium badges',
  premiumFeatureInsightsDesc: 'Deep insights after voting',
  premiumFeatureThemesDesc: 'Personalize with 6 themes',
  premiumFeatureNoAdsDesc: 'Uninterrupted experience',
  premiumFeatureFriendsDesc: 'Add unlimited friends',
  premiumFeaturePersonalityDesc: 'Detailed 4-axis personality analysis',
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
  themeCyber: 'Cyber',
  themeCherry: 'Cherry Blossom',
  themeArctic: 'Arctic',

  // Shop
  shopTitle: 'Shop',
  shopThemes: 'Themes',
  shopFrames: 'Profile Frames',
  shopEffects: 'Vote Effects',
  shopEquipped: 'Equipped',
  shopEquip: 'Use',
  shopOwned: 'Owned',
  shopGet: 'Get',
  shopPremiumRequired: 'Premium Required',
  shopPremiumBadge: 'Premium',
  shopPremiumUnlock: 'Unlock with Premium',

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
  framePlatinum: 'Platinum',
  framePlatinumDesc: 'Silver gradient border',
  framePrism: 'Prism',
  framePrismDesc: 'Rainbow refraction border',
  frameVelvet: 'Velvet',
  frameVelvetDesc: 'Purple-pink velvet border',

  // Vote effects
  effectDefault: 'Standard',
  effectConfetti: 'Party',
  effectLightning: 'Thunder',
  effectHearts: 'Love',
  effectDefaultDesc: 'Default swipe animation',
  effectConfettiDesc: 'Confetti burst on vote',
  effectLightningDesc: 'Lightning flash effect',
  effectHeartsDesc: 'Heart particles',
  effectFireworks: 'Fireworks',
  effectFireworksDesc: 'Fireworks burst',
  effectSnowfall: 'Snowfall',
  effectSnowfallDesc: 'Falling snowflakes',
  effectStardust: 'Stardust',
  effectStardustDesc: 'Sparkling star dust',

  // Premium badges
  badgeCollector: 'Collector',
  badgeCollectorDesc: 'Own 3+ cosmetics',
  badgeFashionista: 'Fashionista',
  badgeFashionistaDesc: 'Change theme 5 times',
  badgeSupporter: 'Supporter',
  badgeSupporterDesc: 'Be premium for 30+ days',
  badgeCompletionist: 'Completionist',
  badgeCompletionistDesc: 'Unlock all basic badges',

  // Coins
  coinSymbol: 'coin',
  coinBalance: 'Balance',
  coinEarned: '+{amount} coins!',
  coinEarnedStreak: '+{amount} coins! (streak bonus)',
  shopInsufficientCoins: 'Not Enough Coins',
  shopInsufficientCoinsDesc: 'You don\'t have enough coins to buy this item. Earn coins by voting daily!',
  shopBuyFor: 'Buy for {price} coins',
  shopYourBalance: 'Your balance',
  shopPreviewQuestion: 'This or that?',
  shopPreviewOptionA: 'Option A',
  shopPreviewOptionB: 'Option B',

  // Profile card
  profileAnonymous: 'Player',

  // Personality
  personalityTitle: 'Decision Profile',
  personalityLocked: 'Cast {remaining} more votes to discover your type!',
  personalityProgress: '{current}/{target} votes',
  personalityRecalculated: 'Profile updated!',
  personalityConformity: 'Conformity',
  personalitySpeed: 'Speed',
  personalityDiversity: 'Diversity',
  personalityCourage: 'Courage',
  personalityShareTitle: 'My Decision Type',
  personalityShareFooter: 'What\'s your type? #SplitSecond',
  personalityRevealed: 'Type Revealed!',
  personalityAnalyzing: 'Analyzing your votes...',

  // Personality Types
  personalityFlashRebelTitle: 'Flash Rebel',
  personalityFlashRebelDesc: 'Quick thinker, goes against the crowd. Strong instincts!',
  personalityCoolStrategistTitle: 'Cool Strategist',
  personalityCoolStrategistDesc: 'Thinks before deciding, follows the crowd\'s pulse.',
  personalityGutFeelerTitle: 'Gut Feeler',
  personalityGutFeelerDesc: 'Fast but accurate! Your instincts align with the majority.',
  personalityLoneWolfTitle: 'Lone Wolf',
  personalityLoneWolfDesc: 'Takes time, forges own path. Independent spirit!',
  personalityExplorerSoulTitle: 'Explorer Soul',
  personalityExplorerSoulDesc: 'Makes bold choices across every category. Full of curiosity!',
  personalitySpecialistSageTitle: 'Specialist Sage',
  personalitySpecialistSageDesc: 'Goes deep in specific areas, makes safe choices.',
  personalityChaosAgentTitle: 'Chaos Agent',
  personalityChaosAgentDesc: 'Fast, bold, and diverse! Unpredictable decision maker.',
  personalityWiseOwlTitle: 'Wise Owl',
  personalityWiseOwlDesc: 'Patient, consistent, and focused. Decides with experience.',

  // Friends
  friendsTitle: 'Friends',
  friendCode: 'Your Friend Code',
  friendCodeCopied: 'Code copied!',
  friendCodeShare: 'Share Code',
  addFriend: 'Add Friend',
  addFriendTitle: 'Add Friend',
  addFriendPlaceholder: 'Enter 6-digit code',
  addFriendSubmit: 'Add',
  addFriendSuccess: 'Friend added!',
  addFriendError: 'Code not found',
  addFriendSelf: 'You can\'t add your own code',
  addFriendAlready: 'Already friends',
  addFriendLimit: 'Friend limit reached (unlimited with Premium)',
  removeFriend: 'Remove Friend',
  removeFriendConfirm: 'Are you sure you want to remove this friend?',
  friendVotesTitle: 'Friends\' Choices',
  friendSameChoice: 'Thinks alike! 🤝',
  friendOppositeChoice: 'Opposite! 😈',
  friendChoseA: '{name} chose A',
  friendChoseB: '{name} chose B',
  friendNotVoted: '{name} hasn\'t voted yet',
  noFriendsYet: 'No friends yet',
  noFriendsDesc: 'Share your code or enter a friend\'s code!',
  compatibility: 'Compatibility',
  compatibilityLow: 'Opposites attract!',
  compatibilityMedLow: 'Different perspectives',
  compatibilityMed: 'Balanced minds',
  compatibilityMedHigh: 'Like-minded!',
  compatibilityHigh: 'Soul twins!',
  friendLimit: '{current}/{max} friends',
  friendLimitFree: 'Free: {max} friends',

  // Nickname
  editNickname: 'Edit Nickname',
  nicknamePlaceholder: 'Enter your nickname',
  nicknameSaved: 'Saved!',
  editNicknameError: 'Invalid name (2-16 characters)',
  nicknameServerError: 'Server error, please try again later',
  nicknameInsufficientCoins: 'Not enough coins',
  nicknameCost: 'Changing costs {cost} coins',
  nicknameSaveWithCost: 'Save for {cost} coins',
  save: 'Save',

  // Friend Requests
  friendRequestSent: 'Request sent!',
  alreadyPending: 'Request already pending',
  pendingRequests: 'Incoming Requests',

  // Mystery Box
  mysteryBoxDropped: 'Box Dropped!',
  mysteryBoxOpen: 'Open!',
  mysteryBoxBoost: '2x Coins (1 hour)',
  mysteryBoxInventory: 'Boxes',
  mysteryBoxTeaser: 'Answer all 3 to unlock a mystery box!',
  mysteryBoxTeaserProgress: '{{voted}}/{{total}} completed',
  rarity_common: 'Common',
  rarity_rare: 'Rare',
  rarity_epic: 'Epic',
  rarity_legendary: 'Legendary',
  badgeBoxOpener: 'Box Hunter',
  badgeBoxOpenerDesc: 'Open 10 boxes',
  badgeLucky: 'Lucky',
  badgeLuckyDesc: 'Open a legendary box',

  // Community
  tabCommunity: 'Community',
  communityTitle: 'Community',
  communityHot: 'Hot',
  communityNew: 'New',
  communityTop: 'Top',
  communityVs: 'OR',
  communityEmpty: 'No questions yet',
  communityEmptyDesc: 'Be the first to submit a question!',
  communitySubmitBtn: 'Ask',
  communitySubmitTitle: 'Submit Question',
  communitySubmitRemaining: '{count} submissions left today',
  communityOptionA: 'Option A',
  communityOptionB: 'Option B',
  communitySubmit: 'Submit',
  communitySubmitSuccess: 'Question submitted!',
  communitySubmitError: 'Failed to submit',
  communitySubmitCost: 'Submitting costs {cost} coins',
  communityInsufficientCoins: 'Not enough coins ({cost} coins needed)',
  badgeCreator: 'Creator',
  badgeCreatorDesc: 'Submit 5 questions',
  badgeTrendsetter: 'Trendsetter',
  badgeTrendsetterDesc: 'Get 50+ upvotes on a question',

  // Live Events
  liveEventActive: 'LIVE',
  liveEventUpcoming: 'Upcoming',
  liveEventReward: 'Vote and earn {coins} coins!',
  badgeLiveVoter: 'Live Voter',
  badgeLiveVoterDesc: 'Participate in 5 live events',

  // Avatar
  chooseAvatar: 'Choose Avatar',
  avatarSaved: 'Avatar saved!',
  avatarCategoryAnimals: 'Animals',
  avatarCategoryPeople: 'Characters',
  avatarCategoryObjects: 'Objects',
  avatarCategoryNature: 'Nature',
  avatarNone: 'No Avatar',
  avatarBuy: 'Buy',
  avatarInsufficientCoins: 'Not enough coins',
  avatarPremiumOnly: 'Premium',

  // Badge Showcase
  badgeShowcase: 'Your Badges',

  // Matching / Compatibility Tab
  tabMatching: 'Matching',
  bestMatch: 'Best Match',
  soulmate: 'Soulmate',
  veryCompatible: 'Very Compatible',
  compatibleLabel: 'Compatible',
  differentPaths: 'Different Paths',
  opposites: 'Opposites',
  commonGround: 'Common Ground',
  differencesLabel: 'Differences',
  addFriendsToMatch: 'Add friends to discover compatibility',
  friendNoPersonality: 'No personality test yet',
  matchingTitle: 'Compatibility',
  noPersonalityYet: 'Discover your type',
  noPersonalityMatchDesc: 'Cast 6 votes to unlock your personality type for matching!',

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
