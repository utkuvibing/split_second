import { getDailyStats } from '../globalStats';

jest.mock('../supabase');
import { supabase } from '../supabase';

describe('getDailyStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns DailyStats on success', async () => {
    const mockStats = {
      today_votes: 150,
      total_voters: 300
    };

    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: mockStats,
      error: null
    });

    const result = await getDailyStats();

    expect(result).toEqual(mockStats);
    expect(supabase.rpc).toHaveBeenCalledWith('get_daily_stats');
  });

  it('logs error and returns null on error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'RPC call failed' }
    });

    const result = await getDailyStats();

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching daily stats:',
      'RPC call failed'
    );

    consoleSpy.mockRestore();
  });
});
