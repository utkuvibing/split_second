import {
  START_DATE,
  EXPECTED_COUNT,
  SLOTS,
  DATING_MIN,
  DATING_MAX,
  CANONICAL_CATEGORIES,
  assignSchedule,
} from './inventory-constants.mjs';

const FORBIDDEN_TONE = [
  'nsfw',
  'nude',
  'stalk',
  'cheat on',
  'underage',
  'manipulate',
];

function tokenize(text) {
  return (text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function jaccard(a, b) {
  const sa = new Set(tokenize(a));
  const sb = new Set(tokenize(b));
  if (sa.size === 0 || sb.size === 0) return 0;
  let inter = 0;
  for (const t of sa) {
    if (sb.has(t)) inter++;
  }
  return inter / (sa.size + sb.size - inter);
}

function isFilled(s) {
  return s != null && String(s).trim().length > 0;
}

export function validateQuestions(questions, { warnSimilarity = true } = {}) {
  const errors = [];
  const warnings = [];

  if (questions.length !== EXPECTED_COUNT) {
    errors.push(`Expected ${EXPECTED_COUNT} questions, got ${questions.length}`);
  }

  const enQuestions = new Map();
  const trQuestions = new Map();
  let datingCount = 0;

  const byDate = new Map();

  questions.forEach((q, index) => {
    const fields = [
      'question_text',
      'question_text_tr',
      'option_a',
      'option_a_tr',
      'option_b',
      'option_b_tr',
    ];
    for (const f of fields) {
      if (!isFilled(q[f])) {
        errors.push(`Index ${index} (${q.id}): missing ${f}`);
      }
    }

    if (!CANONICAL_CATEGORIES.includes(q.category)) {
      errors.push(`Index ${index}: invalid category "${q.category}"`);
    }

    if (q.category === 'dating') datingCount++;

    const blob = `${q.question_text} ${q.option_a} ${q.option_b}`.toLowerCase();
    for (const bad of FORBIDDEN_TONE) {
      if (blob.includes(bad)) {
        errors.push(`Index ${index}: forbidden tone keyword "${bad}"`);
      }
    }

    const enKey = q.question_text.trim().toLowerCase();
    if (enQuestions.has(enKey)) {
      errors.push(`Duplicate EN question at index ${index} and ${enQuestions.get(enKey)}`);
    } else enQuestions.set(enKey, index);

    const trKey = q.question_text_tr.trim().toLowerCase();
    if (trQuestions.has(trKey)) {
      errors.push(`Duplicate TR question at index ${index} and ${trQuestions.get(trKey)}`);
    } else trQuestions.set(trKey, index);

    const expected = assignSchedule(index);
    if (q.scheduled_date !== expected.scheduled_date) {
      errors.push(
        `Index ${index}: scheduled_date ${q.scheduled_date} expected ${expected.scheduled_date}`,
      );
    }
    if (q.time_slot !== expected.time_slot) {
      errors.push(
        `Index ${index}: time_slot ${q.time_slot} expected ${expected.time_slot}`,
      );
    }

    if (!byDate.has(q.scheduled_date)) byDate.set(q.scheduled_date, []);
    byDate.get(q.scheduled_date).push(q);
  });

  // Date continuity
  const dates = [...byDate.keys()].sort();
  if (dates.length > 0) {
    let cursor = dates[0];
    const last = dates[dates.length - 1];
    const seen = new Set(dates);
    while (cursor <= last) {
      if (!seen.has(cursor)) {
        errors.push(`Missing date in schedule: ${cursor}`);
        break;
      }
      const [y, m, d] = cursor.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      dt.setDate(dt.getDate() + 1);
      cursor = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    }
  }

  if (dates[0] !== START_DATE) {
    errors.push(`First date ${dates[0]} expected ${START_DATE}`);
  }

  // Per-day rules
  for (const [date, dayQs] of byDate) {
    if (dayQs.length > 3) {
      errors.push(`Date ${date} has ${dayQs.length} questions (max 3)`);
    }
    const datingOnDay = dayQs.filter((q) => q.category === 'dating').length;
    if (datingOnDay > 1) {
      errors.push(`Date ${date} has ${datingOnDay} dating questions (max 1)`);
    }
    const slots = dayQs.map((q) => q.time_slot);
    for (let i = 1; i < slots.length; i++) {
      const prev = SLOTS.indexOf(slots[i - 1]);
      const cur = SLOTS.indexOf(slots[i]);
      if (cur < prev) {
        errors.push(`Date ${date}: slot order broken (${slots.join(', ')})`);
      }
    }
  }

  // Consecutive dating days
  for (let i = 0; i < dates.length - 2; i++) {
    const d0 = byDate.get(dates[i])?.some((q) => q.category === 'dating');
    const d1 = byDate.get(dates[i + 1])?.some((q) => q.category === 'dating');
    const d2 = byDate.get(dates[i + 2])?.some((q) => q.category === 'dating');
    if (d0 && d1 && d2) {
      errors.push(`Three consecutive days with dating: ${dates[i]}..${dates[i + 2]}`);
    }
  }

  if (datingCount < DATING_MIN || datingCount > DATING_MAX) {
    errors.push(`Dating count ${datingCount} outside ${DATING_MIN}-${DATING_MAX}`);
  }

  if (warnSimilarity) {
    for (let i = 0; i < questions.length; i++) {
      for (let j = i + 1; j < questions.length; j++) {
        const sim = jaccard(questions[i].question_text, questions[j].question_text);
        if (sim >= 0.72) {
          warnings.push(
            `Similar EN pair index ${i} & ${j} (Jaccard ${sim.toFixed(2)})`,
          );
        }
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    datingCount,
    dateRange:
      dates.length > 0 ? { first: dates[0], last: dates[dates.length - 1] } : null,
  };
}
