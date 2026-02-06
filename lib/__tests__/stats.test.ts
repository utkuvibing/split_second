import { getUserStats } from '../stats';

jest.mock('../supabase');
import { supabase } from '../supabase';

describe('getUserStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns UserStats on success', async () => {
    const mockStats = {
      total_votes: 42,
      current_streak: 7,
      longest_streak: 14
    };

    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: mockStats,
      error: null
    });

    const result = await getUserStats();

    expect(result).toEqual(mockStats);
    expect(supabase.rpc).toHaveBeenCalledWith('get_user_stats');
  });

  it('logs error and returns null on error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'Stats RPC failed' }
    });

    const result = await getUserStats();

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching user stats:',
      'Stats RPC failed'
    );

    consoleSpy.mockRestore();
  });
});
