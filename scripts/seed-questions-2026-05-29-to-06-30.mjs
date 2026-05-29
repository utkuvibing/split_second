/**
 * Generates SQL INSERT for 33 days × 3 slots (99 questions), 2026-05-29 .. 2026-06-30
 * Run: node scripts/seed-questions-2026-05-29-to-06-30.mjs
 */

import fs from 'fs';

const START = new Date('2026-05-29T12:00:00');
const END = new Date('2026-06-30T12:00:00');

const slots = ['morning', 'afternoon', 'evening'];

// 33 days × 3 = 99 unique dilemmas (EN + TR)
const bank = [
  // May 29
  { cat: 'lifestyle', en: ['Would you rather wake up at 5 AM with full energy or sleep until noon guilt-free?', '5 AM full energy', 'Noon guilt-free'], tr: ['Her gün 05:00\'te zinde uyanmak mı yoksa öğlene kadar suçsuz uyumak mı?', '05:00 zinde uyanış', 'Öğlene kadar suçsuz uyku'] },
  { cat: 'technology', en: ['Would you rather have perfect Wi-Fi everywhere or never charge your phone again?', 'Perfect Wi-Fi', 'Never charge phone'], tr: ['Her yerde kusursuz Wi-Fi mi yoksa telefonu hiç şarj etmemek mi?', 'Kusursuz Wi-Fi', 'Şarjsız telefon'] },
  { cat: 'philosophy', en: ['Would you rather know every truth about your past or every truth about your future?', 'All past truths', 'All future truths'], tr: ['Geçmişinle ilgili tüm gerçekleri bilmek mi yoksa geleceğinle ilgili tüm gerçekleri bilmek mi?', 'Geçmiş gerçekleri', 'Gelecek gerçekleri'] },
  // May 30
  { cat: 'food', en: ['Would you rather only eat breakfast foods forever or only eat dinner foods forever?', 'Breakfast forever', 'Dinner forever'], tr: ['Sonsuza kadar sadece kahvaltılık mı yoksa sadece akşam yemeği mi yemek?', 'Sadece kahvaltı', 'Sadece akşam yemeği'] },
  { cat: 'skills', en: ['Would you rather be an instant master chef or an instant master mechanic?', 'Master chef', 'Master mechanic'], tr: ['Anında usta şef mi yoksa anında usta tamirci mi olmak?', 'Usta şef', 'Usta tamirci'] },
  { cat: 'adventure', en: ['Would you rather ride a hot air balloon over mountains or scuba dive in a coral reef?', 'Hot air balloon', 'Coral reef dive'], tr: ['Dağların üzerinde balonla mı uçmak yoksa mercan resifinde mi dalış yapmak?', 'Balon turu', 'Mercan dalışı'] },
  // May 31
  { cat: 'funny', en: ['Would you rather have your laugh sound like a duck or your footsteps sound like drums?', 'Duck laugh', 'Drum footsteps'], tr: ['Gülüşün ördek sesi mi olsun yoksa adımların davul sesi mi?', 'Ördek gülüşü', 'Davul adımları'] },
  { cat: 'personality', en: ['Would you rather always stay calm in arguments or always win arguments?', 'Stay calm', 'Always win'], tr: ['Tartışmalarda hep sakin kalmak mı yoksa tartışmaları hep kazanmak mı?', 'Hep sakin', 'Hep kazan'] },
  { cat: 'entertainment', en: ['Would you rather attend every concert of your favorite artist or meet them once privately?', 'Every concert', 'One private meet'], tr: ['Favori sanatçının her konserine mi gitmek yoksa onunla bir kez özel mi buluşmak?', 'Her konser', 'Tek özel buluşma'] },
  // Jun 1
  { cat: 'superpower', en: ['Would you rather pause time for 10 seconds once a day or rewind 5 seconds once a day?', 'Pause 10 sec', 'Rewind 5 sec'], tr: ['Günde bir kez 10 saniye zamanı durdurmak mı yoksa 5 saniye geri sarmak mı?', '10 sn durdur', '5 sn geri sar'] },
  { cat: 'lifestyle', en: ['Would you rather live in a tiny home with a huge garden or a mansion with no yard?', 'Tiny home + garden', 'Mansion no yard'], tr: ['Dev bahçeli minik evde mi yoksa bahçesiz malikânede mi yaşamak?', 'Minik ev + bahçe', 'Malikâne, bahçe yok'] },
  { cat: 'philosophy', en: ['Would you rather be remembered for kindness or remembered for genius?', 'Remembered kind', 'Remembered genius'], tr: ['İyilikle mi hatırlanmak yoksa deha olarak mı hatırlanmak?', 'İyilikle hatırlan', 'Deha olarak hatırlan'] },
  // Jun 2
  { cat: 'food', en: ['Would you rather have spicy food with no heat sensation or mild food that feels extremely hot?', 'Spicy no heat', 'Mild feels hot'], tr: ['Acı hissetmeden baharatlı yemek mi yoksa hafif ama aşırı acı hissedilen yemek mi?', 'Acısız baharat', 'Hafif ama çok acı'] },
  { cat: 'technology', en: ['Would you rather type at 200 WPM or read at 2000 WPM?', 'Type 200 WPM', 'Read 2000 WPM'], tr: ['Dakikada 200 kelime yazmak mı yoksa dakikada 2000 kelime okumak mı?', '200 WPM yazma', '2000 WPM okuma'] },
  { cat: 'adventure', en: ['Would you rather hike the Inca Trail or cycle across the Netherlands?', 'Inca Trail', 'Cycle Netherlands'], tr: ['İnka Yolu\'nda yürümek mi yoksa Hollanda\'yı bisikletle geçmek mi?', 'İnka Yolu', 'Hollanda bisiklet'] },
  // Jun 3
  { cat: 'funny', en: ['Would you rather sneeze glitter or cry confetti?', 'Sneeze glitter', 'Cry confetti'], tr: ['Hapşırınca sim mi çıksın yoksa ağlayınca konfeti mi?', 'Sim hapşırık', 'Konfeti gözyaşı'] },
  { cat: 'skills', en: ['Would you rather compose hit songs in your head or paint masterpieces from memory?', 'Compose hits', 'Paint from memory'], tr: ['Kafandan hit şarkılar mı yazmak yoksa hafızandan başyapıt tablolar mı çizmek?', 'Hit şarkılar', 'Hafızadan tablo'] },
  { cat: 'entertainment', en: ['Would you rather star in a sitcom or host a nature documentary?', 'Star in sitcom', 'Nature host'], tr: ['Bir sitcom\'da başrol mü almak yoksa doğa belgeseli mi sunmak?', 'Sitcom başrol', 'Doğa sunucusu'] },
  // Jun 4
  { cat: 'personality', en: ['Would you rather be overly optimistic or realistically pessimistic?', 'Overly optimistic', 'Realistic pessimist'], tr: ['Aşırı iyimser mi yoksa gerçekçi kötümser mi olmak?', 'Aşırı iyimser', 'Gerçekçi kötümser'] },
  { cat: 'superpower', en: ['Would you rather breathe underwater or withstand any temperature?', 'Breathe underwater', 'Any temperature'], tr: ['Suda nefes almak mı yoksa her sıcaklığa dayanmak mı?', 'Suda nefes', 'Her sıcaklık'] },
  { cat: 'lifestyle', en: ['Would you rather have one perfect outfit forever or unlimited clothes that never fit perfectly?', 'One perfect outfit', 'Unlimited imperfect'], tr: ['Sonsuza kadar tek mükemmel kıyafet mi yoksa hiç tam oturmayan sınırsız kıyafet mi?', 'Tek mükemmel', 'Sınırsız ama oturmaz'] },
  // Jun 5
  { cat: 'philosophy', en: ['Would you rather change one decision from your past or know one decision in your future?', 'Change past decision', 'Know future decision'], tr: ['Geçmişte bir kararı değiştirmek mi yoksa gelecekte bir kararı bilmek mi?', 'Geçmiş karar', 'Gelecek karar'] },
  { cat: 'food', en: ['Would you rather eat only street food or only fine dining for a year?', 'Street food year', 'Fine dining year'], tr: ['Bir yıl sadece sokak lezzeti mi yoksa sadece fine dining mi?', 'Sokak lezzeti', 'Fine dining'] },
  { cat: 'adventure', en: ['Would you rather camp under the northern lights or stargaze in the Atacama Desert?', 'Northern lights camp', 'Atacama stars'], tr: ['Kutup ışıkları altında kamp mı yoksa Atacama\'da yıldız izlemek mi?', 'Kutup ışığı kampı', 'Atacama yıldızları'] },
  // Jun 6
  { cat: 'technology', en: ['Would you rather have AI manage your calendar or AI manage your conversations?', 'AI calendar', 'AI conversations'], tr: ['Takvimini yapay zekâ mı yönetsin yoksa konuşmalarını mı?', 'YZ takvim', 'YZ konuşma'] },
  { cat: 'funny', en: ['Would you rather have a permanent theme song when you enter rooms or a laugh track for your life?', 'Entrance theme', 'Life laugh track'], tr: ['Odaya girince kalıcı marş mı çalsın yoksa hayatına kahkaha efekti mi eklensin?', 'Giriş marşı', 'Kahkaha efekti'] },
  { cat: 'skills', en: ['Would you rather solve any math problem instantly or write any essay instantly?', 'Instant math', 'Instant essays'], tr: ['Her matematik sorusunu anında çözmek mi yoksa her kompozisyonu anında yazmak mı?', 'Anında matematik', 'Anında yazı'] },
  // Jun 7
  { cat: 'entertainment', en: ['Would you rather be a legendary game speedrunner or a legendary eSports captain?', 'Speedrunner', 'eSports captain'], tr: ['Efsane hız koşucusu mu yoksa efsane e-spor kaptanı mı olmak?', 'Hız koşucusu', 'E-spor kaptanı'] },
  { cat: 'personality', en: ['Would you rather forgive instantly or hold grudges accurately?', 'Forgive instantly', 'Accurate grudges'], tr: ['Anında affetmek mi yoksa kinleri kusursuz hatırlamak mı?', 'Anında affet', 'Kusursuz kin'] },
  { cat: 'superpower', en: ['Would you rather run at 60 mph or jump 30 feet high?', 'Run 60 mph', 'Jump 30 feet'], tr: ['Saatte 100 km koşmak mı yoksa 9 metreye zıplamak mı?', '100 km/s koşu', '9 m zıplama'] },
  // Jun 8
  { cat: 'lifestyle', en: ['Would you rather always take the stairs or always take scenic routes?', 'Always stairs', 'Scenic routes'], tr: ['Her zaman merdiven mi kullanmak yoksa her zaman manzaralı yol mu seçmek?', 'Her zaman merdiven', 'Manzaralı yol'] },
  { cat: 'philosophy', en: ['Would you rather live without regret or live without fear?', 'Without regret', 'Without fear'], tr: ['Pişmanlık olmadan mı yoksa korku olmadan mı yaşamak?', 'Pişmanlıksız', 'Korkusuz'] },
  { cat: 'food', en: ['Would you rather have perfect homemade meals or perfect restaurant meals daily?', 'Homemade daily', 'Restaurant daily'], tr: ['Her gün mükemmel ev yemeği mi yoksa her gün mükemmel restoran yemeği mi?', 'Ev yemeği', 'Restoran yemeği'] },
  // Jun 9
  { cat: 'adventure', en: ['Would you rather dogsled in Alaska or kayak through Norwegian fjords?', 'Alaska dogsled', 'Norway kayak'], tr: ['Alaska\'da kızak mı sürmek yoksa Norveç fiyordlarında kano mu?', 'Alaska kızak', 'Norveç kano'] },
  { cat: 'technology', en: ['Would you rather have no social media ever or no streaming services ever?', 'No social media', 'No streaming'], tr: ['Hiç sosyal medya olmaması mı yoksa hiç streaming olmaması mı?', 'Sosyal medya yok', 'Streaming yok'] },
  { cat: 'funny', en: ['Would you rather have eyebrows that change color with mood or hair that grows an inch daily?', 'Mood eyebrows', 'Daily inch hair'], tr: ['Ruh haline göre renk değiştiren kaşlar mı yoksa günde 2,5 cm uzayan saç mı?', 'Renkli kaşlar', 'Hızlı saç'] },
  // Jun 10
  { cat: 'skills', en: ['Would you rather improvise comedy flawlessly or debate flawlessly?', 'Flawless comedy', 'Flawless debate'], tr: ['Kusursuz doğaçlama komedi mi yapmak yoksa kusursuz münazara mı?', 'Kusursuz komedi', 'Kusursuz münazara'] },
  { cat: 'entertainment', en: ['Would you rather write a cult classic film or direct a viral music video?', 'Cult classic film', 'Viral music video'], tr: ['Kült klasik film mi yazmak yoksa viral müzik klibi mi yönetmek?', 'Kült film', 'Viral klip'] },
  { cat: 'personality', en: ['Would you rather be the peacemaker in every group or the motivator in every group?', 'Peacemaker', 'Motivator'], tr: ['Her grupta barış yapıcı mı yoksa motive edici mi olmak?', 'Barış yapıcı', 'Motive edici'] },
  // Jun 11
  { cat: 'superpower', en: ['Would you rather duplicate any object once a day or erase small mistakes once a day?', 'Duplicate object', 'Erase mistake'], tr: ['Günde bir kez bir nesneyi çoğaltmak mı yoksa küçük bir hatayı silmek mi?', 'Nesne çoğalt', 'Hata sil'] },
  { cat: 'lifestyle', en: ['Would you rather always travel light with one bag or always travel prepared with three bags?', 'One bag light', 'Three bags prepared'], tr: ['Tek çantayla hafif mi gezmek yoksa üç çantayla hazırlıklı mı?', 'Tek çanta', 'Üç çanta'] },
  { cat: 'philosophy', en: ['Would you rather sacrifice comfort for purpose or sacrifice purpose for comfort?', 'Comfort for purpose', 'Purpose for comfort'], tr: ['Konforu amaç uğruna mı feda etmek yoksa amacı konfor uğruna mı?', 'Amaç için konfor', 'Konfor için amaç'] },
  // Jun 12
  { cat: 'food', en: ['Would you rather taste every ingredient perfectly or never taste anything bad?', 'Taste everything', 'Never bad taste'], tr: ['Her malzemeyi mükemmel tatmak mı yoksa hiç kötü tat almamak mı?', 'Her şeyi tat', 'Kötü tat yok'] },
  { cat: 'adventure', en: ['Would you rather explore ice caves in Iceland or sand dunes in Namibia?', 'Iceland ice caves', 'Namibia dunes'], tr: ['İzlanda buz mağaraları mı yoksa Namib kumulları mı?', 'Buz mağarası', 'Kumullar'] },
  { cat: 'technology', en: ['Would you rather have a robot clean your home or a robot cook your meals?', 'Robot cleaner', 'Robot chef'], tr: ['Evi temizleyen robot mu yoksa yemek yapan robot mu?', 'Temizlik robotu', 'Aşçı robotu'] },
  // Jun 13
  { cat: 'funny', en: ['Would you rather have to speak in rhymes one day a week or dance before every meal?', 'Rhyme day', 'Dance before meals'], tr: ['Haftada bir gün kafiyeli mi konuşmak yoksa her yemekten önce dans mı etmek?', 'Kafiyeli gün', 'Yemek dansı'] },
  { cat: 'skills', en: ['Would you rather master chess or master poker?', 'Master chess', 'Master poker'], tr: ['Satrançta mı usta olmak yoksa pokarda mı?', 'Satranç ustası', 'Poker ustası'] },
  { cat: 'entertainment', en: ['Would you rather voice a famous cartoon character or choreograph a world tour?', 'Cartoon voice', 'World tour choreo'], tr: ['Ünlü çizgi film karakterine ses mi vermek yoksa dünya turu koreografisi mi yapmak?', 'Seslendirme', 'Koreografi'] },
  // Jun 14
  { cat: 'personality', en: ['Would you rather trust your gut always or trust data always?', 'Trust gut', 'Trust data'], tr: ['Her zaman içgüdüye mi güvenmek yoksa her zaman veriye mi?', 'İçgüdü', 'Veri'] },
  { cat: 'superpower', en: ['Would you rather speak to plants or understand baby talk in any language?', 'Talk to plants', 'Understand babies'], tr: ['Bitkilerle konuşmak mı yoksa her dilde bebek mırıltısını anlamak mı?', 'Bitki dili', 'Bebek dili'] },
  { cat: 'lifestyle', en: ['Would you rather have rainy days only or sunny days only?', 'Rainy only', 'Sunny only'], tr: ['Sadece yağmurlu günler mi yoksa sadece güneşli günler mi olsun?', 'Sadece yağmur', 'Sadece güneş'] },
  // Jun 15
  { cat: 'philosophy', en: ['Would you rather be universally liked or deeply respected by a few?', 'Universally liked', 'Deeply respected'], tr: ['Herkes tarafından sevilen mi olmak yoksa az kişi tarafından derinden saygı duyulan mı?', 'Herkes sever', 'Az kişi saygı'] },
  { cat: 'food', en: ['Would you rather have unlimited exotic fruit or unlimited artisan bread?', 'Exotic fruit', 'Artisan bread'], tr: ['Sınırsız egzotik meyve mi yoksa sınırsız artisan ekmek mi?', 'Egzotik meyve', 'Artisan ekmek'] },
  { cat: 'adventure', en: ['Would you rather ride a motorcycle across Route 66 or sail the Greek islands?', 'Route 66 bike', 'Greek islands sail'], tr: ['Route 66\'da motosiklet mi yoksa Yunan adalarında yelken mi?', 'Route 66', 'Yunan yelken'] },
  // Jun 16
  { cat: 'technology', en: ['Would you rather have passwords memorized for you or bills paid automatically with perfect budgeting?', 'Auto passwords', 'Auto budgeting'], tr: ['Şifrelerin hatırlanması mı yoksa faturaların mükemmel bütçeyle otomatik ödenmesi mi?', 'Otomatik şifre', 'Otomatik bütçe'] },
  { cat: 'funny', en: ['Would you rather have a phone that autocorrects to compliments or roasts?', 'Compliment autocorrect', 'Roast autocorrect'], tr: ['Telefon övgüye mi düzeltsin yoksa dalga geçmeye mi?', 'Övgü düzeltme', 'Dalga düzeltme'] },
  { cat: 'skills', en: ['Would you rather build furniture by hand perfectly or code apps perfectly on first try?', 'Hand furniture', 'Perfect first code'], tr: ['El yapımı mobilyayı kusursuz mu yapmak yoksa uygulamayı ilk seferde kusursuz mu kodlamak?', 'El mobilya', 'İlk sefer kod'] },
  // Jun 17
  { cat: 'entertainment', en: ['Would you rather be a famous podcast host or a famous Twitch streamer?', 'Podcast host', 'Twitch streamer'], tr: ['Ünlü podcast sunucusu mu yoksa ünlü Twitch yayıncısı mı olmak?', 'Podcast', 'Twitch'] },
  { cat: 'personality', en: ['Would you rather lead silently by example or lead loudly with charisma?', 'Silent example', 'Loud charisma'], tr: ['Sessizce örnek olarak mı liderlik etmek yoksa karizmayla yüksek sesle mi?', 'Sessiz örnek', 'Karizmatik lider'] },
  { cat: 'superpower', en: ['Would you rather see one minute into the future or hear thoughts for one minute?', 'See 1 min future', 'Hear 1 min thoughts'], tr: ['Geleceğin bir dakikasını görmek mi yoksa bir dakika düşünce duymak mı?', '1 dk gelecek', '1 dk düşünce'] },
  // Jun 18
  { cat: 'lifestyle', en: ['Would you rather work outdoors in nature or work indoors with a perfect view?', 'Outdoors nature', 'Indoors perfect view'], tr: ['Doğada açık havada mı çalışmak yoksa mükemmel manzaralı kapalı alanda mı?', 'Açık hava', 'Manzaralı iç mekân'] },
  { cat: 'philosophy', en: ['Would you rather have unlimited curiosity or unlimited patience?', 'Unlimited curiosity', 'Unlimited patience'], tr: ['Sınırsız merak mı yoksa sınırsız sabır mı?', 'Sınırsız merak', 'Sınırsız sabır'] },
  { cat: 'food', en: ['Would you rather only drink smoothies or only eat salads for a month?', 'Smoothies month', 'Salads month'], tr: ['Bir ay sadece smoothie mi içmek yoksa sadece salata mı yemek?', 'Smoothie ayı', 'Salata ayı'] },
  // Jun 19
  { cat: 'adventure', en: ['Would you rather paraglide over the Alps or whitewater raft in Costa Rica?', 'Alps paraglide', 'Costa Rica raft'], tr: ['Alpler\'de yamaç paraşütü mü yoksa Kosta Rika\'da rafting mi?', 'Alpler paraşüt', 'Kosta Rika rafting'] },
  { cat: 'technology', en: ['Would you rather have a self-driving car or a personal drone for commuting?', 'Self-driving car', 'Commute drone'], tr: ['Otonom araba mı yoksa işe gidiş için kişisel drone mu?', 'Otonom araba', 'Kişisel drone'] },
  { cat: 'funny', en: ['Would you rather have to announce your every action or narrate your life in third person?', 'Announce actions', 'Third person life'], tr: ['Her hareketini sesli mi duyurmak yoksa hayatını 3. tekil şahısla mı anlatmak?', 'Sesli duyuru', '3. tekil anlatım'] },
  // Jun 20
  { cat: 'skills', en: ['Would you rather win any trivia show or win any cooking competition?', 'Trivia winner', 'Cooking winner'], tr: ['Her bilgi yarışmasını mı kazanmak yoksa her yemek yarışmasını mı?', 'Bilgi yarışması', 'Yemek yarışması'] },
  { cat: 'entertainment', en: ['Would you rather create a hit meme format or create a viral dance?', 'Hit meme', 'Viral dance'], tr: ['Hit meme formatı mı yaratmak yoksa viral dans mı?', 'Hit meme', 'Viral dans'] },
  { cat: 'personality', en: ['Would you rather be known as reliable or known as exciting?', 'Known reliable', 'Known exciting'], tr: ['Güvenilir olarak mı tanınmak yoksa heyecan verici olarak mı?', 'Güvenilir', 'Heyecan verici'] },
  // Jun 21
  { cat: 'superpower', en: ['Would you rather never get lost or never get tired while walking?', 'Never lost', 'Never tired walking'], tr: ['Hiç kaybolmamak mı yoksa yürürken hiç yorulmamak mı?', 'Kaybolmaz', 'Yürüyüşte yorulmaz'] },
  { cat: 'lifestyle', en: ['Would you rather have a built-in morning routine or a built-in evening wind-down?', 'Built-in morning', 'Built-in evening'], tr: ['Yerleşik sabah rutini mi yoksa yerleşik akşam sakinleşme rutini mi?', 'Sabah rutini', 'Akşam rutini'] },
  { cat: 'philosophy', en: ['Would you rather always tell the hard truth or always say the kind thing?', 'Hard truth', 'Kind thing'], tr: ['Her zaman zor gerçeği mi söylemek yoksa her zaman nazik olanı mı?', 'Zor gerçek', 'Nazik söz'] },
  // Jun 22
  { cat: 'food', en: ['Would you rather have breakfast for every meal or dessert for every meal?', 'Breakfast every meal', 'Dessert every meal'], tr: ['Her öğünde kahvaltı mı yoksa her öğünde tatlı mı?', 'Her öğün kahvaltı', 'Her öğün tatlı'] },
  { cat: 'adventure', en: ['Would you rather sleep in a treehouse resort or an underwater hotel room?', 'Treehouse resort', 'Underwater room'], tr: ['Ağaç ev resort\'ta mı uyumak yoksa su altı otel odasında mı?', 'Ağaç ev', 'Su altı oda'] },
  { cat: 'technology', en: ['Would you rather have one universal remote for everything or one universal translator earpiece?', 'Universal remote', 'Translator earpiece'], tr: ['Her şey için evrensel kumanda mı yoksa evrensel çevirmen kulaklık mı?', 'Evrensel kumanda', 'Çevirmen kulaklık'] },
  // Jun 23
  { cat: 'funny', en: ['Would you rather have a rewind button for awkward moments or a skip button for boring meetings?', 'Rewind awkward', 'Skip boring'], tr: ['Utanç anları için geri sarma mı yoksa sıkıcı toplantılar için atlama mı?', 'Utanç geri sar', 'Toplantı atla'] },
  { cat: 'skills', en: ['Would you rather learn sign language fluently or learn Morse code fluently?', 'Sign language', 'Morse code'], tr: ['İşaret dilinde mi akıcı olmak yoksa Mors alfabesinde mi?', 'İşaret dili', 'Mors kodu'] },
  { cat: 'entertainment', en: ['Would you rather attend the Olympics opening ceremony or the World Cup final?', 'Olympics opening', 'World Cup final'], tr: ['Olimpiyat açılış törenine mi gitmek yoksa Dünya Kupası finaline mi?', 'Olimpiyat açılış', 'Dünya Kupası final'] },
  // Jun 24
  { cat: 'personality', en: ['Would you rather be fiercely independent or deeply collaborative?', 'Fiercely independent', 'Deeply collaborative'], tr: ['Şiddetle bağımsız mı olmak yoksa derinlemesine iş birlikçi mi?', 'Bağımsız', 'İş birlikçi'] },
  { cat: 'superpower', en: ['Would you rather calm any animal instantly or charm any crowd instantly?', 'Calm animals', 'Charm crowds'], tr: ['Her hayvanı anında sakinleştirmek mi yoksa her kalabalığı anında etkilemek mi?', 'Hayvan sakin', 'Kalabalık etkile'] },
  { cat: 'lifestyle', en: ['Would you rather have no alarm clocks or no deadlines ever?', 'No alarms', 'No deadlines'], tr: ['Hiç alarm olmaması mı yoksa hiç son teslim tarihi olmaması mı?', 'Alarm yok', 'Deadline yok'] },
  // Jun 25
  { cat: 'philosophy', en: ['Would you rather be certain about nothing or certain about everything but be wrong half the time?', 'Certain about nothing', 'Certain but half wrong'], tr: ['Hiçbir şeyden emin olmamak mı yoksa her şeyden emin olup yarısında yanılmak mı?', 'Hiç emin değil', 'Emin ama yarı yanlış'] },
  { cat: 'food', en: ['Would you rather cook with a famous chef once or inherit a secret family recipe book?', 'Cook with chef', 'Secret recipe book'], tr: ['Ünlü şefle bir kez mi pişirmek yoksa gizli aile tarif defterini mi miras almak?', 'Şefle pişir', 'Gizli tarifler'] },
  { cat: 'adventure', en: ['Would you rather ride the Trans-Siberian Railway or drive the Pacific Coast Highway?', 'Trans-Siberian', 'Pacific Coast drive'], tr: ['Trans-Sibir treni mi yoksa Pasifik kıyı otoyolu mu?', 'Trans-Sibir', 'Pasifik otoyol'] },
  // Jun 26
  { cat: 'technology', en: ['Would you rather have holographic video calls or smell-o-vision for movies?', 'Holographic calls', 'Smell-o-vision'], tr: ['Holografik görüntülü arama mı yoksa kokulu sinema mı?', 'Holografik arama', 'Kokulu sinema'] },
  { cat: 'funny', en: ['Would you rather have your photos always photobombed by pigeons or by squirrels?', 'Pigeon photobomb', 'Squirrel photobomb'], tr: ['Fotoğraflarına hep güvercin mi sinsin yoksa sincap mı?', 'Güvercin photobomb', 'Sincap photobomb'] },
  { cat: 'skills', en: ['Would you rather solve a Rubik\'s cube in 10 seconds or memorize a deck of cards in 10 seconds?', 'Cube 10 sec', 'Deck 10 sec'], tr: ['Rubik küpü 10 saniyede mi çözmek yoksa kart destesini 10 saniyede mi ezberlemek?', 'Küp 10 sn', 'Deste 10 sn'] },
  // Jun 27
  { cat: 'entertainment', en: ['Would you rather be a guest on a late-night show or headline a music festival?', 'Late-night guest', 'Festival headliner'], tr: ['Gece talk show\'una konuk mu olmak yoksa müzik festivalinde başrol mü?', 'Talk show', 'Festival başrol'] },
  { cat: 'personality', en: ['Would you rather apologize first always or receive apologies first always?', 'Apologize first', 'Receive first'], tr: ['Her zaman ilk özür mü dilemek yoksa her zaman ilk özürü mü almak?', 'İlk özür dile', 'İlk özür al'] },
  { cat: 'superpower', en: ['Would you rather shrink to ant size once a week or grow to giant size once a week?', 'Shrink weekly', 'Grow weekly'], tr: ['Haftada bir karınca boyutuna mı küçülmek yoksa dev boyutuna mı büyümek?', 'Küçül', 'Büyü'] },
  // Jun 28
  { cat: 'lifestyle', en: ['Would you rather have a minimalist phone home screen or a maximalist decorated one?', 'Minimalist screen', 'Maximalist screen'], tr: ['Minimalist telefon ana ekranı mı yoksa maksimalist süslü ekran mı?', 'Minimalist', 'Maksimalist'] },
  { cat: 'philosophy', en: ['Would you rather know the date you will die or know the reason you will die?', 'Know the date', 'Know the reason'], tr: ['Öleceğin tarihi mi bilmek yoksa ölüm nedenini mi?', 'Tarih', 'Neden'] },
  { cat: 'food', en: ['Would you rather never use salt or never use sugar?', 'Never salt', 'Never sugar'], tr: ['Hiç tuz kullanmamak mı yoksa hiç şeker kullanmamak mı?', 'Tuz yok', 'Şeker yok'] },
  // Jun 29
  { cat: 'adventure', en: ['Would you rather trek to Everest base camp or dive the Great Barrier Reef?', 'Everest base', 'Barrier Reef dive'], tr: ['Everest ana kampına mı yürümek yoksa Büyük Set Resifi\'nde mi dalış?', 'Everest kamp', 'Set Resifi'] },
  { cat: 'technology', en: ['Would you rather have a phone that never breaks or a laptop that never slows down?', 'Unbreakable phone', 'Fast laptop forever'], tr: ['Asla kırılmayan telefon mu yoksa asla yavaşlamayan laptop mu?', 'Kırılmaz telefon', 'Hızlı laptop'] },
  { cat: 'funny', en: ['Would you rather have a permanent cape that does nothing or a permanent crown that jingles?', 'Useless cape', 'Jingling crown'], tr: ['Hiçbir işe yaramayan kalıcı pelerin mi yoksa zıngırdayan kalıcı taç mı?', 'İşe yaramaz pelerin', 'Zıngır taç'] },
  // Jun 30
  { cat: 'skills', en: ['Would you rather write a bestselling novel in a week or train to Olympic level in a week?', 'Novel in week', 'Olympic in week'], tr: ['Bir haftada çok satan roman mı yazmak yoksa bir haftada olimpiyat seviyesine mi çıkmak?', 'Roman bir hafta', 'Olimpiyat bir hafta'] },
  { cat: 'entertainment', en: ['Would you rather own a private cinema or own a private concert stage?', 'Private cinema', 'Private stage'], tr: ['Özel sinema salonu mu yoksa özel konser sahnesi mi sahibi olmak?', 'Özel sinema', 'Özel sahne'] },
  { cat: 'personality', en: ['Would you rather be the friend everyone calls for advice or the friend everyone calls for fun?', 'Advice friend', 'Fun friend'], tr: ['Herkesin tavsiye için aradığı arkadaş mı yoksa eğlence için aradığı arkadaş mı olmak?', 'Tavsiye arkadaşı', 'Eğlence arkadaşı'] },
];

if (bank.length !== 99) {
  console.error(`Expected 99 questions, got ${bank.length}`);
  process.exit(1);
}

function esc(s) {
  return s.replace(/'/g, "''");
}

const rows = [];
let idx = 0;
for (let d = new Date(START); d <= END; d.setDate(d.getDate() + 1)) {
  const dateStr = d.toISOString().slice(0, 10);
  for (const slot of slots) {
    const q = bank[idx++];
    const [qt, oa, ob] = q.en;
    const [qtt, oat, obt] = q.tr;
    rows.push(
      `('${esc(qt)}', '${esc(oa)}', '${esc(ob)}', '${dateStr}', '${q.cat}', true, '${esc(qtt)}', '${esc(oat)}', '${esc(obt)}', '${slot}')`
    );
  }
}

const header =
  'INSERT INTO questions (question_text, option_a, option_b, scheduled_date, category, is_active, question_text_tr, option_a_tr, option_b_tr, time_slot)\nVALUES\n';

const batchSize = 33;
for (let b = 0; b < 3; b++) {
  const chunk = rows.slice(b * batchSize, (b + 1) * batchSize);
  const sql = header + chunk.join(',\n') + ';\n';
  const path = `scripts/seed-batch-${b + 1}.sql`;
  fs.writeFileSync(path, sql, 'utf8');
  console.log(`Wrote ${path} (${chunk.length} rows)`);
}

console.log(`Total: ${rows.length} questions`);
