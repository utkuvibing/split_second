const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
  TableLayoutType,
  PageBreak,
} = require("docx");
const fs = require("fs");
const path = require("path");

// Color constants
const PRIMARY = "1A1A2E";
const ACCENT = "E94560";
const GOLD = "D4A017";
const GRAY = "666666";
const LIGHT_GRAY = "999999";
const TABLE_HEADER_BG = "1A1A2E";
const TABLE_ALT_BG = "F5F5F5";
const WHITE = "FFFFFF";

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 48,
        color: PRIMARY,
        font: "Segoe UI",
      }),
    ],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 160 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 32,
        color: ACCENT,
        font: "Segoe UI",
      }),
    ],
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26,
        color: PRIMARY,
        font: "Segoe UI",
      }),
    ],
  });
}

function subtitle(text) {
  return new Paragraph({
    spacing: { after: 200 },
    children: [
      new TextRun({
        text,
        size: 24,
        color: GRAY,
        font: "Segoe UI",
        italics: true,
      }),
    ],
  });
}

function bodyText(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({
        text,
        size: 22,
        color: "333333",
        font: "Segoe UI",
      }),
    ],
  });
}

function bulletItem(boldPart, normalPart) {
  const children = [];
  if (boldPart) {
    children.push(
      new TextRun({
        text: boldPart,
        bold: true,
        size: 22,
        color: PRIMARY,
        font: "Segoe UI",
      })
    );
  }
  if (normalPart) {
    children.push(
      new TextRun({
        text: normalPart,
        size: 22,
        color: "333333",
        font: "Segoe UI",
      })
    );
  }
  return new Paragraph({
    spacing: { after: 80 },
    indent: { left: 360 },
    bullet: { level: 0 },
    children,
  });
}

function subBulletItem(text) {
  return new Paragraph({
    spacing: { after: 60 },
    indent: { left: 720 },
    bullet: { level: 1 },
    children: [
      new TextRun({
        text,
        size: 20,
        color: GRAY,
        font: "Segoe UI",
      }),
    ],
  });
}

function divider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "E0E0E0" },
    },
    children: [new TextRun({ text: "", size: 4 })],
  });
}

function emptyLine() {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    children: [new TextRun({ text: "", size: 12 })],
  });
}

const noBorder = {
  top: { style: BorderStyle.NONE, size: 0 },
  bottom: { style: BorderStyle.NONE, size: 0 },
  left: { style: BorderStyle.NONE, size: 0 },
  right: { style: BorderStyle.NONE, size: 0 },
};

function tableHeaderCell(text) {
  return new TableCell({
    shading: { type: ShadingType.SOLID, color: TABLE_HEADER_BG },
    borders: noBorder,
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 80, after: 80 },
        indent: { left: 120 },
        children: [
          new TextRun({
            text,
            bold: true,
            size: 22,
            color: WHITE,
            font: "Segoe UI",
          }),
        ],
      }),
    ],
  });
}

function tableCell(text, isAlt = false) {
  return new TableCell({
    shading: isAlt
      ? { type: ShadingType.SOLID, color: TABLE_ALT_BG }
      : undefined,
    borders: noBorder,
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 60, after: 60 },
        indent: { left: 120 },
        children: [
          new TextRun({
            text,
            size: 22,
            color: "333333",
            font: "Segoe UI",
          }),
        ],
      }),
    ],
  });
}

function tableValueCell(text, isAlt = false) {
  return new TableCell({
    shading: isAlt
      ? { type: ShadingType.SOLID, color: TABLE_ALT_BG }
      : undefined,
    borders: noBorder,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({
            text,
            bold: true,
            size: 22,
            color: ACCENT,
            font: "Segoe UI",
          }),
        ],
      }),
    ],
  });
}

function statsTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [
      new TableRow({
        children: [tableHeaderCell("Metrik / Metric"), tableHeaderCell("Deger / Value")],
      }),
      ...rows.map(
        ([metric, value], i) =>
          new TableRow({
            children: [tableCell(metric, i % 2 === 0), tableValueCell(value, i % 2 === 0)],
          })
      ),
    ],
  });
}

function techBadges(techs) {
  const runs = [];
  techs.forEach((tech, i) => {
    runs.push(
      new TextRun({
        text: tech,
        size: 20,
        color: PRIMARY,
        font: "Segoe UI Semibold",
        bold: true,
      })
    );
    if (i < techs.length - 1) {
      runs.push(
        new TextRun({
          text: "  |  ",
          size: 20,
          color: LIGHT_GRAY,
          font: "Segoe UI",
        })
      );
    }
  });
  return new Paragraph({
    spacing: { before: 120, after: 200 },
    alignment: AlignmentType.CENTER,
    children: runs,
  });
}

// ========== DOCUMENT ==========

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Segoe UI", size: 22 },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: 1200,
            bottom: 1200,
            left: 1200,
            right: 1200,
          },
        },
      },
      children: [
        // ===== TITLE =====
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 600, after: 100 },
          children: [
            new TextRun({
              text: "SPLIT SECOND",
              bold: true,
              size: 72,
              color: PRIMARY,
              font: "Segoe UI",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: "Gunluk \"Ya Bu Ya Su\" Mobil Oyunu",
              size: 28,
              color: ACCENT,
              font: "Segoe UI",
              italics: true,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: "Daily \"Would You Rather\" Mobile Game",
              size: 28,
              color: ACCENT,
              font: "Segoe UI",
              italics: true,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: "React Native + Expo SDK 54 + Supabase",
              size: 24,
              color: GRAY,
              font: "Segoe UI",
            }),
          ],
        }),

        divider(),

        // ===== TAGLINE =====
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: "Her gun tek bir ikilem sorusu. 10 saniye suresi. Binlerce kisinin oyladi. Sonuclari aninda gosteren.",
              size: 24,
              color: GRAY,
              font: "Segoe UI",
              italics: true,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: "One dilemma question every day. 10 seconds to decide. Thousands voting. Instant results.",
              size: 24,
              color: GRAY,
              font: "Segoe UI",
              italics: true,
            }),
          ],
        }),

        divider(),

        // ===== NE ISE YARIYOR / WHAT IT DOES =====
        heading2("Ne Ise Yariyor? / What It Does"),

        bodyText(
          "Split Second, kullanicilara her gun bir \"ya bu ya su\" sorusu sunan mobil uygulamadir. 10 saniyelik geri sayim baskisi altinda kaydirma veya butona basma ile oy verilir, ardindan dunyanin nasil oy verdigi anlik olarak gosterilir."
        ),
        bodyText(
          "Oyun, gunluk aliskanlik dongusu uzerine kurulu: oy ver > sonuclari gor > seriyi koru > coin kazan > kisiligini kesfet > arkadaslarinla karsilastir."
        ),

        emptyLine(),

        bodyText(
          "Split Second is a mobile app that presents users with one daily \"would you rather\" question. Under 10-second countdown pressure, users vote by swiping or tapping, then instantly see how the world voted."
        ),
        bodyText(
          "The game is built on a daily habit loop: vote > see results > maintain streak > earn coins > discover your personality > compare with friends."
        ),

        divider(),

        // ===== TEMEL OZELLIKLER / KEY FEATURES =====
        heading2("Temel Ozellikler / Key Features"),

        // -- Voting --
        heading3("Oylama Mekanigi / Voting Mechanics"),
        bulletItem("", "Tinder tarzi kaydirma veya butonla oy verme / Tinder-style swipe or tap-to-vote interface"),
        bulletItem("", "10 saniyelik geri sayim zamanlayici (son 3 saniyede nabiz animasyonu) / 10-second countdown timer (pulse animation in final 3 seconds)"),
        bulletItem("", "Oy sonrasi animasyonlu yuzde cubuklari ve toplam oy sayisi / Animated percentage bars and total vote count after voting"),
        bulletItem("", "Soru paylasma + deep link ile arkadasa meydan okuma / Question sharing + deep link friend challenges"),

        // -- Streak --
        heading3("Seri Sistemi / Streak System"),
        bulletItem("", "Ardisik gun oylama takibi (3/7/14/30/50/100 gun hedefleri) / Consecutive day voting tracker with milestones"),
        bulletItem("", "Kilometre taslarinda konfeti animasyonu + coin bonusu / Confetti animation + coin bonus at milestones"),
        bulletItem("", "Push bildirim ile seri hatirlatmasi / Push notification streak reminders"),

        // -- Badges --
        heading3("Rozet Sistemi (18 rozet) / Badge System (18 badges)"),
        bulletItem("14 temel rozet: ", "Ilk oy, hiz seytani (<3sn), gece kusu (00-05), seri rozetleri, davranis rozetleri"),
        bulletItem("14 free badges: ", "First vote, speed demon (<3s), night owl (12-5am), streak badges, behavior badges"),
        bulletItem("4 premium rozet: ", "Koleksiyoncu, modaci, destekci, tamamlayici / Collector, fashionista, supporter, completionist"),
        bulletItem("", "Rozet acilinca toast animasyonu + 20 coin odul / Animated unlock toast + 20 coin reward"),

        // -- Coins --
        heading3("Coin Ekonomisi / Coin Economy"),
        bulletItem("Kazanma: ", "Gunluk oy: +10 | Seri bonusu: +5/+15/+25/+50 | Rozet: +20 | Paylasma: +5"),
        bulletItem("Earning: ", "Daily vote: +10 | Streak bonus: +5/+15/+25/+50 | Badge: +20 | Share: +5"),
        bulletItem("Harcama: ", "Tema (150-200), cerceve (100-120), efekt (100 coin)"),
        bulletItem("Spending: ", "Themes (150-200), frames (100-120), effects (100 coins)"),

        // -- Personality --
        heading3("Kisilik Profili (8 tip) / Personality Profile (8 types)"),
        bulletItem("", "7 oydan sonra acilir, her oyda yeniden hesaplanir / Unlocks after 7 votes, recalculated with each vote"),
        bulletItem("4 eksen (0-100): ", "Uyum, Hiz, Cesitlilik, Cesaret / Conformity, Speed, Diversity, Courage"),
        bulletItem("8 kisilik tipi: ", "Ani Karar Asi, Sogukkanli Stratejist, Icgudusel Sezgici, Yalniz Kurt, Kasif Ruh, Uzman Bilge, Kaos Ajani, Bilge Baykus"),
        bulletItem("8 personality types: ", "Flash Rebel, Cool Strategist, Gut Feeler, Lone Wolf, Explorer Soul, Specialist Sage, Chaos Agent, Wise Owl"),
        bulletItem("", "Ilk acilimda animasyonlu reveal modal + paylabilir kisilik karti"),
        bulletItem("", "Animated first-time reveal modal + shareable personality card"),

        // -- Friends --
        heading3("Arkadas Sistemi / Friends System"),
        bulletItem("", "6 haneli benzersiz arkadas kodu (otomatik atanir) / Auto-generated 6-character unique friend codes"),
        bulletItem("", "Uyumluluk skoru: ortak sorulardaki eslesen oylar yuzdesi / Compatibility score: matching votes on common questions"),
        bulletItem("", "5 kademeli uyum etiketi (Ruh ikizi > Zitlar cekisir) / 5-tier compatibility labels (Soul twins > Opposites attract)"),
        bulletItem("", "Arkadaslarin o gunki secimlerini gorme / See friends' daily choices after voting"),
        bulletItem("", "Free: 3 arkadas, Premium: sinirsiz / Free: 3 friends, Premium: unlimited"),

        // -- Shop --
        heading3("Kozmetik Magaza / Cosmetic Shop"),
        bulletItem("6 tema: ", "Gece Yarisi, Okyanus, Gun Batimi, Orman, Gul Altini, Noir / Midnight, Ocean, Sunset, Forest, Rose Gold, Noir"),
        bulletItem("5 profil cercevesi: ", "Varsayilan, Altin, Neon, Ates, Buz / Default, Gold, Neon, Fire, Ice"),
        bulletItem("4 oy efekti: ", "Standart, Konfeti, Yildirim, Kalpler / Standard, Confetti, Lightning, Hearts"),
        bulletItem("", "Alim oncesi onizleme modali / Preview modal before purchasing"),

        // -- Leaderboard --
        heading3("Siralama Tablosu / Leaderboard"),
        bulletItem("", "En uzun seriye gore ilk 50 kullanici / Top 50 users ranked by longest streak"),
        bulletItem("", "Madalya gostergeleri (altin/gumus/bronz) / Medal indicators (gold/silver/bronze)"),
        bulletItem("", "Kullanicinin kendi siralamasi / User's own ranking displayed"),

        // -- i18n --
        heading3("Coklu Dil Destegi / Localization"),
        bulletItem("", "Turkce ve Ingilizce (cihaz diline gore otomatik) / Turkish and English (auto-detected from device locale)"),
        bulletItem("", "320+ ceviri anahtari, sorular da iki dilde / 320+ translation keys, questions available in both languages"),

        // -- Premium --
        heading3("Premium Katman / Premium Tier"),
        bulletItem("", "Sinirsiz oy gecmisi, detayli istatistikler, tum rozetler / Unlimited vote history, detailed statistics, all badges"),
        bulletItem("", "Ozel temalar, reklamsiz deneyim, sinirsiz arkadas / Custom themes, ad-free experience, unlimited friends"),
        bulletItem("", "Detayli kisilik profili (4 eksen grafigi) / Detailed personality profile (4-axis breakdown)"),

        divider(),

        // ===== TEKNIK MIMARI / TECHNICAL ARCHITECTURE =====
        heading2("Teknik Mimari / Technical Architecture"),

        heading3("Frontend"),
        bulletItem("", "React Native 0.81 + Expo SDK 54 (TypeScript strict mode)"),
        bulletItem("", "expo-router ile dosya tabanli navigasyon (3 tab + deep link route) / File-based routing via expo-router"),
        bulletItem("", "react-native-reanimated ile 60fps animasyonlar / 60fps animations with react-native-reanimated"),
        bulletItem("", "react-native-gesture-handler ile kaydirma mekanigi / Gesture-based voting"),
        bulletItem("", "46 component, 18 custom hook, 23 lib modulu / 46 components, 18 custom hooks, 23 library modules"),

        heading3("Backend"),
        bulletItem("", "Supabase (PostgreSQL + Row Level Security)"),
        bulletItem("", "Anonim kimlik dogrulama (cihaz UUID) / Anonymous authentication (device UUIDs)"),
        bulletItem("", "11 veritabani migration dosyasi (sirali) / 11 sequential database migrations"),
        bulletItem("", "Atomik RPC fonksiyonlari (oy + seri + coin tek islemde) / Atomic RPC functions"),
        bulletItem("", "Tum tablolarda RLS politikalari / RLS policies on all tables"),

        heading3("Test & Kalite / Testing & Quality"),
        bulletItem("", "Jest 30 + React Native Testing Library"),
        bulletItem("", "31 test dosyasi / 31 test files"),
        bulletItem("", "TypeScript strict mode, 0 hata / TypeScript strict mode, 0 errors"),
        bulletItem("", "ESLint zorulunlugu / ESLint enforcement"),

        heading3("Veritabani Tablolari / Database Tables"),
        bulletItem("", "questions, votes, user_streaks, user_profiles"),
        bulletItem("", "user_personality, friendships, owned_cosmetics, unlocked_badges"),
        bulletItem("", "coin_transactions, question_results (view)"),

        divider(),

        // ===== STATS TABLE =====
        heading2("Sayilarla Proje / Project by Numbers"),

        emptyLine(),

        statsTable([
          ["Component sayisi / Components", "46"],
          ["Custom hook", "18"],
          ["Lib modulu / Library modules", "23"],
          ["Test dosyasi / Test files", "31"],
          ["DB migration", "11"],
          ["Rozet / Badges", "18"],
          ["Kisilik tipi / Personality types", "8"],
          ["Tema / Themes", "6"],
          ["Ceviri anahtari / Translation keys", "320+"],
          ["Supabase RPC", "15+"],
        ]),

        divider(),

        // ===== TECH STACK =====
        heading2("Kullanilan Teknolojiler / Tech Stack"),

        techBadges([
          "React Native",
          "Expo SDK 54",
          "TypeScript",
          "Supabase",
          "PostgreSQL",
        ]),
        techBadges([
          "expo-router",
          "react-native-reanimated",
          "react-native-gesture-handler",
        ]),
        techBadges([
          "react-native-view-shot",
          "expo-haptics",
          "expo-notifications",
        ]),
        techBadges([
          "expo-localization",
          "AsyncStorage",
          "Jest",
          "RNTL",
          "EAS Build",
        ]),

        divider(),

        // ===== STATUS =====
        heading2("Durum / Status"),

        bodyText(
          "Gelistirme asamasinda. Temel oyun dongusu, gamification sistemleri, sosyal ozellikler ve kozmetik magaza tamamlandi. Premium monetizasyon altyapisi hazir (RevenueCat entegrasyonu bekliyor)."
        ),
        emptyLine(),
        bodyText(
          "In active development. Core game loop, gamification systems, social features, and cosmetic shop are complete. Premium monetization infrastructure is ready (pending RevenueCat integration)."
        ),

        emptyLine(),
        emptyLine(),

        // ===== FOOTER =====
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
          children: [
            new TextRun({
              text: "Utku Sahin - 2025",
              size: 20,
              color: LIGHT_GRAY,
              font: "Segoe UI",
              italics: true,
            }),
          ],
        }),
      ],
    },
  ],
});

// Generate
Packer.toBuffer(doc).then((buffer) => {
  const outputPath = path.join(__dirname, "..", "Split_Second_Portfolio.docx");
  fs.writeFileSync(outputPath, buffer);
  console.log(`Portfolio document generated: ${outputPath}`);
});
