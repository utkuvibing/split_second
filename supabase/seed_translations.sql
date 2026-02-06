-- ============================================
-- Split Second - Turkish Translations for All Questions
-- Run AFTER 005_question_translations.sql
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- Question 1
UPDATE questions SET
  question_text_tr = 'Uçabilmek mi yoksa görünmez olmak mı?',
  option_a_tr = 'Uçmak',
  option_b_tr = 'Görünmez olmak'
WHERE question_text = 'Would you rather be able to fly or be invisible?';

-- Question 2
UPDATE questions SET
  question_text_tr = 'Her zaman 10 dakika geç mi yoksa 20 dakika erken mi olmayı tercih ederdin?',
  option_a_tr = 'Her zaman geç',
  option_b_tr = 'Her zaman erken'
WHERE question_text = 'Would you rather always be 10 minutes late or 20 minutes early?';

-- Question 3
UPDATE questions SET
  question_text_tr = 'Sınırsız para mı yoksa sınırsız zaman mı?',
  option_a_tr = 'Sınırsız para',
  option_b_tr = 'Sınırsız zaman'
WHERE question_text = 'Would you rather have unlimited money or unlimited time?';

-- Question 4
UPDATE questions SET
  question_text_tr = 'Dağlarda mı yoksa sahilde mi yaşamayı tercih ederdin?',
  option_a_tr = 'Dağlar',
  option_b_tr = 'Sahil'
WHERE question_text = 'Would you rather live in the mountains or by the beach?';

-- Question 5
UPDATE questions SET
  question_text_tr = 'Geleceği bilmek mi yoksa geçmişi değiştirmek mi?',
  option_a_tr = 'Geleceği bilmek',
  option_b_tr = 'Geçmişi değiştirmek'
WHERE question_text = 'Would you rather know the future or change the past?';

-- Question 6
UPDATE questions SET
  question_text_tr = 'Bir yıl telefonsuz mu yoksa bir yıl bilgisayarsız mı?',
  option_a_tr = 'Telefonsuz',
  option_b_tr = 'Bilgisayarsız'
WHERE question_text = 'Would you rather have no phone for a year or no laptop for a year?';

-- Question 7
UPDATE questions SET
  question_text_tr = 'Ünlü olmak mı yoksa ünlü birinin en yakın arkadaşı olmak mı?',
  option_a_tr = 'Ünlü olmak',
  option_b_tr = 'Ünlünün arkadaşı'
WHERE question_text = 'Would you rather be famous or be the best friend of someone famous?';

-- Question 8
UPDATE questions SET
  question_text_tr = 'Ömür boyu sadece pizza mı yoksa sadece suşi mi yemek?',
  option_a_tr = 'Sadece pizza',
  option_b_tr = 'Sadece suşi'
WHERE question_text = 'Would you rather eat only pizza or only sushi for the rest of your life?';

-- Question 9
UPDATE questions SET
  question_text_tr = 'Zihin okumak mı yoksa geleceği görmek mi?',
  option_a_tr = 'Zihin okumak',
  option_b_tr = 'Geleceği görmek'
WHERE question_text = 'Would you rather read minds or predict the future?';

-- Question 10
UPDATE questions SET
  question_text_tr = 'Her zaman çok sıcak mı yoksa her zaman çok soğuk mu olmak?',
  option_a_tr = 'Çok sıcak',
  option_b_tr = 'Çok soğuk'
WHERE question_text = 'Would you rather always be too hot or always be too cold?';

-- Question 11
UPDATE questions SET
  question_text_tr = 'Hayatında duraklat butonu mu yoksa geri sar butonu mu olsun?',
  option_a_tr = 'Duraklat',
  option_b_tr = 'Geri sar'
WHERE question_text = 'Would you rather have a pause button or a rewind button for your life?';

-- Question 12
UPDATE questions SET
  question_text_tr = 'Her dili konuşmak mı yoksa her enstrümanı çalmak mı?',
  option_a_tr = 'Her dili konuşmak',
  option_b_tr = 'Her enstrümanı çalmak'
WHERE question_text = 'Would you rather speak every language or play every instrument?';

-- Question 13
UPDATE questions SET
  question_text_tr = 'Bir daha sosyal medya kullanmamak mı yoksa bir daha film izlememek mi?',
  option_a_tr = 'Sosyal medya yok',
  option_b_tr = 'Film yok'
WHERE question_text = 'Would you rather never use social media again or never watch a movie again?';

-- Question 14
UPDATE questions SET
  question_text_tr = 'Bir korku filminde mi yoksa bir aksiyon filminde mi olmak?',
  option_a_tr = 'Korku filmi',
  option_b_tr = 'Aksiyon filmi'
WHERE question_text = 'Would you rather be stuck in a horror movie or an action movie?';

-- Question 15
UPDATE questions SET
  question_text_tr = 'Her yerde ücretsiz Wi-Fi mı yoksa her yerde ücretsiz kahve mi?',
  option_a_tr = 'Ücretsiz Wi-Fi',
  option_b_tr = 'Ücretsiz kahve'
WHERE question_text = 'Would you rather have free Wi-Fi everywhere or free coffee everywhere?';

-- Question 16
UPDATE questions SET
  question_text_tr = 'Geçmişe mi yoksa geleceğe mi yolculuk etmek?',
  option_a_tr = 'Geçmişe',
  option_b_tr = 'Geleceğe'
WHERE question_text = 'Would you rather travel to the past or to the future?';

-- Question 17
UPDATE questions SET
  question_text_tr = 'Odadaki en komik kişi mi yoksa en zeki kişi mi olmak?',
  option_a_tr = 'En komik',
  option_b_tr = 'En zeki'
WHERE question_text = 'Would you rather be the funniest person or the smartest person in the room?';

-- Question 18
UPDATE questions SET
  question_text_tr = 'Piyangoyu kazanmak mı yoksa iki kat uzun yaşamak mı?',
  option_a_tr = 'Piyango kazanmak',
  option_b_tr = 'İki kat uzun yaşamak'
WHERE question_text = 'Would you rather win the lottery or live twice as long?';

-- Question 19
UPDATE questions SET
  question_text_tr = 'Özel aşçı mı yoksa özel spor hocası mı?',
  option_a_tr = 'Özel aşçı',
  option_b_tr = 'Özel spor hocası'
WHERE question_text = 'Would you rather have a personal chef or a personal trainer?';

-- Question 20
UPDATE questions SET
  question_text_tr = 'Uzayın derinliklerini mi yoksa okyanusun derinliklerini mi keşfetmek?',
  option_a_tr = 'Derin uzay',
  option_b_tr = 'Derin okyanus'
WHERE question_text = 'Would you rather explore deep space or the deep ocean?';

-- Question 21
UPDATE questions SET
  question_text_tr = 'Konuşmak yerine hep şarkı söylemek mi yoksa yürürken hep dans etmek mi?',
  option_a_tr = 'Hep şarkı söylemek',
  option_b_tr = 'Hep dans etmek'
WHERE question_text = 'Would you rather always have to sing instead of speak or dance everywhere you walk?';

-- Question 22
UPDATE questions SET
  question_text_tr = 'Işınlanma yeteneği mi yoksa zamanı durdurma yeteneği mi?',
  option_a_tr = 'Işınlanmak',
  option_b_tr = 'Zamanı durdurmak'
WHERE question_text = 'Would you rather have the ability to teleport or to stop time?';

-- Question 23
UPDATE questions SET
  question_text_tr = 'Müziksiz bir dünyada mı yoksa renksiz bir dünyada mı yaşamak?',
  option_a_tr = 'Müzik yok',
  option_b_tr = 'Renk yok'
WHERE question_text = 'Would you rather live in a world without music or without color?';

-- Question 24
UPDATE questions SET
  question_text_tr = 'Harika bir yazar mı yoksa harika bir konuşmacı mı olmak?',
  option_a_tr = 'Harika yazar',
  option_b_tr = 'Harika konuşmacı'
WHERE question_text = 'Would you rather be a great writer or a great speaker?';

-- Question 25
UPDATE questions SET
  question_text_tr = 'Fotoğrafik hafıza mı yoksa çok yüksek bir IQ mu?',
  option_a_tr = 'Fotoğrafik hafıza',
  option_b_tr = 'Yüksek IQ'
WHERE question_text = 'Would you rather have a photographic memory or an extremely high IQ?';

-- Question 26
UPDATE questions SET
  question_text_tr = 'Büyük şehirde mi yoksa küçük kasabada mı yaşamak?',
  option_a_tr = 'Büyük şehir',
  option_b_tr = 'Küçük kasaba'
WHERE question_text = 'Would you rather live in a big city or a small town?';

-- Question 27
UPDATE questions SET
  question_text_tr = 'Birinin yalan söylediğini hep bilmek mi yoksa yalan söylerken hiç yakalanmamak mı?',
  option_a_tr = 'Yalanı tespit etmek',
  option_b_tr = 'Yalanla paçayı kurtarmak'
WHERE question_text = 'Would you rather always know when someone is lying or always get away with lying?';

-- Question 28
UPDATE questions SET
  question_text_tr = 'Su altında nefes alabilmek mi yoksa duvarlardan geçebilmek mi?',
  option_a_tr = 'Su altında nefes',
  option_b_tr = 'Duvarlardan geçmek'
WHERE question_text = 'Would you rather be able to breathe underwater or walk through walls?';

-- Question 29
UPDATE questions SET
  question_text_tr = 'Gerçek bir süper güce sahip olmak mı yoksa dünyanın en zengin insanı olmak mı?',
  option_a_tr = 'Bir süper güç',
  option_b_tr = 'En zengin insan'
WHERE question_text = 'Would you rather have one real superpower or be the richest person on Earth?';

-- Question 30
UPDATE questions SET
  question_text_tr = 'En güzel gününü tekrar yaşamak mı yoksa en kötü gününü silmek mi?',
  option_a_tr = 'En güzel günü tekrarla',
  option_b_tr = 'En kötü günü sil'
WHERE question_text = 'Would you rather relive your favorite day or erase your worst day?';

-- Question 31
UPDATE questions SET
  question_text_tr = 'Süper güç mü yoksa süper hız mı?',
  option_a_tr = 'Süper güç',
  option_b_tr = 'Süper hız'
WHERE question_text = 'Would you rather have super strength or super speed?';

-- Question 32
UPDATE questions SET
  question_text_tr = 'Ömür boyu sadece kahvaltılık mı yoksa sadece akşam yemeği mi yemek?',
  option_a_tr = 'Sadece kahvaltılık',
  option_b_tr = 'Sadece akşam yemeği'
WHERE question_text = 'Would you rather only eat breakfast food or only eat dinner food?';

-- Question 33
UPDATE questions SET
  question_text_tr = 'İnternetsiz mi yoksa klimasız mı yaşamak?',
  option_a_tr = 'İnternetsiz',
  option_b_tr = 'Klimasız'
WHERE question_text = 'Would you rather live without the internet or live without air conditioning?';

-- Question 34
UPDATE questions SET
  question_text_tr = 'Bir filmde kahraman mı yoksa kötü adam mı olmak?',
  option_a_tr = 'Kahraman',
  option_b_tr = 'Kötü adam'
WHERE question_text = 'Would you rather be the hero or the villain in a movie?';

-- Question 35
UPDATE questions SET
  question_text_tr = 'Her zaman aklından geçeni söylemek mi yoksa bir daha hiç konuşamamak mı?',
  option_a_tr = 'Her zaman dürüst',
  option_b_tr = 'Bir daha konuşmamak'
WHERE question_text = 'Would you rather always say what you think or never speak again?';

-- Question 36
UPDATE questions SET
  question_text_tr = 'Everest''e tırmanmak mı yoksa Mariana Çukuru''na dalmak mı?',
  option_a_tr = 'Everest',
  option_b_tr = 'Mariana Çukuru'
WHERE question_text = 'Would you rather climb Mount Everest or dive the Mariana Trench?';

-- Question 37
UPDATE questions SET
  question_text_tr = 'Ayak yerine el mi yoksa el yerine ayak mı?',
  option_a_tr = 'Ayak yerine el',
  option_b_tr = 'El yerine ayak'
WHERE question_text = 'Would you rather have hands for feet or feet for hands?';

-- Question 38
UPDATE questions SET
  question_text_tr = 'Her mutfağa hâkim olmak mı yoksa her dövüş sanatını bilmek mi?',
  option_a_tr = 'Mutfak ustası',
  option_b_tr = 'Dövüş sanatları ustası'
WHERE question_text = 'Would you rather master every cooking style or master every martial art?';

-- Question 39
UPDATE questions SET
  question_text_tr = 'Yapay zekânın yönettiği bir dünyada mı yoksa teknolojisiz bir dünyada mı yaşamak?',
  option_a_tr = 'Yapay zekâ dünyası',
  option_b_tr = 'Teknolojisiz dünya'
WHERE question_text = 'Would you rather live in a world run by AI or a world with no technology?';

-- Question 40
UPDATE questions SET
  question_text_tr = 'Azla mutlu olmak mı yoksa hep daha fazlasını isteyip zengin olmak mı?',
  option_a_tr = 'Azla mutlu',
  option_b_tr = 'Zengin ama hırslı'
WHERE question_text = 'Would you rather be content with little or always wanting more but richer?';

-- Question 41
UPDATE questions SET
  question_text_tr = 'Her sabah yeni bir ülkede uyanmak mı yoksa memleketinden hiç ayrılmamak mı?',
  option_a_tr = 'Her gün yeni ülke',
  option_b_tr = 'Hiç ayrılmamak'
WHERE question_text = 'Would you rather wake up in a new country every morning or never leave your hometown?';

-- Question 42
UPDATE questions SET
  question_text_tr = 'Ateşi kontrol etmek mi yoksa suyu kontrol etmek mi?',
  option_a_tr = 'Ateşi kontrol',
  option_b_tr = 'Suyu kontrol'
WHERE question_text = 'Would you rather control fire or control water?';

-- Question 43
UPDATE questions SET
  question_text_tr = 'Ömür boyu sadece acılı mı yoksa sadece tatsız yemek mi?',
  option_a_tr = 'Hep acılı',
  option_b_tr = 'Hep tatsız'
WHERE question_text = 'Would you rather eat only spicy food or only bland food forever?';

-- Question 44
UPDATE questions SET
  question_text_tr = 'Bir komedi dizisinde mi yoksa bir drama dizisinde mi oynamak?',
  option_a_tr = 'Komedi dizisi',
  option_b_tr = 'Drama dizisi'
WHERE question_text = 'Would you rather star in a sitcom or a drama series?';

-- Question 45
UPDATE questions SET
  question_text_tr = 'Düşüncelerinin herkese yayınlanması mı yoksa herkesin düşüncelerini duymak mı?',
  option_a_tr = 'Benim düşüncelerim yayınlansın',
  option_b_tr = 'Herkesinkileri duyayım'
WHERE question_text = 'Would you rather have your thoughts broadcast or hear everyone else''s thoughts?';

-- Question 46
UPDATE questions SET
  question_text_tr = 'Tek bir şeyde en iyi olmak mı yoksa her şeyde iyi olmak mı?',
  option_a_tr = 'Tek şeyde en iyi',
  option_b_tr = 'Her şeyde iyi'
WHERE question_text = 'Would you rather be the best at one skill or good at every skill?';

-- Question 47
UPDATE questions SET
  question_text_tr = 'Her hafta paraşütle atlamak mı yoksa bir daha hiç uçağa binmemek mi?',
  option_a_tr = 'Haftalık paraşüt',
  option_b_tr = 'Uçak yok'
WHERE question_text = 'Would you rather go skydiving every week or never fly again?';

-- Question 48
UPDATE questions SET
  question_text_tr = 'Korkulan biri mi yoksa sevilen biri mi olmak?',
  option_a_tr = 'Korkulan',
  option_b_tr = 'Sevilen'
WHERE question_text = 'Would you rather be feared or be loved?';

-- Question 49
UPDATE questions SET
  question_text_tr = 'Robot hizmetçi mi yoksa uçan araba mı?',
  option_a_tr = 'Robot hizmetçi',
  option_b_tr = 'Uçan araba'
WHERE question_text = 'Would you rather have a robot butler or a self-driving flying car?';

-- Question 50
UPDATE questions SET
  question_text_tr = 'Bir teknede mi yoksa bir ağaç evde mi yaşamak?',
  option_a_tr = 'Teknede yaşamak',
  option_b_tr = 'Ağaç evde yaşamak'
WHERE question_text = 'Would you rather live on a boat or live in a treehouse?';

-- Question 51
UPDATE questions SET
  question_text_tr = 'Çok arkadaşı olan içe dönük mü yoksa az arkadaşı olan dışa dönük mü?',
  option_a_tr = 'İçe dönük, çok arkadaş',
  option_b_tr = 'Dışa dönük, az arkadaş'
WHERE question_text = 'Would you rather be an introvert with many friends or an extrovert with few?';

-- Question 52
UPDATE questions SET
  question_text_tr = 'Karınca boyutuna küçülmek mi yoksa bina boyutuna büyümek mi?',
  option_a_tr = 'Karınca boyutu',
  option_b_tr = 'Bina boyutu'
WHERE question_text = 'Would you rather shrink to the size of an ant or grow to the size of a building?';

-- Question 53
UPDATE questions SET
  question_text_tr = 'Sadece kendi yaptığın yemeği mi yoksa sadece restoran yemeği mi yemek?',
  option_a_tr = 'Sadece ev yemeği',
  option_b_tr = 'Sadece restoran'
WHERE question_text = 'Would you rather only eat food you cook or only eat restaurant food?';

-- Question 54
UPDATE questions SET
  question_text_tr = 'Harry Potter dünyasında mı yoksa Star Wars dünyasında mı yaşamak?',
  option_a_tr = 'Harry Potter',
  option_b_tr = 'Star Wars'
WHERE question_text = 'Would you rather live in the world of Harry Potter or the world of Star Wars?';

-- Question 55
UPDATE questions SET
  question_text_tr = 'Mutluyken sallanan bir kuyruk mu yoksa üzgünken düşen kulaklar mı?',
  option_a_tr = 'Sallanan kuyruk',
  option_b_tr = 'Düşen kulaklar'
WHERE question_text = 'Would you rather have a tail that wags when you are happy or ears that droop when you are sad?';

-- Question 56
UPDATE questions SET
  question_text_tr = 'Zombi kıyametinde mi yoksa uzaylı istilasında mı hayatta kalmak?',
  option_a_tr = 'Zombiler',
  option_b_tr = 'Uzaylılar'
WHERE question_text = 'Would you rather survive a zombie apocalypse or an alien invasion?';

-- Question 57
UPDATE questions SET
  question_text_tr = 'Fiziksel olarak hiç yaşlanmamak mı yoksa zihinsel olarak hiç yaşlanmamak mı?',
  option_a_tr = 'Beden yaşlanmasın',
  option_b_tr = 'Zihin yaşlanmasın'
WHERE question_text = 'Would you rather never age physically or never age mentally?';

-- Question 58
UPDATE questions SET
  question_text_tr = 'Anında her dili öğrenmek mi yoksa anında her enstrümanı çalmak mı?',
  option_a_tr = 'Her dili öğren',
  option_b_tr = 'Her enstrümanı çal'
WHERE question_text = 'Would you rather learn any language instantly or learn any instrument instantly?';

-- Question 59
UPDATE questions SET
  question_text_tr = 'Sadece tuşlu telefon mu yoksa sadece masaüstü bilgisayar mı kullanmak?',
  option_a_tr = 'Tuşlu telefon',
  option_b_tr = 'Sadece masaüstü'
WHERE question_text = 'Would you rather only use a flip phone or only use a desktop computer?';

-- Question 60
UPDATE questions SET
  question_text_tr = 'Her zaman resmi giyinmek mi yoksa her zaman pijama giymek mi?',
  option_a_tr = 'Her zaman resmi',
  option_b_tr = 'Her zaman pijama'
WHERE question_text = 'Would you rather always dress formally or always dress in pajamas?';

-- Question 61
UPDATE questions SET
  question_text_tr = 'Acımasızca dürüst mü yoksa kibar bir yalancı mı olmak?',
  option_a_tr = 'Acımasızca dürüst',
  option_b_tr = 'Kibar yalancı'
WHERE question_text = 'Would you rather be brutally honest or a kind liar?';

-- Question 62
UPDATE questions SET
  question_text_tr = 'Röntgen görüşü mü yoksa gece görüşü mü?',
  option_a_tr = 'Röntgen görüşü',
  option_b_tr = 'Gece görüşü'
WHERE question_text = 'Would you rather have X-ray vision or night vision?';

-- Question 63
UPDATE questions SET
  question_text_tr = 'Her gün aynı yemeği mi yemek yoksa en sevdiğin yemeği bir daha yememek mi?',
  option_a_tr = 'Her gün aynı yemek',
  option_b_tr = 'Favorisiz yaşamak'
WHERE question_text = 'Would you rather eat the same meal every day or never eat your favorite food again?';

-- Question 64
UPDATE questions SET
  question_text_tr = 'Gerçek hayatta video oyununda mı yoksa masa oyununda mı olmak?',
  option_a_tr = 'Video oyunu',
  option_b_tr = 'Masa oyunu'
WHERE question_text = 'Would you rather be in a real-life video game or a real-life board game?';

-- Question 65
UPDATE questions SET
  question_text_tr = 'Her 5 dakikada hıçkırmak mı yoksa her 10 dakikada hapşırmak mı?',
  option_a_tr = 'Her 5 dk hıçkırık',
  option_b_tr = 'Her 10 dk hapşırık'
WHERE question_text = 'Would you rather hiccup every 5 minutes or sneeze every 10 minutes?';

-- Question 66
UPDATE questions SET
  question_text_tr = 'Amazon ormanlarında mı yoksa Sahra Çölü''nü geçerek mi yolculuk etmek?',
  option_a_tr = 'Amazon ormanı',
  option_b_tr = 'Sahra Çölü'
WHERE question_text = 'Would you rather trek through the Amazon or cross the Sahara?';

-- Question 67
UPDATE questions SET
  question_text_tr = 'Hayatın anlamını bilmek mi yoksa ölümden sonra ne olduğunu bilmek mi?',
  option_a_tr = 'Hayatın anlamı',
  option_b_tr = 'Ölümden sonrası'
WHERE question_text = 'Would you rather know the meaning of life or know what happens after death?';

-- Question 68
UPDATE questions SET
  question_text_tr = 'Dünya çapında bir ressam mı yoksa dünya çapında bir programcı mı olmak?',
  option_a_tr = 'Dünya çapında ressam',
  option_b_tr = 'Dünya çapında programcı'
WHERE question_text = 'Would you rather be a world-class painter or a world-class programmer?';

-- Question 69
UPDATE questions SET
  question_text_tr = 'Beynine bilgi çipi mi yoksa sağlık çipi mi taktırmak?',
  option_a_tr = 'Bilgi çipi',
  option_b_tr = 'Sağlık çipi'
WHERE question_text = 'Would you rather have a chip in your brain for knowledge or a chip for perfect health?';

-- Question 70
UPDATE questions SET
  question_text_tr = 'Hiç uyumak zorunda olmamak mı yoksa hiç yemek zorunda olmamak mı?',
  option_a_tr = 'Hiç uyumamak',
  option_b_tr = 'Hiç yememek'
WHERE question_text = 'Would you rather never have to sleep or never have to eat?';

-- Question 71
UPDATE questions SET
  question_text_tr = 'Dünyanın en komik insanı mı yoksa en çekici insanı mı olmak?',
  option_a_tr = 'En komik',
  option_b_tr = 'En çekici'
WHERE question_text = 'Would you rather be the funniest person alive or the most attractive?';

-- Question 72
UPDATE questions SET
  question_text_tr = 'Yerçekimini kontrol etmek mi yoksa zamanı kontrol etmek mi?',
  option_a_tr = 'Yerçekimini kontrol',
  option_b_tr = 'Zamanı kontrol'
WHERE question_text = 'Would you rather control gravity or control time?';

-- Question 73
UPDATE questions SET
  question_text_tr = 'Sadece tatlı mı yoksa sadece tuzlu mu yemek?',
  option_a_tr = 'Sadece tatlı',
  option_b_tr = 'Sadece tuzlu'
WHERE question_text = 'Would you rather only eat sweet food or only eat savory food?';

-- Question 74
UPDATE questions SET
  question_text_tr = 'Marvel evreninde mi yoksa DC evreninde mi yaşamak?',
  option_a_tr = 'Marvel evreni',
  option_b_tr = 'DC evreni'
WHERE question_text = 'Would you rather live in the Marvel universe or the DC universe?';

-- Question 75
UPDATE questions SET
  question_text_tr = 'Kalıcı palyaço burnu mu yoksa kalıcı palyaço ayakkabıları mı?',
  option_a_tr = 'Palyaço burnu',
  option_b_tr = 'Palyaço ayakkabıları'
WHERE question_text = 'Would you rather have a permanent clown nose or permanent clown shoes?';

-- Question 76
UPDATE questions SET
  question_text_tr = 'Antik bir harabe mi yoksa terk edilmiş bir uzay istasyonu mu keşfetmek?',
  option_a_tr = 'Antik harabe',
  option_b_tr = 'Uzay istasyonu'
WHERE question_text = 'Would you rather explore an ancient ruin or explore an abandoned space station?';

-- Question 77
UPDATE questions SET
  question_text_tr = 'Zor bir hayatta özgür irade mi yoksa mükemmel bir hayatta iradesizlik mi?',
  option_a_tr = 'Özgür irade, zor hayat',
  option_b_tr = 'İradesiz, mükemmel hayat'
WHERE question_text = 'Would you rather have free will in a hard life or no free will in a perfect life?';

-- Question 78
UPDATE questions SET
  question_text_tr = 'Fotoğrafçılıkta usta mı yoksa topluluk önünde konuşmada usta mı olmak?',
  option_a_tr = 'Fotoğrafçılık ustası',
  option_b_tr = 'Konuşma ustası'
WHERE question_text = 'Would you rather master photography or master public speaking?';

-- Question 79
UPDATE questions SET
  question_text_tr = 'Gerçekten ayırt edilemeyen VR mı yoksa ışınlanma teknolojisi mi?',
  option_a_tr = 'Kusursuz VR',
  option_b_tr = 'Işınlanma'
WHERE question_text = 'Would you rather have VR indistinguishable from reality or teleportation technology?';

-- Question 80
UPDATE questions SET
  question_text_tr = 'Sonsuz ilkbahar mı yoksa sonsuz sonbahar mı?',
  option_a_tr = 'Sonsuz ilkbahar',
  option_b_tr = 'Sonsuz sonbahar'
WHERE question_text = 'Would you rather live in eternal spring or eternal autumn?';

-- Question 81
UPDATE questions SET
  question_text_tr = 'Her zaman doğru sözü bilmek mi yoksa her zaman doğru hareketi bilmek mi?',
  option_a_tr = 'Doğru sözler',
  option_b_tr = 'Doğru hareketler'
WHERE question_text = 'Would you rather always know the right thing to say or always know the right thing to do?';

-- Question 82
UPDATE questions SET
  question_text_tr = 'Hayvanlarla konuşmak mı yoksa tüm insan dillerini bilmek mi?',
  option_a_tr = 'Hayvanlarla konuşmak',
  option_b_tr = 'Tüm insan dilleri'
WHERE question_text = 'Would you rather talk to animals or speak every human language?';

-- Question 83
UPDATE questions SET
  question_text_tr = 'Peynirden mi yoksa çikolatadan mı vazgeçmek?',
  option_a_tr = 'Peynirden vazgeç',
  option_b_tr = 'Çikolatadan vazgeç'
WHERE question_text = 'Would you rather give up cheese or give up chocolate?';

-- Question 84
UPDATE questions SET
  question_text_tr = 'Bir anime karakteri mi yoksa bir Disney karakteri mi olmak?',
  option_a_tr = 'Anime karakteri',
  option_b_tr = 'Disney karakteri'
WHERE question_text = 'Would you rather be a character in an anime or a character in a Disney movie?';

-- Question 85
UPDATE questions SET
  question_text_tr = 'Saçların spagetti mi yoksa terin akçaağaç şurubu mu olsun?',
  option_a_tr = 'Spagetti saç',
  option_b_tr = 'Şurup ter'
WHERE question_text = 'Would you rather have spaghetti for hair or sweat maple syrup?';

-- Question 86
UPDATE questions SET
  question_text_tr = 'Dünyayı yelkenliyle dolaşmak mı yoksa her kıtayı karayoluyla gezmek mi?',
  option_a_tr = 'Yelkenliyle dünya turu',
  option_b_tr = 'Karayoluyla her kıta'
WHERE question_text = 'Would you rather sail around the world or road trip across every continent?';

-- Question 87
UPDATE questions SET
  question_text_tr = '1000 yıllık tek bir hayat mı yoksa 100''er yıllık on hayat mı?',
  option_a_tr = 'Tek uzun hayat',
  option_b_tr = 'On kısa hayat'
WHERE question_text = 'Would you rather live one life of 1000 years or ten lives of 100 years?';

-- Question 88
UPDATE questions SET
  question_text_tr = 'Elit bir hacker mı yoksa elit bir müzakereci mi olmak?',
  option_a_tr = 'Elit hacker',
  option_b_tr = 'Elit müzakereci'
WHERE question_text = 'Would you rather be an elite hacker or an elite negotiator?';

-- Question 89
UPDATE questions SET
  question_text_tr = 'Yemek basan 3D yazıcı mı yoksa kıyafet basan 3D yazıcı mı?',
  option_a_tr = 'Yemek yazıcısı',
  option_b_tr = 'Kıyafet yazıcısı'
WHERE question_text = 'Would you rather have a 3D printer that prints food or one that prints clothes?';

-- Question 90
UPDATE questions SET
  question_text_tr = 'Haftada 4 gün çalışmak mı yoksa sonsuza kadar uzaktan çalışmak mı?',
  option_a_tr = 'Haftada 4 gün',
  option_b_tr = 'Sonsuza kadar uzaktan'
WHERE question_text = 'Would you rather work 4 days a week or work remotely forever?';

-- Question 91
UPDATE questions SET
  question_text_tr = 'Hiç yalan söyleyememek mi yoksa hiç iğnelemeyi anlayamamak mı?',
  option_a_tr = 'Yalan söyleyememek',
  option_b_tr = 'İğnelemeyi anlamamak'
WHERE question_text = 'Would you rather be unable to lie or unable to detect sarcasm?';

-- Question 92
UPDATE questions SET
  question_text_tr = 'İyileştirme gücü mü yoksa uçma yeteneği mi?',
  option_a_tr = 'İyileştirme gücü',
  option_b_tr = 'Uçma yeteneği'
WHERE question_text = 'Would you rather have healing powers or the ability to fly?';

-- Question 93
UPDATE questions SET
  question_text_tr = 'Bir daha kahve içmemek mi yoksa bir daha gazlı içecek içmemek mi?',
  option_a_tr = 'Kahve yok',
  option_b_tr = 'Gazlı içecek yok'
WHERE question_text = 'Would you rather never drink coffee again or never drink soda again?';

-- Question 94
UPDATE questions SET
  question_text_tr = 'Gişe rekorlu bir filmin yönetmeni mi yoksa çok satan bir kitabın yazarı mı olmak?',
  option_a_tr = 'Film yönetmeni',
  option_b_tr = 'Kitap yazarı'
WHERE question_text = 'Would you rather be the director of a blockbuster or the author of a bestseller?';

-- Question 95
UPDATE questions SET
  question_text_tr = 'Konuşan bir evcil hayvan mı yoksa uçan bir bisiklet mi?',
  option_a_tr = 'Konuşan evcil hayvan',
  option_b_tr = 'Uçan bisiklet'
WHERE question_text = 'Would you rather have a talking pet or a flying bicycle?';

-- Question 96
UPDATE questions SET
  question_text_tr = 'Bir yıl uzayda mı yoksa bir yıl ıssız adada mı geçirmek?',
  option_a_tr = 'Uzayda bir yıl',
  option_b_tr = 'Issız adada bir yıl'
WHERE question_text = 'Would you rather spend a year in space or a year on a deserted island?';

-- Question 97
UPDATE questions SET
  question_text_tr = 'Gerçek eşitlik mi yoksa gerçek özgürlük mü?',
  option_a_tr = 'Gerçek eşitlik',
  option_b_tr = 'Gerçek özgürlük'
WHERE question_text = 'Would you rather experience true equality or true freedom?';

-- Question 98
UPDATE questions SET
  question_text_tr = 'Dünyanın en iyi dansçısı mı yoksa en iyi şarkıcısı mı olmak?',
  option_a_tr = 'En iyi dansçı',
  option_b_tr = 'En iyi şarkıcı'
WHERE question_text = 'Would you rather be the best dancer or the best singer in the world?';

-- Question 99
UPDATE questions SET
  question_text_tr = 'Geleceğini gösteren akıllı saat mi yoksa insanların düşüncelerini gösteren gözlük mü?',
  option_a_tr = 'Gelecek saati',
  option_b_tr = 'Düşünce gözlüğü'
WHERE question_text = 'Would you rather have a smartwatch that predicts your future or glasses that show people''s thoughts?';

-- Question 100
UPDATE questions SET
  question_text_tr = 'Hep gündüz olan bir dünyada mı yoksa hep gece olan bir dünyada mı yaşamak?',
  option_a_tr = 'Hep gündüz',
  option_b_tr = 'Hep gece'
WHERE question_text = 'Would you rather live in a world where it is always daytime or always nighttime?';
