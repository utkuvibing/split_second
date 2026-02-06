import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useStreak } from '../useStreak';

jest.mock('../../lib/streaks', () => ({
  getUserStreak: jest.fn(),
}));

import { getUserStreak } from '../../lib/streaks';

const mockGetUserStreak = getUserStreak as jest.MockedFunction<typeof getUserStreak>;

describe('useStreak', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading true', () => {
    mockGetUserStreak.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useStreak());

    expect(result.current.loading).toBe(true);
    expect(result.current.streak).toBeNull();
  });

  it('should set streak when getUserStreak resolves with data', async () => {
    const mockStreak = { current_streak: 5, longest_streak: 10, total_votes: 25 };
    mockGetUserStreak.mockResolvedValue(mockStreak);

    const { result } = renderHook(() => useStreak());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.streak).toEqual(mockStreak);
  });

  it('should set streak to null when getUserStreak resolves with null', async () => {
    mockGetUserStreak.mockResolvedValue(null);

    const { result } = renderHook(() => useStreak());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.streak).toBeNull();
  });

  it('should support refetch', async () => {
    mockGetUserStreak.mockResolvedValue({ current_streak: 1, longest_streak: 3, total_votes: 5 });

    const { result } = renderHook(() => useStreak());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const updatedStreak = { current_streak: 2, longest_streak: 3, total_votes: 6 };
    mockGetUserStreak.mockResolvedValue(updatedStreak);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.streak).toEqual(updatedStreak);
    expect(mockGetUserStreak).toHaveBeenCalledTimes(2);
  });

  it('should only call getUserStreak once on mount', async () => {
    mockGetUserStreak.mockResolvedValue({ current_streak: 7, longest_streak: 14, total_votes: 30 });

    const { result, rerender } = renderHook(() => useStreak());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    rerender({});
    rerender({});

    expect(mockGetUserStreak).toHaveBeenCalledTimes(1);
  });
});
