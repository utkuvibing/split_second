import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useUserStats } from '../useUserStats';

jest.mock('../../lib/stats', () => ({
  getUserStats: jest.fn(),
}));

import { getUserStats } from '../../lib/stats';

const mockGetUserStats = getUserStats as jest.MockedFunction<typeof getUserStats>;

const mockStats = {
  total_votes: 42,
  majority_percent: 65,
  top_category: 'superpower',
  current_streak: 7,
  longest_streak: 14,
};

describe('useUserStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading true', () => {
    mockGetUserStats.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useUserStats());

    expect(result.current.loading).toBe(true);
    expect(result.current.stats).toBeNull();
  });

  it('should set stats when getUserStats resolves with data', async () => {
    mockGetUserStats.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useUserStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stats).toEqual(mockStats);
  });

  it('should set stats to null when getUserStats resolves with null', async () => {
    mockGetUserStats.mockResolvedValue(null);

    const { result } = renderHook(() => useUserStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stats).toBeNull();
  });

  it('should support refetch', async () => {
    mockGetUserStats.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useUserStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const updatedStats = { ...mockStats, total_votes: 50 };
    mockGetUserStats.mockResolvedValue(updatedStats);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.stats).toEqual(updatedStats);
    expect(mockGetUserStats).toHaveBeenCalledTimes(2);
  });

  it('should only call getUserStats once on mount', async () => {
    mockGetUserStats.mockResolvedValue(mockStats);

    const { result, rerender } = renderHook(() => useUserStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    rerender({});
    rerender({});

    expect(mockGetUserStats).toHaveBeenCalledTimes(1);
  });
});
