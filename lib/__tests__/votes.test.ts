import { submitVote, getUserVote, getResults } from '../votes';

jest.mock('../supabase');
import { supabase } from '../supabase';

describe('votes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('submitVote', () => {
    it('returns VoteResults on success', async () => {
      const mockResults = {
        count_a: 10,
        count_b: 15,
        total: 25,
        success: true
      };

      (supabase.rpc as jest.Mock).mockResolvedValue({
        data: mockResults,
        error: null
      });

      const result = await submitVote('question-123', 'a');

      expect(result).toEqual(mockResults);
      expect(supabase.rpc).toHaveBeenCalledWith('submit_vote_and_get_results', {
        p_question_id: 'question-123',
        p_choice: 'a'
      });
    });

    it('logs error and returns null on error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      (supabase.rpc as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'RPC failed' }
      });

      const result = await submitVote('question-123', 'b');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Vote submission failed:',
        'RPC failed'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('getUserVote', () => {
    it('returns choice when session exists and vote found', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123' }
          }
        },
        error: null
      });

      const mockSingle = jest.fn().mockResolvedValue({
        data: { choice: 'a' },
        error: null
      });
      const mockEq2 = jest.fn().mockReturnValue({ single: mockSingle });
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect
      });

      const result = await getUserVote('question-123');

      expect(result).toBe('a');
      expect(supabase.from).toHaveBeenCalledWith('votes');
      expect(mockSelect).toHaveBeenCalledWith('choice');
      expect(mockEq1).toHaveBeenCalledWith('question_id', 'question-123');
      expect(mockEq2).toHaveBeenCalledWith('user_id', 'user-123');
    });

    it('returns null when no session exists', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: null
      });

      const result = await getUserVote('question-123');

      expect(result).toBeNull();
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('returns null when session has no user', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: {} },
        error: null
      });

      const result = await getUserVote('question-123');

      expect(result).toBeNull();
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
      const mockEq2 = jest.fn().mockReturnValue({ single: mockSingle });
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect
      });

      const result = await getUserVote('question-123');

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
      const mockEq2 = jest.fn().mockReturnValue({ single: mockSingle });
      const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect
      });

      const result = await getUserVote('question-123');

      // data?.choice returns undefined when data is null
      expect(result).toBeUndefined();
    });
  });

  describe('getResults', () => {
    it('returns VoteResults with success true on success', async () => {
      const mockData = {
        count_a: 30,
        count_b: 20,
        total_votes: 50
      };

      const mockSingle = jest.fn().mockResolvedValue({
        data: mockData,
        error: null
      });
      const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect
      });

      const result = await getResults('question-123');

      expect(result).toEqual({
        count_a: 30,
        count_b: 20,
        total: 50,
        success: true
      });
      expect(supabase.from).toHaveBeenCalledWith('question_results');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('question_id', 'question-123');
    });

    it('logs error and returns null on error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Results fetch failed' }
      });
      const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect
      });

      const result = await getResults('question-123');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching results:',
        'Results fetch failed'
      );

      consoleSpy.mockRestore();
    });
  });
});
