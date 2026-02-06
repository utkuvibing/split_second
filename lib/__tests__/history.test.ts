import { getVoteHistory } from '../history';

jest.mock('../supabase');
import { supabase } from '../supabase';

describe('getVoteHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns array of VoteHistoryItem on success', async () => {
    const mockHistory = [
      {
        question_id: 'q1',
        scheduled_date: '2026-02-05',
        user_choice: 'a',
        option_a: 'Option A',
        option_b: 'Option B',
        count_a: 10,
        count_b: 15,
        total_votes: 25
      },
      {
        question_id: 'q2',
        scheduled_date: '2026-02-04',
        user_choice: 'b',
        option_a: 'Choice A',
        option_b: 'Choice B',
        count_a: 20,
        count_b: 30,
        total_votes: 50
      }
    ];

    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: mockHistory,
      error: null
    });

    const result = await getVoteHistory();

    expect(result).toEqual(mockHistory);
    expect(supabase.rpc).toHaveBeenCalledWith('get_vote_history');
  });

  it('logs error and returns empty array on error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'Failed to fetch history' }
    });

    const result = await getVoteHistory();

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching vote history:',
      'Failed to fetch history'
    );

    consoleSpy.mockRestore();
  });

  it('returns empty array when data is null (no error)', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: null,
      error: null
    });

    const result = await getVoteHistory();

    expect(result).toEqual([]);
  });

  it('returns empty array when data is undefined', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: undefined,
      error: null
    });

    const result = await getVoteHistory();

    expect(result).toEqual([]);
  });
});
