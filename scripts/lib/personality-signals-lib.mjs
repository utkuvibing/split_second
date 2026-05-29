/** @typedef {import('./personality-signals-schema.mjs').SignalFile} SignalFile */

export const CONTENT_AXES = [
  'risk_tolerance',
  'novelty_seeking',
  'social_energy',
  'independence',
  'emotionality',
  'practicality',
  'commitment_readiness',
  'communication_directness',
  'conflict_style',
  'romance_style',
  'chaos_tolerance',
];

export const DATING_DIMENSIONS = [
  'attachment_style',
  'dating_pace',
  'communication_style',
  'conflict_style',
  'romance_style',
  'privacy_style',
  'togetherness',
];

export const SIGNAL_VALUES = new Set([-2, -1, 1, 2]);

export const HIGH_RISK_CATEGORIES = new Set(['personality', 'philosophy']);

export const REVIEW_STATUSES = new Set(['draft', 'reviewed']);

export const FORBIDDEN_DIAGNOSTIC = [
  'disorder',
  'narcissist',
  'psychopath',
  'bipolar',
  'autism',
  'adhd',
  'diagnosis',
  'mental illness',
];

const CATEGORY_BIAS = {
  lifestyle: { a: { practicality: 1, novelty_seeking: -1 }, b: { novelty_seeking: 1, risk_tolerance: 1 } },
  philosophy: { a: { emotionality: 1, practicality: -1 }, b: { practicality: 1, communication_directness: 1 } },
  superpower: { a: { novelty_seeking: 1, social_energy: 1 }, b: { independence: 1, practicality: 1 } },
  technology: { a: { practicality: 1, risk_tolerance: -1 }, b: { novelty_seeking: 1, risk_tolerance: 1 } },
  skills: { a: { practicality: 1, commitment_readiness: 1 }, b: { novelty_seeking: 1, social_energy: 1 } },
  food: { a: { practicality: 1, emotionality: 1 }, b: { novelty_seeking: 1, social_energy: 1 } },
  adventure: { a: { risk_tolerance: 1, novelty_seeking: 1 }, b: { practicality: 1, chaos_tolerance: -1 } },
  entertainment: { a: { social_energy: 1, emotionality: 1 }, b: { independence: 1, practicality: 1 } },
  personality: { a: { communication_directness: 1, independence: 1 }, b: { emotionality: 1, social_energy: 1 } },
  funny: { a: { chaos_tolerance: 1, social_energy: 1 }, b: { practicality: 1, risk_tolerance: -1 } },
  dating: { a: { commitment_readiness: 1, emotionality: 1 }, b: { independence: 1, communication_directness: 1 } },
};

const KEYWORD_RULES = [
  { match: /spontaneous|random|surprise|chaos|wild|unpredict/i, a: { chaos_tolerance: 1, novelty_seeking: 1 }, b: { practicality: 1, commitment_readiness: 1 } },
  { match: /plan|schedule|organiz|advance|early|on time/i, a: { practicality: 1, commitment_readiness: 1 }, b: { chaos_tolerance: 1, novelty_seeking: 1 } },
  { match: /honest|direct|truth|blunt|say what/i, a: { communication_directness: 2 }, b: { emotionality: 1, conflict_style: -1 } },
  { match: /alone|independ|private|lone|space|slow reply|independent/i, a: { independence: 2 }, b: { social_energy: 1, commitment_readiness: 1 } },
  { match: /friend|social|party|group|everyone|public|PDA|affectionate/i, a: { social_energy: 2 }, b: { independence: 1, privacy: 0 } },
  { match: /feel|emotion|heart|love|romantic|sentimental/i, a: { emotionality: 2, romance_style: 1 }, b: { practicality: 1, communication_directness: 1 } },
  { match: /money|practical|efficient|data|logic|smart/i, a: { practicality: 2 }, b: { emotionality: 1, novelty_seeking: 1 } },
  { match: /risk|danger|adventur|extreme|brave/i, a: { risk_tolerance: 2 }, b: { practicality: 1, chaos_tolerance: -1 } },
  { match: /calm|peace|harmon|avoid argument|stay calm/i, a: { conflict_style: -1, emotionality: -1 }, b: { conflict_style: 1, communication_directness: 1 } },
  { match: /win argument|debate|fight|argue/i, a: { conflict_style: 2 }, b: { conflict_style: -1, emotionality: 1 } },
  { match: /commit|marry|move in|long.?term|serious/i, a: { commitment_readiness: 2 }, b: { independence: 1, novelty_seeking: 1 } },
  { match: /clingy|texts daily|instant|every day|frequent/i, a: { commitment_readiness: 1, social_energy: 1 }, b: { independence: 2, communication_directness: -1 } },
  { match: /fly|invisible|superpower|magic|power/i, a: { novelty_seeking: 1, social_energy: 1 }, b: { independence: 1, practicality: 1 } },
  { match: /funny|laugh|joke|humor/i, a: { social_energy: 1, chaos_tolerance: 1 }, b: { practicality: 1 } },
  { match: /new|different|variety|explore|travel|try/i, a: { novelty_seeking: 2 }, b: { practicality: 1, commitment_readiness: 1 } },
  { match: /stable|reliable|safe|consistent|steady/i, a: { practicality: 1, commitment_readiness: 1, chaos_tolerance: -1 }, b: { novelty_seeking: 1, risk_tolerance: 1 } },
];

function clampSignals(map, maxKeys = 5) {
  const entries = Object.entries(map).filter(([, v]) => SIGNAL_VALUES.has(v));
  const fallbacks = ['practicality', 'novelty_seeking', 'emotionality', 'social_energy', 'independence'];
  for (const fb of fallbacks) {
    if (entries.length >= 2) break;
    if (!entries.some(([k]) => k === fb)) entries.push([fb, 1]);
  }
  return Object.fromEntries(entries.slice(0, maxKeys));
}

function mergeMaps(...maps) {
  const out = {};
  for (const m of maps) {
    for (const [k, v] of Object.entries(m ?? {})) {
      if (!SIGNAL_VALUES.has(v)) continue;
      out[k] = out[k] == null ? v : Math.max(-2, Math.min(2, out[k] + Math.sign(v)));
    }
  }
  return out;
}

function invertSignals(map) {
  const out = {};
  for (const [k, v] of Object.entries(map)) {
    out[k] = -v;
  }
  return out;
}

function padSignals(map, category, side) {
  const bias = CATEGORY_BIAS[category] ?? CATEGORY_BIAS.lifestyle;
  const padded = { ...(side === 'a' ? bias.a : bias.b), ...map };
  if (Object.keys(padded).length < 2) {
    padded[side === 'a' ? 'practicality' : 'novelty_seeking'] = 1;
  }
  return clampSignals(padded);
}

function ensureDiff(a, b, category) {
  let outA = padSignals(a, category, 'a');
  let outB = padSignals(b, category, 'b');
  const aStr = JSON.stringify(outA);
  const bStr = JSON.stringify(outB);
  if (aStr === bStr) {
    outB = padSignals(invertSignals(outA), category, 'b');
  }
  return { a: outA, b: outB };
}

function buildDatingBlock(textA, textB, signalsA, signalsB) {
  const attachmentA = /clingy|texts daily|instant|every day|remember every|move in within six/i.test(textA)
    ? 'anxious_lean'
    : /independent|slow|space|private|two years minimum/i.test(textA)
      ? 'avoidant_lean'
      : 'secure_lean';
  const attachmentB = /clingy|texts daily|instant|every day|remember every|move in within six/i.test(textB)
    ? 'anxious_lean'
    : /independent|slow|space|private|two years minimum/i.test(textB)
      ? 'avoidant_lean'
      : 'secure_lean';

  const commA = /text|message|call daily|instant|reply/i.test(textA) ? 'frequent' : /weekly|slow|minimal/i.test(textA) ? 'minimal' : 'balanced';
  const commB = /text|message|call daily|instant|reply/i.test(textB) ? 'frequent' : /weekly|slow|minimal/i.test(textB) ? 'minimal' : 'balanced';

  const romanceA = /romantic|chaotic|grand|cozy|brunch/i.test(textA) ? 'grand' : /stable|not romantic|boring/i.test(textA) ? 'low_key' : 'steady';
  const romanceB = /romantic|chaotic|grand|cozy|brunch/i.test(textB) ? 'grand' : /stable|not romantic|boring/i.test(textB) ? 'low_key' : 'steady';

  const privacyA = /PDA|public|online|share every/i.test(textA) ? 'public' : /private|secret|hates PDA|completely private/i.test(textA) ? 'private' : 'balanced';
  const privacyB = /PDA|public|online|share every/i.test(textB) ? 'public' : /private|secret|hates PDA|completely private/i.test(textB) ? 'private' : 'balanced';

  const paceA = /spontaneous|six months|instant|move fast/i.test(textA) ? 2 : /two years|slow|minimum/i.test(textA) ? -2 : 0;
  const paceB = /spontaneous|six months|instant|move fast/i.test(textB) ? 2 : /two years|slow|minimum/i.test(textB) ? -2 : 0;

  const togetherA = (signalsA.independence ?? 0) <= 0 ? 1 : -1;
  const togetherB = (signalsB.independence ?? 0) <= 0 ? 1 : -1;

  return {
    a: {
      attachment_style: attachmentA,
      communication_style: commA,
      romance_style: romanceA,
      privacy_style: privacyA,
      conflict_style: signalsA.conflict_style >= 1 ? 'competitive' : signalsA.conflict_style <= -1 ? 'harmonizer' : 'direct',
      dating_pace: paceA,
      togetherness: togetherA,
    },
    b: {
      attachment_style: attachmentB,
      communication_style: commB,
      romance_style: romanceB,
      privacy_style: privacyB,
      conflict_style: signalsB.conflict_style >= 1 ? 'competitive' : signalsB.conflict_style <= -1 ? 'harmonizer' : 'direct',
      dating_pace: paceB,
      togetherness: togetherB,
    },
  };
}

/** Manual overrides for high-visibility dating questions (100% reviewed). */
const MANUAL_OVERRIDES = {
  'eaedec23-8e37-42e4-b2c6-a217484b9d44': {
    a: { communication_directness: 1, commitment_readiness: 1, social_energy: 1, independence: -1 },
    b: { independence: 2, practicality: 1, communication_directness: -1 },
    dating: {
      a: { attachment_style: 'anxious_lean', communication_style: 'frequent', dating_pace: 2, togetherness: 2 },
      b: { attachment_style: 'avoidant_lean', communication_style: 'minimal', dating_pace: -1, togetherness: -1 },
    },
  },
  '31d86f0d-8f5f-4e75-936b-2d89ba10f741': {
    a: { commitment_readiness: 2, communication_directness: 1, social_energy: 1, independence: -1 },
    b: { independence: 2, practicality: 1, communication_directness: -1 },
    dating: {
      a: { attachment_style: 'anxious_lean', communication_style: 'frequent', dating_pace: 2, togetherness: 2 },
      b: { attachment_style: 'avoidant_lean', communication_style: 'minimal', dating_pace: -1, togetherness: -1 },
    },
  },
  'e28acc3a-2094-463b-b3cf-d9f76df6ae12': {
    a: { communication_directness: 1, commitment_readiness: 2, social_energy: 1, independence: -2 },
    b: { independence: 2, practicality: 1, communication_directness: -1 },
    dating: {
      a: { attachment_style: 'anxious_lean', communication_style: 'frequent', dating_pace: 2, togetherness: 2 },
      b: { attachment_style: 'avoidant_lean', communication_style: 'minimal', dating_pace: -2, togetherness: -2 },
    },
  },
};

export function generateQuestionSignals(question) {
  const override = MANUAL_OVERRIDES[question.id];
  if (override) {
    return {
      schema_version: 1,
      category: question.category,
      a: override.a,
      b: override.b,
      dating: override.dating,
      review_status: 'reviewed',
      reviewer_note: 'Manual override — human reviewed at authoring time.',
    };
  }

  const combined = `${question.question_text} ${question.option_a} ${question.option_b}`;
  let aMap = {};
  let bMap = {};

  for (const rule of KEYWORD_RULES) {
    if (rule.match.test(combined)) {
      aMap = mergeMaps(aMap, rule.a);
      bMap = mergeMaps(bMap, rule.b);
    }
  }

  const optA = `${question.option_a} ${question.option_a_tr ?? ''}`;
  const optB = `${question.option_b} ${question.option_b_tr ?? ''}`;
  for (const rule of KEYWORD_RULES) {
    if (rule.match.test(optA)) aMap = mergeMaps(aMap, rule.a);
    if (rule.match.test(optB)) bMap = mergeMaps(bMap, rule.b);
  }

  const catBias = CATEGORY_BIAS[question.category] ?? CATEGORY_BIAS.lifestyle;
  aMap = mergeMaps(catBias.a, aMap);
  bMap = mergeMaps(catBias.b, bMap);

  if (Object.keys(bMap).length === 0 && Object.keys(aMap).length > 0) {
    bMap = invertSignals(aMap);
  }

  const { a, b } = ensureDiff(aMap, bMap, question.category);

  const entry = {
    schema_version: 1,
    category: question.category,
    a,
    b,
    review_status: 'draft',
  };

  if (HIGH_RISK_CATEGORIES.has(question.category)) {
    entry.high_risk_review = true;
  }

  if (question.category === 'dating') {
    entry.dating = buildDatingBlock(
      `${question.option_a} ${question.question_text}`,
      `${question.option_b} ${question.question_text}`,
      a,
      b,
    );
    entry.review_status = 'draft';
    delete entry.reviewer_note;
  }

  return entry;
}

export function validateSignalEntry(id, entry, expectedCategory, errors, warnings) {
  if (!entry || typeof entry !== 'object') {
    errors.push(`${id}: missing entry`);
    return;
  }
  if (entry.category !== expectedCategory) {
    warnings.push(`${id}: category mismatch (${entry.category} vs ${expectedCategory})`);
  }
  for (const side of ['a', 'b']) {
    const sig = entry[side];
    if (!sig || typeof sig !== 'object') {
      errors.push(`${id}: missing ${side} signals`);
      continue;
    }
    const keys = Object.keys(sig);
    if (keys.length < 2 || keys.length > 5) {
      errors.push(`${id}: ${side} must have 2-5 signals (has ${keys.length})`);
    }
    for (const [k, v] of Object.entries(sig)) {
      if (!CONTENT_AXES.includes(k)) {
        errors.push(`${id}: unknown axis "${k}" on ${side}`);
      }
      if (!SIGNAL_VALUES.has(v)) {
        errors.push(`${id}: invalid value ${v} on ${side}.${k}`);
      }
    }
  }
  const aStr = JSON.stringify(entry.a);
  const bStr = JSON.stringify(entry.b);
  if (aStr === bStr) {
    errors.push(`${id}: a and b signals identical`);
  }

  if (expectedCategory === 'dating') {
    if (!entry.dating?.a || !entry.dating?.b) {
      errors.push(`${id}: dating category requires dating block`);
    }
    if (entry.review_status !== 'reviewed') {
      errors.push(`${id}: dating question must have review_status="reviewed" (has "${entry.review_status ?? 'missing'}")`);
    }
    if (!entry.reviewer_note || typeof entry.reviewer_note !== 'string' || !entry.reviewer_note.trim()) {
      errors.push(`${id}: dating question requires non-empty reviewer_note`);
    }
  }

  if (HIGH_RISK_CATEGORIES.has(expectedCategory)) {
    if (!entry.high_risk_review) {
      warnings.push(`${id}: ${expectedCategory} category flagged for high_risk_review (heuristic signals)`);
    }
    if (entry.review_status === 'reviewed' && !entry.reviewer_note) {
      warnings.push(`${id}: high-risk category marked reviewed without reviewer_note`);
    }
  }

  if (entry.review_status && !REVIEW_STATUSES.has(entry.review_status)) {
    errors.push(`${id}: invalid review_status "${entry.review_status}"`);
  }

  for (const forbidden of FORBIDDEN_DIAGNOSTIC) {
    const notes = JSON.stringify(entry).toLowerCase();
    if (notes.includes(forbidden)) {
      errors.push(`${id}: forbidden diagnostic term "${forbidden}"`);
    }
  }
}

export function validateSignalFile(questions, signalFile) {
  const errors = [];
  const warnings = [];
  const questionIds = new Set(questions.map((q) => q.id));
  const signalIds = new Set(Object.keys(signalFile.questions ?? {}));

  for (const q of questions) {
    if (!signalIds.has(q.id)) {
      errors.push(`Missing signals for question ${q.id}`);
    }
  }

  for (const id of signalIds) {
    if (!questionIds.has(id)) {
      warnings.push(`Orphan signal entry: ${id}`);
    }
  }

  let datingCount = 0;
  for (const q of questions) {
    const entry = signalFile.questions?.[q.id];
    if (!entry) continue;
    if (q.category === 'dating') datingCount += 1;
    validateSignalEntry(q.id, entry, q.category, errors, warnings);
  }

  const expectedDating = questions.filter((q) => q.category === 'dating').length;
  if (datingCount !== expectedDating) {
    errors.push(`Dating signal count ${datingCount} != expected ${expectedDating}`);
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    questionCount: questions.length,
    signalCount: signalIds.size,
    datingCount,
  };
}
