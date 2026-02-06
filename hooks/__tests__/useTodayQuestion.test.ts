import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useTodayQuestion } from '../useTodayQuestion';

jest.mock('../../lib/questions', () => ({
  getTodayQuestion: jest.fn(),
}));

jest.mock('../../lib/i18n', () => ({
  localizeQuestion: jest.fn((q: unknown) => q),
}));

import { getTodayQuestion } from '../../lib/questions';
import { localizeQuestion } from '../../lib/i18n';

const mockGetTodayQuestion = getTodayQuestion as jest.MockedFunction<typeof getTodayQuestion>;
const mockLocalizeQuestion = localizeQuestion as jest.MockedFunction<typeof localizeQuestion>;

const mockQuestion = {
  id: 'q-1',
  question_text: 'Would you rather fly or be invisible?',
  option_a: 'Fly',
  option_b: 'Be invisible',
  scheduled_date: '2025-01-15',
  category: 'superpower',
  is_active: true,
  created_at: '2025-01-01T00:00:00Z',
};

describe('useTodayQuestion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalizeQuestion.mockImplementation((q: unknown) => q as typeof mockQuestion);
  });

  it('should initialize with loading true', () => {
    mockGetTodayQuestion.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useTodayQuestion(true));

    expect(result.current.loading).toBe(true);
    expect(result.current.question).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should not fetch when not authenticated', async () => {
    const { result } = renderHook(() => useTodayQuestion(false));

    // Should remain in initial state since fetch returns early
    expect(result.current.question).toBeNull();
    expect(mockGetTodayQuestion).not.toHaveBeenCalled();
  });

  it('should fetch and set question when authenticated', async () => {
    mockGetTodayQuestion.mockResolvedValue(mockQuestion);

    const { result } = renderHook(() => useTodayQuestion(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.question).toEqual(mockQuestion);
    expect(result.current.error).toBeNull();
    expect(mockGetTodayQuestion).toHaveBeenCalledTimes(1);
  });

  it('should set question to null when getTodayQuestion returns null', async () => {
    mockGetTodayQuestion.mockResolvedValue(null);

    const { result } = renderHook(() => useTodayQuestion(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.question).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should set error when getTodayQuestion throws', async () => {
    mockGetTodayQuestion.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useTodayQuestion(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.question).toBeNull();
  });

  it('should set generic error for non-Error throws', async () => {
    mockGetTodayQuestion.mockRejectedValue('string error');

    const { result } = renderHook(() => useTodayQuestion(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load question');
  });

  it('should support refetch', async () => {
    mockGetTodayQuestion.mockResolvedValue(mockQuestion);

    const { result } = renderHook(() => useTodayQuestion(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const updatedQuestion = { ...mockQuestion, question_text: 'Updated question?' };
    mockGetTodayQuestion.mockResolvedValue(updatedQuestion);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.question).toEqual(updatedQuestion);
    expect(mockGetTodayQuestion).toHaveBeenCalledTimes(2);
  });

  it('should call localizeQuestion on fetched question', async () => {
    const localizedQuestion = { ...mockQuestion, question_text: 'Localized text' };
    mockGetTodayQuestion.mockResolvedValue(mockQuestion);
    mockLocalizeQuestion.mockReturnValue(localizedQuestion);

    const { result } = renderHook(() => useTodayQuestion(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockLocalizeQuestion).toHaveBeenCalledWith(mockQuestion);
    expect(result.current.question).toEqual(localizedQuestion);
  });
});
