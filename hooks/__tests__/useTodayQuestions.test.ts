import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useTodayQuestions } from '../useTodayQuestions';

jest.mock('../../lib/questions', () => ({
  getTodayQuestions: jest.fn(),
}));

jest.mock('../../lib/i18n', () => ({
  localizeQuestion: jest.fn((q: unknown) => q),
}));

import { getTodayQuestions } from '../../lib/questions';
import { localizeQuestion } from '../../lib/i18n';

const mockGetTodayQuestions = getTodayQuestions as jest.MockedFunction<typeof getTodayQuestions>;
const mockLocalizeQuestion = localizeQuestion as jest.MockedFunction<typeof localizeQuestion>;

const mockQuestions = [
  {
    id: 'q-morning',
    question_text: 'Morning question?',
    option_a: 'Option A',
    option_b: 'Option B',
    scheduled_date: '2026-02-06',
    time_slot: 'morning' as const,
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
    time_slot: 'afternoon' as const,
    category: 'lifestyle',
    is_active: true,
    created_at: '2026-02-05T00:00:00Z',
  },
  {
    id: 'q-evening',
    question_text: 'Evening question?',
    option_a: 'Option E',
    option_b: 'Option F',
    scheduled_date: '2026-02-06',
    time_slot: 'evening' as const,
    category: 'philosophy',
    is_active: true,
    created_at: '2026-02-05T00:00:00Z',
  },
];

describe('useTodayQuestions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalizeQuestion.mockImplementation((q: unknown) => q as (typeof mockQuestions)[0]);
  });

  it('should initialize with loading true', () => {
    mockGetTodayQuestions.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useTodayQuestions(true));

    expect(result.current.loading).toBe(true);
    expect(result.current.questions).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should not fetch when not authenticated', async () => {
    const { result } = renderHook(() => useTodayQuestions(false));

    expect(result.current.questions).toEqual([]);
    expect(mockGetTodayQuestions).not.toHaveBeenCalled();
  });

  it('should fetch and set questions array when authenticated', async () => {
    mockGetTodayQuestions.mockResolvedValue(mockQuestions);

    const { result } = renderHook(() => useTodayQuestions(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.questions).toEqual(mockQuestions);
    expect(result.current.questions).toHaveLength(3);
    expect(result.current.error).toBeNull();
    expect(mockGetTodayQuestions).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no questions', async () => {
    mockGetTodayQuestions.mockResolvedValue([]);

    const { result } = renderHook(() => useTodayQuestions(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.questions).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should set error when getTodayQuestions throws', async () => {
    mockGetTodayQuestions.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useTodayQuestions(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.questions).toEqual([]);
  });

  it('should set generic error for non-Error throws', async () => {
    mockGetTodayQuestions.mockRejectedValue('string error');

    const { result } = renderHook(() => useTodayQuestions(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load questions');
  });

  it('should support refetch', async () => {
    mockGetTodayQuestions.mockResolvedValue(mockQuestions);

    const { result } = renderHook(() => useTodayQuestions(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const updated = [mockQuestions[0]];
    mockGetTodayQuestions.mockResolvedValue(updated);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.questions).toEqual(updated);
    expect(mockGetTodayQuestions).toHaveBeenCalledTimes(2);
  });

  it('should call localizeQuestion on each fetched question', async () => {
    mockGetTodayQuestions.mockResolvedValue(mockQuestions);

    const { result } = renderHook(() => useTodayQuestions(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockLocalizeQuestion).toHaveBeenCalledTimes(3);
    // Array.map passes (item, index, array) so check first arg only
    expect(mockLocalizeQuestion.mock.calls[0][0]).toEqual(mockQuestions[0]);
    expect(mockLocalizeQuestion.mock.calls[1][0]).toEqual(mockQuestions[1]);
    expect(mockLocalizeQuestion.mock.calls[2][0]).toEqual(mockQuestions[2]);
  });
});
