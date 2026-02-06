import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useVote } from '../useVote';

jest.mock('../../lib/votes', () => ({
  submitVote: jest.fn(),
  getUserVote: jest.fn(),
  getResults: jest.fn(),
}));

import { submitVote, getUserVote, getResults } from '../../lib/votes';

const mockSubmitVote = submitVote as jest.MockedFunction<typeof submitVote>;
const mockGetUserVote = getUserVote as jest.MockedFunction<typeof getUserVote>;
const mockGetResults = getResults as jest.MockedFunction<typeof getResults>;

describe('useVote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with undefined questionId', async () => {
    const { result } = renderHook(() => useVote(undefined));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasVoted).toBe(false);
    expect(result.current.userChoice).toBeNull();
    expect(result.current.results).toBeNull();
    expect(mockGetUserVote).not.toHaveBeenCalled();
  });

  it('should load no prior vote when getUserVote returns null', async () => {
    mockGetUserVote.mockResolvedValue(null);

    const { result } = renderHook(() => useVote('question-1'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasVoted).toBe(false);
    expect(result.current.userChoice).toBeNull();
    expect(result.current.results).toBeNull();
    expect(mockGetUserVote).toHaveBeenCalledWith('question-1');
  });

  it('should load existing choice and results when user has voted', async () => {
    mockGetUserVote.mockResolvedValue('a');
    mockGetResults.mockResolvedValue({
      count_a: 60,
      count_b: 40,
      total: 100,
      success: true,
    });

    const { result } = renderHook(() => useVote('question-2'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasVoted).toBe(true);
    expect(result.current.userChoice).toBe('a');
    expect(result.current.results).toEqual({
      count_a: 60,
      count_b: 40,
      total: 100,
      success: true,
    });
    expect(mockGetUserVote).toHaveBeenCalledWith('question-2');
    expect(mockGetResults).toHaveBeenCalledWith('question-2');
  });

  it('should submit vote and update state when vote is called', async () => {
    mockGetUserVote.mockResolvedValue(null);
    mockSubmitVote.mockResolvedValue({
      count_a: 1,
      count_b: 0,
      total: 1,
      success: true,
    });

    const { result } = renderHook(() => useVote('question-3'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasVoted).toBe(false);

    await act(async () => {
      await result.current.vote('a');
    });

    expect(mockSubmitVote).toHaveBeenCalledWith('question-3', 'a');
    expect(result.current.userChoice).toBe('a');
    expect(result.current.hasVoted).toBe(true);
    expect(result.current.results).toEqual({
      count_a: 1,
      count_b: 0,
      total: 1,
      success: true,
    });
  });

  it('should prevent double voting', async () => {
    mockGetUserVote.mockResolvedValue('a');
    mockGetResults.mockResolvedValue({
      count_a: 50,
      count_b: 50,
      total: 100,
      success: true,
    });

    const { result } = renderHook(() => useVote('question-4'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasVoted).toBe(true);

    await act(async () => {
      await result.current.vote('b');
    });

    expect(mockSubmitVote).not.toHaveBeenCalled();
    expect(result.current.userChoice).toBe('a');
  });

  it('should handle vote submission failure', async () => {
    mockGetUserVote.mockResolvedValue(null);
    mockSubmitVote.mockResolvedValue(null);

    const { result } = renderHook(() => useVote('question-5'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.vote('b');
    });

    expect(mockSubmitVote).toHaveBeenCalledWith('question-5', 'b');
    expect(result.current.userChoice).toBeNull();
    expect(result.current.results).toBeNull();
  });

  it('should set submitting flag during vote submission', async () => {
    mockGetUserVote.mockResolvedValue(null);
    mockSubmitVote.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        count_a: 0,
        count_b: 1,
        total: 1,
        success: true,
      }), 100))
    );

    const { result } = renderHook(() => useVote('question-6'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.submitting).toBe(false);

    act(() => {
      result.current.vote('b');
    });

    expect(result.current.submitting).toBe(true);

    await waitFor(() => {
      expect(result.current.submitting).toBe(false);
    });

    expect(result.current.userChoice).toBe('b');
  });

  it('should not allow voting while submitting', async () => {
    mockGetUserVote.mockResolvedValue(null);
    mockSubmitVote.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        count_a: 1,
        count_b: 0,
        total: 1,
        success: true,
      }), 100))
    );

    const { result } = renderHook(() => useVote('question-7'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Start first vote — sets submitting=true asynchronously
    act(() => {
      result.current.vote('a');
    });

    // Wait for submitting to be true before attempting second vote
    await waitFor(() => {
      expect(result.current.submitting).toBe(true);
    });

    // Second vote should be rejected because submitting=true
    await act(async () => {
      await result.current.vote('b');
    });

    await waitFor(() => {
      expect(result.current.submitting).toBe(false);
    });

    expect(mockSubmitVote).toHaveBeenCalledTimes(1);
    expect(mockSubmitVote).toHaveBeenCalledWith('question-7', 'a');
  });

  it('should handle questionId change', async () => {
    mockGetUserVote.mockResolvedValue(null);

    const { result, rerender } = renderHook(
      ({ questionId }: { questionId: string }) => useVote(questionId),
      { initialProps: { questionId: 'question-8' } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetUserVote).toHaveBeenCalledWith('question-8');

    mockGetUserVote.mockClear();
    mockGetUserVote.mockResolvedValue('b');
    mockGetResults.mockResolvedValue({
      count_a: 30,
      count_b: 70,
      total: 100,
      success: true,
    });

    rerender({ questionId: 'question-9' });

    await waitFor(() => {
      expect(mockGetUserVote).toHaveBeenCalledWith('question-9');
    });
  });
});
