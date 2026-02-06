import { getLang } from './i18n';

const categoryMessagesTR: Record<string, string[]> = {
  superpower: [
    'Her hayalcinin farklı bir dileği var',
    'Güç seninle olsun!',
    'Herkesin bir süper kahramanı var içinde',
  ],
  lifestyle: [
    'Hayat tercihleri kişiyi tanımlar',
    'Herkesin hayali farklı bir dünya',
    'Basit seçimlerin büyük etkileri var',
  ],
  philosophy: [
    'Ebedi tartışma devam ediyor...',
    'Filozoflar bile bu konuda anlaşamazdı',
    'Derin sorular, farklı cevaplar',
  ],
  technology: [
    'Dijital çağda zor seçimler',
    'Teknoloji hayatımızı şekillendiriyor',
    'Ekransız hayat mümkün mü?',
  ],
  food: [
    'Midenin yolu kalpten geçer',
    'Damak zevki tartışmaya açık değil!',
    'Yemek seçimi ciddi iştir',
  ],
  skills: [
    'Yetenek mi yoksa bilgi mi?',
    'Üstünlük farkı detaylarda gizli',
    'Her beceri yeni kapılar açar',
  ],
  personality: [
    'Karakter özelliğin seçimlerinde gizli',
    'Kendini tanımak en büyük güç',
    'Herkes farklı, bu güzel!',
  ],
  entertainment: [
    'Eğlence anlayışı herkeste farklı',
    'Popkorn hazır mı?',
    'Hayal gücünün sınırı yok',
  ],
  adventure: [
    'Macera seni çağırıyor!',
    'Keşfetmeye hazır mısın?',
    'Bilinmeyen her zaman cezbeder',
  ],
  funny: [
    'Gülmeye devam!',
    'Komik ama zor bir seçim',
    'Hayal et ve gül!',
  ],
};

const defaultMessagesTR = [
  'Herkesin bir tercihi var',
  'Seçimler bizi tanımlar',
  'İlginç bir tartışma!',
];

const categoryMessagesEN: Record<string, string[]> = {
  superpower: [
    'Every dreamer has a different wish',
    'May the force be with you!',
    'Everyone has a superhero inside',
  ],
  lifestyle: [
    'Life choices define who you are',
    'Everyone dreams of a different world',
    'Simple choices have big impacts',
  ],
  philosophy: [
    'The eternal debate continues...',
    'Even philosophers can\'t agree on this',
    'Deep questions, different answers',
  ],
  technology: [
    'Tough choices in the digital age',
    'Technology shapes our lives',
    'Is life without screens possible?',
  ],
  food: [
    'The way to the heart is through the stomach',
    'Taste is not up for debate!',
    'Food choices are serious business',
  ],
  skills: [
    'Talent or knowledge?',
    'The edge is hidden in the details',
    'Every skill opens new doors',
  ],
  personality: [
    'Your character is hidden in your choices',
    'Knowing yourself is the greatest power',
    'Everyone is different, and that\'s beautiful!',
  ],
  entertainment: [
    'Everyone has a different idea of fun',
    'Popcorn ready?',
    'Imagination knows no limits',
  ],
  adventure: [
    'Adventure is calling you!',
    'Ready to explore?',
    'The unknown always attracts',
  ],
  funny: [
    'Keep laughing!',
    'Funny but tough choice',
    'Imagine and laugh!',
  ],
};

const defaultMessagesEN = [
  'Everyone has a preference',
  'Choices define us',
  'What an interesting debate!',
];

export function getCategoryInsight(category: string): string {
  const lang = getLang();
  const messages = lang === 'tr'
    ? (categoryMessagesTR[category] ?? defaultMessagesTR)
    : (categoryMessagesEN[category] ?? defaultMessagesEN);
  const index = Math.floor(Math.random() * messages.length);
  return messages[index];
}
