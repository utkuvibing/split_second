import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useVoteHistory } from '../useVoteHistory';

jest.mock('../../lib/history', () => ({
  getVoteHistory: jest.fn(),
}));

jest.mock('../../lib/i18n', () => ({
  localizeQuestion: jest.fn((q: unknown) => q),
}));

import { getVoteHistory } from '../../lib/history';
import { localizeQuestion } from '../../lib/i18n';

const mockGetVoteHistory = getVoteHistory as jest.MockedFunction<typeof getVoteHistory>;
const mockLocalizeQuestion = localizeQuestion as jest.MockedFunction<typeof localizeQuestion>;

const mockHistoryItems = [
  {
    question_id: 'q-1',
    question_text: 'Fly or invisible?',
    option_a: 'Fly',
    option_b: 'Invisible',
    scheduled_date: '2025-01-15',
    category: 'superpower',
    user_choice: 'a' as const,
    voted_at: '2025-01-15T12:00:00Z',
    count_a: 60,
    count_b: 40,
    total: 100,
  },
  {
    question_id: 'q-2',
    question_text: 'Pizza or sushi?',
    option_a: 'Pizza',
    option_b: 'Sushi',
    scheduled_date: '2025-01-14',
    category: 'food',
    user_choice: 'b' as const,
    voted_at: '2025-01-14T12:00:00Z',
    count_a: 45,
    count_b: 55,
    total: 100,
  },
];

describe('useVoteHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalizeQuestion.mockImplementation((q: unknown) => q as typeof mockHistoryItems[0]);
  });

  it('should initialize with loading true and empty history', () => {
    mockGetVoteHistory.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useVoteHistory());

    expect(result.current.loading).toBe(true);
    expect(result.current.history).toEqual([]);
  });

  it('should set history when getVoteHistory resolves with data', async () => {
    mockGetVoteHistory.mockResolvedValue(mockHistoryItems);

    const { result } = renderHook(() => useVoteHistory());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.history).toEqual(mockHistoryItems);
  });

  it('should handle empty array result', async () => {
    mockGetVoteHistory.mockResolvedValue([]);

    const { result } = renderHook(() => useVoteHistory());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.history).toEqual([]);
  });

  it('should support refetch', async () => {
    mockGetVoteHistory.mockResolvedValue([mockHistoryItems[0]]);

    const { result } = renderHook(() => useVoteHistory());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    mockGetVoteHistory.mockResolvedValue(mockHistoryItems);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.history).toEqual(mockHistoryItems);
    expect(mockGetVoteHistory).toHaveBeenCalledTimes(2);
  });

  it('should call localizeQuestion on each history item', async () => {
    mockGetVoteHistory.mockResolvedValue(mockHistoryItems);

    const { result } = renderHook(() => useVoteHistory());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockLocalizeQuestion).toHaveBeenCalledTimes(2);
    expect(mockLocalizeQuestion).toHaveBeenCalledWith(mockHistoryItems[0], 0, mockHistoryItems);
    expect(mockLocalizeQuestion).toHaveBeenCalledWith(mockHistoryItems[1], 1, mockHistoryItems);
  });
});
