import { getTodayQuestion, getTodayQuestions, isQuestionUnlocked, getSecondsUntilUnlock } from '../questions';

jest.mock('../supabase');
import { supabase } from '../supabase';

const mockQuestions = [
  {
    id: 'q-morning',
    question_text: 'Morning question?',
    option_a: 'Option A',
    option_b: 'Option B',
    scheduled_date: '2026-02-06',
    time_slot: 'morning',
    category: 'superpower',
    is_active: true,
    created_at: '2026-02-05T00:00:00Z',
  },
  {
    id: 'q-afternoon',
    question_text: 'Afternoon question?',
    option_a: 'Option C',
    option_b: 'Option D',
    scheduled_date: '2026-02-06',
    time_slot: 'afternoon',
    category: 'lifestyle',
    is_active: true,
    created_at: '2026-02-05T00:00:00Z',
  },
];

describe('getTodayQuestions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns questions array on success', async () => {
    const mockOrder = jest.fn().mockResolvedValue({
      data: mockQuestions,
      error: null,
    });
    const mockEq2 = jest.fn().mockReturnValue({ order: mockOrder });
    const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });

    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    const result = await getTodayQuestions();

    expect(result).toEqual(mockQuestions);
    expect(result).toHaveLength(2);
    expect(supabase.from).toHaveBeenCalledWith('questions');
  });

  it('returns empty array on error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const mockOrder = jest.fn().mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    });
    const mockEq2 = jest.fn().mockReturnValue({ order: mockOrder });
    const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });

    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    const result = await getTodayQuestions();

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

describe('getTodayQuestion (compat)', () => {
  it('returns first question from array', async () => {
    const mockOrder = jest.fn().mockResolvedValue({
      data: mockQuestions,
      error: null,
    });
    const mockEq2 = jest.fn().mockReturnValue({ order: mockOrder });
    const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });

    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    const result = await getTodayQuestion();

    expect(result).toEqual(mockQuestions[0]);
  });

  it('returns null when no questions', async () => {
    const mockOrder = jest.fn().mockResolvedValue({
      data: [],
      error: null,
    });
    const mockEq2 = jest.fn().mockReturnValue({ order: mockOrder });
    const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });

    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    const result = await getTodayQuestion();

    expect(result).toBeNull();
  });
});

describe('isQuestionUnlocked', () => {
  it('morning is unlocked at hour 8+', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(8);
    expect(isQuestionUnlocked('morning')).toBe(true);
  });

  it('morning is locked before hour 8', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(7);
    expect(isQuestionUnlocked('morning')).toBe(false);
  });

  it('afternoon unlocks at 14', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(14);
    expect(isQuestionUnlocked('afternoon')).toBe(true);
  });

  it('evening unlocks at 20', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(20);
    expect(isQuestionUnlocked('evening')).toBe(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});

describe('getSecondsUntilUnlock', () => {
  it('returns 0 when already unlocked', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(15);
    jest.spyOn(Date.prototype, 'getMinutes').mockReturnValue(0);
    jest.spyOn(Date.prototype, 'getSeconds').mockReturnValue(0);

    expect(getSecondsUntilUnlock('afternoon')).toBe(0);
  });

  it('returns correct seconds until unlock', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(13);
    jest.spyOn(Date.prototype, 'getMinutes').mockReturnValue(0);
    jest.spyOn(Date.prototype, 'getSeconds').mockReturnValue(0);

    // 14:00 - 13:00 = 1 hour = 3600 seconds
    expect(getSecondsUntilUnlock('afternoon')).toBe(3600);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
