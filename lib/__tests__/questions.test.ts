import { getTodayQuestion } from '../questions';

jest.mock('../supabase');
import { supabase } from '../supabase';

describe('getTodayQuestion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns Question on success', async () => {
    const mockQuestion = {
      id: 'question-123',
      option_a: 'Option A',
      option_b: 'Option B',
      scheduled_date: '2026-02-06',
      is_active: true,
      created_at: '2026-02-05T00:00:00Z'
    };

    const mockSingle = jest.fn().mockResolvedValue({
      data: mockQuestion,
      error: null
    });
    const mockEq2 = jest.fn().mockReturnValue({ single: mockSingle });
    const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });

    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect
    });

    const result = await getTodayQuestion();

    expect(result).toEqual(mockQuestion);
    expect(supabase.from).toHaveBeenCalledWith('questions');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq2).toHaveBeenCalledWith('is_active', true);
  });

  it('returns null silently on PGRST116 error (no question found)', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const mockSingle = jest.fn().mockResolvedValue({
      data: null,
      error: { code: 'PGRST116', message: 'No rows found' }
    });
    const mockEq2 = jest.fn().mockReturnValue({ single: mockSingle });
    const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });

    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect
    });

    const result = await getTodayQuestion();

    expect(result).toBeNull();
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('logs error and returns null on other errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const mockSingle = jest.fn().mockResolvedValue({
      data: null,
      error: { code: 'OTHER_ERROR', message: 'Database connection failed' }
    });
    const mockEq2 = jest.fn().mockReturnValue({ single: mockSingle });
    const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });

    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect
    });

    const result = await getTodayQuestion();

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching question:',
      'Database connection failed'
    );

    consoleSpy.mockRestore();
  });
});
