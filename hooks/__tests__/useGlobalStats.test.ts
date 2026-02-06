import { renderHook, waitFor } from '@testing-library/react-native';
import { useGlobalStats } from '../useGlobalStats';

jest.mock('../../lib/globalStats', () => ({
  getDailyStats: jest.fn(),
}));

import { getDailyStats } from '../../lib/globalStats';

const mockGetDailyStats = getDailyStats as jest.MockedFunction<typeof getDailyStats>;

describe('useGlobalStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading true', () => {
    mockGetDailyStats.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useGlobalStats());

    expect(result.current.loading).toBe(true);
    expect(result.current.stats).toBeNull();
  });

  it('should set stats when getDailyStats resolves with data', async () => {
    const mockStats = { today_votes: 42, total_voters: 100 };
    mockGetDailyStats.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useGlobalStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stats).toEqual(mockStats);
  });

  it('should set stats to null when getDailyStats resolves with null', async () => {
    mockGetDailyStats.mockResolvedValue(null);

    const { result } = renderHook(() => useGlobalStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stats).toBeNull();
  });

  it('should set loading to false after resolution', async () => {
    mockGetDailyStats.mockResolvedValue({ today_votes: 10, total_voters: 50 });

    const { result } = renderHook(() => useGlobalStats());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should only call getDailyStats once on mount', async () => {
    mockGetDailyStats.mockResolvedValue({ today_votes: 5, total_voters: 20 });

    const { result, rerender } = renderHook(() => useGlobalStats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    rerender({});
    rerender({});

    expect(mockGetDailyStats).toHaveBeenCalledTimes(1);
  });
});
