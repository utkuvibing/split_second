import { getUserStreak } from '../streaks';

jest.mock('../supabase');
import { supabase } from '../supabase';

describe('getUserStreak (Supabase integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns streak data when session exists', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-123' }
        }
      },
      error: null
    });

    const mockStreakData = {
      current_streak: 5,
      longest_streak: 12,
      total_votes: 45
    };

    const mockSingle = jest.fn().mockResolvedValue({
      data: mockStreakData,
      error: null
    });
    const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });

    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect
    });

    const result = await getUserStreak();

    expect(result).toEqual(mockStreakData);
    expect(supabase.from).toHaveBeenCalledWith('user_streaks');
    expect(mockSelect).toHaveBeenCalledWith('current_streak, longest_streak, total_votes');
    expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123');
  });

  it('returns null when no session', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null
    });

    const result = await getUserStreak();

    expect(result).toBeNull();
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('returns null when session has no user', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: {} },
      error: null
    });

    const result = await getUserStreak();

    expect(result).toBeNull();
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('returns null on query error', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-123' }
        }
      },
      error: null
    });

    const mockSingle = jest.fn().mockResolvedValue({
      data: null,
      error: { message: 'Query failed' }
    });
    const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });

    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect
    });

    const result = await getUserStreak();

    expect(result).toBeNull();
  });

  it('returns null when data is null', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-123' }
        }
      },
      error: null
    });

    const mockSingle = jest.fn().mockResolvedValue({
      data: null,
      error: null
    });
    const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });

    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect
    });

    const result = await getUserStreak();

    expect(result).toBeNull();
  });
});
