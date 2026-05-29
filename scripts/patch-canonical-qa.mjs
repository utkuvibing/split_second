#!/usr/bin/env node
/** One-off QA patches to canonical JSON (indices 14, 21, 93, 118, 156) */
import fs from 'fs';
import path from 'path';
import { ROOT } from './lib/supabase-env.mjs';

const patches = {
  14: {
    question_text_tr:
      'Her küçük detayı hatırlayan biriyle mi, yoksa özel günleri unutan ama hislerini unutmayan biriyle mi?',
  },
  21: {
    question_text_tr:
      'Arkadaşlarının seni hiç tanımadığın biriyle ayarlaması mı, yoksa tanıştırıcı olmadan doğal şekilde tanışmak mı?',
  },
  93: {
    question_text:
      'Would you rather date someone who fits perfectly with your family or someone who feels like your private escape from everyone?',
    question_text_tr:
      'Ailenle mükemmel uyum sağlayan biriyle mi, yoksa herkesten uzak özel kaçışın gibi hissettiren biriyle mi çıkardın?',
    option_a: 'Family fits perfectly',
    option_a_tr: 'Aileyle tam uyum',
    option_b: 'Private escape',
    option_b_tr: 'Özel kaçış',
  },
  118: {
    question_text:
      'Would you rather date someone who plans cozy brunch dates or someone who loves spontaneous late-night walks?',
    question_text_tr:
      'Sakin brunch buluşmaları planlayan biriyle mi, yoksa spontane gece yürüyüşlerini seven biriyle mi çıkardın?',
    option_a: 'Cozy brunch dates',
    option_a_tr: 'Brunch buluşmaları',
    option_b: 'Late-night walks',
    option_b_tr: 'Gece yürüyüşleri',
  },
  156: {
    question_text_tr:
      'Arkadaşlarının sevdiği ama sana sıkıcı gelen biriyle mi, yoksa arkadaşlarının sevmediği ama senin bayıldığın biriyle mi?',
  },
};

const canonPath = path.join(ROOT, 'data', 'questions-canonical.json');
const payload = JSON.parse(fs.readFileSync(canonPath, 'utf8'));

for (const [idx, patch] of Object.entries(patches)) {
  Object.assign(payload.questions[Number(idx)], patch);
}

payload.qa_patched_at = new Date().toISOString();
fs.writeFileSync(canonPath, JSON.stringify(payload, null, 2), 'utf8');
console.log('Patched canonical indices:', Object.keys(patches).join(', '));
