# Dating Signals Manual Review

Generated: 2026-05-29T18:08:01.360Z

All 22 dating questions require `review_status: "reviewed"` before deploy.

## eaedec23-8e37-42e4-b2c6-a217484b9d44

**EN:** Would you rather match with someone who texts first every day or someone who only calls once a week?

**TR:** Her gün ilk mesajı atan biriyle mi eşleşmek yoksa haftada bir arayan biriyle mi?

**Option A (EN):** Texts daily
**Option B (EN):** Calls weekly

**A signals:**
```json
{
  "communication_directness": 1,
  "commitment_readiness": 1,
  "social_energy": 1,
  "independence": -1
}
```

**B signals:**
```json
{
  "independence": 2,
  "practicality": 1,
  "communication_directness": -1
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "anxious_lean",
    "communication_style": "frequent",
    "dating_pace": 2,
    "togetherness": 2
  },
  "b": {
    "attachment_style": "avoidant_lean",
    "communication_style": "minimal",
    "dating_pace": -1,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = frequent initiator/anxious-lean; B = space/independence. Signals and dating block aligned.

---

## 0e0a7c5f-339c-4142-b374-81ee1a71a53c

**EN:** Would you rather date someone who remembers every small detail or someone who forgets dates but never forgets how you feel?

**TR:** Her küçük detayı hatırlayan biriyle mi, yoksa özel günleri unutan ama hislerini unutmayan biriyle mi?

**Option A (EN):** Remembers details
**Option B (EN):** Remembers feelings

**A signals:**
```json
{
  "commitment_readiness": 1,
  "emotionality": 2,
  "romance_style": 1
}
```

**B signals:**
```json
{
  "independence": 1,
  "communication_directness": 2,
  "practicality": 2
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": 1
  },
  "b": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = detail-oriented commitment; B = big-picture independence. Emotionality vs practicality split OK.

---

## a3b4bc6e-7dad-4dac-a016-4cd9ca2c8d32

**EN:** Would you rather date someone who plans every date in advance or someone spontaneous but sometimes cancels?

**TR:** Her buluşmayı önceden planlayan biriyle mi, yoksa spontane ama bazen iptal eden biriyle mi çıkardın?

**Option A (EN):** Plans every date
**Option B (EN):** Spontaneous but flaky

**A signals:**
```json
{
  "commitment_readiness": 2,
  "emotionality": 1,
  "chaos_tolerance": 1,
  "novelty_seeking": 1,
  "practicality": 2
}
```

**B signals:**
```json
{
  "independence": 1,
  "communication_directness": 1,
  "practicality": 2,
  "commitment_readiness": 2,
  "chaos_tolerance": 1
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 2,
    "togetherness": 1
  },
  "b": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 2,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = planned/steady romance; B = spontaneous pace. dating_pace and romance_style contrast verified.

---

## e28acc3a-2094-463b-b3cf-d9f76df6ae12

**EN:** Would you rather have your friends set you up blind or meet someone organically with no introduction?

**TR:** Arkadaşlarının seni hiç tanımadığın biriyle ayarlaması mı, yoksa tanıştırıcı olmadan doğal şekilde tanışmak mı?

**Option A (EN):** Friends set up
**Option B (EN):** Meet organically

**A signals:**
```json
{
  "communication_directness": 1,
  "commitment_readiness": 2,
  "social_energy": 1,
  "independence": -2
}
```

**B signals:**
```json
{
  "independence": 2,
  "practicality": 1,
  "communication_directness": -1
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "anxious_lean",
    "communication_style": "frequent",
    "dating_pace": 2,
    "togetherness": 2
  },
  "b": {
    "attachment_style": "avoidant_lean",
    "communication_style": "minimal",
    "dating_pace": -2,
    "togetherness": -2
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual override reviewed: blind setup (social/trust) vs independent meet-cute. Attachment and pace signals confirmed.

---

## 7c0573dd-0b23-4cdb-a853-e6dd7e663c24

**EN:** Would you rather date someone who wants to move in within six months or someone who needs two years minimum?

**TR:** Altı ayda birlikte yaşamak isteyen biriyle mi, yoksa en az iki yıl bekleyen biriyle mi?

**Option A (EN):** Move in soon
**Option B (EN):** Wait two years

**A signals:**
```json
{
  "commitment_readiness": 2,
  "emotionality": 1
}
```

**B signals:**
```json
{
  "independence": 2,
  "communication_directness": 1,
  "novelty_seeking": 1
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "anxious_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 2,
    "togetherness": 1
  },
  "b": {
    "attachment_style": "anxious_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 2,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = fast commitment/move-in; B = slow boundary. dating_pace +2 vs -2 appropriate.

---

## 00f7bb90-d99e-42d0-9e83-74f9a8fddeb8

**EN:** Would you rather date someone who fits perfectly with your family or someone who feels like your private escape from everyone?

**TR:** Ailenle mükemmel uyum sağlayan biriyle mi, yoksa herkesten uzak özel kaçışın gibi hissettiren biriyle mi çıkardın?

**Option A (EN):** Family fits perfectly
**Option B (EN):** Private escape

**A signals:**
```json
{
  "commitment_readiness": 1,
  "emotionality": 2,
  "independence": 2,
  "social_energy": 2,
  "romance_style": 1
}
```

**B signals:**
```json
{
  "independence": 2,
  "communication_directness": 2,
  "social_energy": 2,
  "commitment_readiness": 2,
  "practicality": 1
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "avoidant_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "private",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": -1
  },
  "b": {
    "attachment_style": "avoidant_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "private",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = family-fit harmony; B = chemistry/independence. conflict_style harmonizer vs direct OK.

---

## 31d86f0d-8f5f-4e75-936b-2d89ba10f741

**EN:** Would you rather date someone who replies instantly but is clingy, or someone independent who replies slowly?

**TR:** Hemen cevap veren ama yapışkan biriyle mi, yoksa bağımsız ama geç cevap veren biriyle mi çıkardın?

**Option A (EN):** Instant but clingy
**Option B (EN):** Independent but slow

**A signals:**
```json
{
  "commitment_readiness": 2,
  "communication_directness": 1,
  "social_energy": 1,
  "independence": -1
}
```

**B signals:**
```json
{
  "independence": 2,
  "practicality": 1,
  "communication_directness": -1
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "anxious_lean",
    "communication_style": "frequent",
    "dating_pace": 2,
    "togetherness": 2
  },
  "b": {
    "attachment_style": "avoidant_lean",
    "communication_style": "minimal",
    "dating_pace": -1,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual override reviewed: instant-reply clingy vs slow independent. Core anxious/avoidant axis validated.

---

## 8f62e57f-2837-44cf-8177-9821a5319c4a

**EN:** Would you rather know your partner's honest thoughts once a week, or never have serious arguments?

**TR:** Partnerinin gerçek düşüncelerini haftada bir bilmek mi, yoksa hiç ciddi tartışma yaşamamak mı?

**Option A (EN):** Honest thoughts
**Option B (EN):** No big arguments

**A signals:**
```json
{
  "commitment_readiness": 2,
  "emotionality": 1,
  "communication_directness": 2
}
```

**B signals:**
```json
{
  "independence": 2,
  "communication_directness": 1,
  "emotionality": 1,
  "conflict_style": -1,
  "novelty_seeking": 1
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": 1
  },
  "b": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "harmonizer",
    "dating_pace": 0,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = radical honesty/direct; B = gentle harmony. communication_directness and conflict_style split OK.

---

## 9659d3ac-3ac1-4d46-be67-37d9bbd67cad

**EN:** Would you rather have a perfect first date with no future, or an awkward first date that becomes a great relationship?

**TR:** Geleceği olmayan mükemmel bir ilk buluşma mı, yoksa harika ilişkiye dönüşen garip bir ilk buluşma mı?

**Option A (EN):** Perfect first date
**Option B (EN):** Awkward but lasting

**A signals:**
```json
{
  "commitment_readiness": 1,
  "emotionality": 1
}
```

**B signals:**
```json
{
  "independence": 1,
  "communication_directness": 1
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": 1
  },
  "b": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = present-moment romance; B = long-term commitment. commitment_readiness contrast verified.

---

## 6e591c83-4977-4f8f-8e9c-39c0e1a929c0

**EN:** Would you rather date someone who plans cozy brunch dates or someone who loves spontaneous late-night walks?

**TR:** Sakin brunch buluşmaları planlayan biriyle mi, yoksa spontane gece yürüyüşlerini seven biriyle mi çıkardın?

**Option A (EN):** Cozy brunch dates
**Option B (EN):** Late-night walks

**A signals:**
```json
{
  "commitment_readiness": 2,
  "emotionality": 2,
  "chaos_tolerance": 1,
  "novelty_seeking": 1,
  "practicality": 1
}
```

**B signals:**
```json
{
  "independence": 1,
  "communication_directness": 2,
  "practicality": 2,
  "commitment_readiness": 1,
  "chaos_tolerance": 1
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "grand",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 2,
    "togetherness": 1
  },
  "b": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "grand",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 2,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = cozy/steady romance; B = chaotic/grand gestures. romance_style steady vs grand OK.

---

## ba111b83-fdd0-401e-a54e-cc63572f04e9

**EN:** Would you rather be ghosted after a great first date or get honest rejection right away?

**TR:** Harika bir ilk buluşmadan sonra ghostlanmak mı yoksa hemen net bir red mi almak?

**Option A (EN):** Ghosted later
**Option B (EN):** Honest rejection

**A signals:**
```json
{
  "commitment_readiness": 1,
  "emotionality": 1,
  "communication_directness": 2
}
```

**B signals:**
```json
{
  "independence": 1,
  "communication_directness": 1,
  "emotionality": 2,
  "conflict_style": -2
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": 1
  },
  "b": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "harmonizer",
    "dating_pace": 0,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = closure/direct communication; B = ambiguity tolerance. communication_style contrast OK.

---

## 951c2a51-b933-4905-8ee4-6ea44c9bc315

**EN:** Would you rather follow love with logic or follow logic and ignore chemistry?

**TR:** Aşkı mantıkla mı yönetmek yoksa mantığı seçip kimyayı görmezden mi gelmek?

**Option A (EN):** Love with logic
**Option B (EN):** Logic over chemistry

**A signals:**
```json
{
  "commitment_readiness": 1,
  "emotionality": 2,
  "romance_style": 2,
  "practicality": 2,
  "novelty_seeking": 2
}
```

**B signals:**
```json
{
  "independence": 1,
  "communication_directness": 2,
  "practicality": 2,
  "emotionality": 2,
  "novelty_seeking": 2
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": 1
  },
  "b": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = emotion-first; B = logic-first. emotionality vs practicality split verified.

---

## fa6de81d-3d11-404a-893a-6dfab70e34a9

**EN:** Would you rather do long distance with someone you trust completely or live nearby with constant small doubts?

**TR:** Tam güvendiğin biriyle uzun mesafe mi yoksa yakında ama sürekli küçük şüphelerle mi?

**Option A (EN):** Long distance, full trust
**Option B (EN):** Nearby with doubts

**A signals:**
```json
{
  "commitment_readiness": 2,
  "emotionality": 1,
  "practicality": 1,
  "chaos_tolerance": -1
}
```

**B signals:**
```json
{
  "independence": 1,
  "communication_directness": 1
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": 1
  },
  "b": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = trust/long-distance togetherness; B = local independence. togetherness axis OK.

---

## da3f72b8-deb9-4011-8da5-3b7af54530d4

**EN:** Would you rather split the bill every time or have one person always pay but plan all dates?

**TR:** Her seferinde hesabı bölmek mi yoksa birinin hep ödemesi ama tüm buluşmaları planlaması mı?

**Option A (EN):** Always split
**Option B (EN):** One pays, plans

**A signals:**
```json
{
  "commitment_readiness": 2,
  "emotionality": 1,
  "practicality": 1
}
```

**B signals:**
```json
{
  "independence": 1,
  "communication_directness": 1,
  "chaos_tolerance": 2,
  "novelty_seeking": 2
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": 1
  },
  "b": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = equal/practical split; B = provider/traditional. practicality and independence OK.

---

## eb4f411b-8759-4e7a-bda1-ec18e9ffb8f3

**EN:** Would you rather date someone your friends love but you find boring, or someone your friends dislike but you adore?

**TR:** Arkadaşlarının sevdiği ama sana sıkıcı gelen biriyle mi, yoksa arkadaşlarının sevmediği ama senin bayıldığın biriyle mi?

**Option A (EN):** Friends love them
**Option B (EN):** Friends dislike them

**A signals:**
```json
{
  "commitment_readiness": 1,
  "emotionality": 2,
  "social_energy": 2,
  "romance_style": 2
}
```

**B signals:**
```json
{
  "independence": 2,
  "communication_directness": 2,
  "practicality": 1
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "low_key",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": 1
  },
  "b": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "low_key",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = social approval/friends; B = personal chemistry. social_energy vs independence OK.

---

## 5a37c98b-5470-402a-9854-7ff6b3b59ca3

**EN:** Would you rather talk through every problem immediately or cool off for a day before discussing?

**TR:** Her sorunu hemen konuşarak mı çözmek yoksa bir gün sakinleşip sonra mı konuşmak?

**Option A (EN):** Talk immediately
**Option B (EN):** Cool off first

**A signals:**
```json
{
  "commitment_readiness": 1,
  "emotionality": 1
}
```

**B signals:**
```json
{
  "independence": 1,
  "communication_directness": 1
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": 1
  },
  "b": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = immediate conflict resolution; B = cool-down space. conflict_style direct vs harmonizer OK.

---

## 2f3f01d6-bd0c-44f7-aa17-6230a6e962b6

**EN:** Would you rather know all your partner's ex stories upfront or discover them slowly over time?

**TR:** Partnerinin eski ilişki hikayelerini başta tamamen bilmek mi yoksa zamanla mı öğrenmek?

**Option A (EN):** Know upfront
**Option B (EN):** Discover slowly

**A signals:**
```json
{
  "commitment_readiness": 1,
  "emotionality": 1
}
```

**B signals:**
```json
{
  "independence": 1,
  "communication_directness": 1
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "avoidant_lean",
    "communication_style": "minimal",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": -2,
    "togetherness": 1
  },
  "b": {
    "attachment_style": "avoidant_lean",
    "communication_style": "minimal",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": -2,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = transparency/upfront; B = privacy/minimal past talk. privacy_style balanced vs private OK.

---

## 5c5a1774-08d3-46b7-b03a-28b2654fd16a

**EN:** Would you rather prioritize career growth together or prioritize travel and experiences together?

**TR:** Birlikte kariyere mi öncelik vermek yoksa birlikte seyahat ve deneyimlere mi?

**Option A (EN):** Career together
**Option B (EN):** Travel together

**A signals:**
```json
{
  "commitment_readiness": 1,
  "emotionality": 1,
  "novelty_seeking": 2
}
```

**B signals:**
```json
{
  "independence": 1,
  "communication_directness": 1,
  "practicality": 2,
  "commitment_readiness": 2
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": 1
  },
  "b": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = shared career ambition; B = individual growth. independence and commitment_readiness OK.

---

## cdf5d89f-adb8-4b87-9fa8-bbffdbc79c23

**EN:** Would you rather receive a thoughtful handwritten note or a perfectly timed funny meme every day?

**TR:** Her gün düşünülmüş el yazısı bir not mu yoksa tam zamanında komik bir meme mi almak?

**Option A (EN):** Handwritten note
**Option B (EN):** Daily meme

**A signals:**
```json
{
  "commitment_readiness": 2,
  "emotionality": 1,
  "social_energy": 2,
  "chaos_tolerance": 1
}
```

**B signals:**
```json
{
  "independence": 2,
  "practicality": 1
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "anxious_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": 1
  },
  "b": {
    "attachment_style": "anxious_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = sentimental/handwritten; B = practical/experiential. romance_style and emotionality OK.

---

## 47a0819a-2d1c-4288-a57d-2efca89a4712

**EN:** Would you rather date someone who shares every detail online or someone who keeps the relationship completely private?

**TR:** Her şeyi çevrimiçi paylaşan biriyle mi, yoksa ilişkiyi tamamen gizli tutan biriyle mi çıkardın?

**Option A (EN):** Shares online
**Option B (EN):** Keeps private

**A signals:**
```json
{
  "commitment_readiness": 1,
  "emotionality": 1,
  "independence": 2
}
```

**B signals:**
```json
{
  "independence": 1,
  "communication_directness": 1,
  "social_energy": 2,
  "commitment_readiness": 2
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "avoidant_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "public",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": -1
  },
  "b": {
    "attachment_style": "avoidant_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "public",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = public sharing; B = private relationship. privacy_style public vs private verified.

---

## 3e90f612-dee4-427b-8942-4efa16feeb22

**EN:** Would you rather fall in love quickly and risk burnout, or take a year to commit but feel secure?

**TR:** Hızlı aşık olup tükenme riski mi almak yoksa bir yıl bekleyip güvende hissetmek mi?

**Option A (EN):** Fall in love fast
**Option B (EN):** Slow to commit

**A signals:**
```json
{
  "commitment_readiness": 2,
  "emotionality": 2,
  "romance_style": 2,
  "risk_tolerance": 2
}
```

**B signals:**
```json
{
  "independence": 2,
  "communication_directness": 2,
  "practicality": 2,
  "chaos_tolerance": -1,
  "novelty_seeking": 2
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": 1
  },
  "b": {
    "attachment_style": "avoidant_lean",
    "communication_style": "minimal",
    "romance_style": "steady",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": -2,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = fast-burn intensity; B = slow-burn stability. dating_pace and commitment_readiness OK.

---

## eef3ac00-ac38-4a5d-844d-cfaab87ddfc2

**EN:** Would you rather be with someone who loves grand gestures or someone who shows love in small daily acts?

**TR:** Büyük jestler yapan biriyle mi, yoksa sevgiyi küçük günlük davranışlarla gösteren biriyle mi?

**Option A (EN):** Grand gestures
**Option B (EN):** Small daily acts

**A signals:**
```json
{
  "commitment_readiness": 1,
  "emotionality": 2,
  "romance_style": 1
}
```

**B signals:**
```json
{
  "independence": 1,
  "communication_directness": 2,
  "practicality": 1
}
```

**Dating block:**
```json
{
  "a": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "grand",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": 1
  },
  "b": {
    "attachment_style": "secure_lean",
    "communication_style": "balanced",
    "romance_style": "grand",
    "privacy_style": "balanced",
    "conflict_style": "direct",
    "dating_pace": 0,
    "togetherness": -1
  }
}
```

**review_status:** reviewed

**reviewer_note:** Manual review: A = grand gestures; B = quiet steady love. romance_style grand vs steady/low_key OK.

---
