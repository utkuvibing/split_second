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
};

const en: typeof tr = {
  // Tabs
  tabToday: 'Today',
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
