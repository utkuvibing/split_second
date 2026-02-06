import { renderHook, waitFor } from '@testing-library/react-native';
import { useAuth } from '../useAuth';

jest.mock('../../lib/auth', () => ({
  initAuth: jest.fn(),
}));

import { initAuth } from '../../lib/auth';

const mockInitAuth = initAuth as jest.MockedFunction<typeof initAuth>;

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading true', () => {
    mockInitAuth.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.userId).toBeNull();
  });

  it('should set userId when initAuth resolves with user id', async () => {
    mockInitAuth.mockResolvedValue('user-123');

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.userId).toBe('user-123');
    expect(mockInitAuth).toHaveBeenCalledTimes(1);
  });

  it('should set userId to null when initAuth resolves with null', async () => {
    mockInitAuth.mockResolvedValue(null);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.userId).toBeNull();
    expect(mockInitAuth).toHaveBeenCalledTimes(1);
  });

  it('should handle initAuth rejection gracefully', async () => {
    mockInitAuth.mockRejectedValue(new Error('Auth failed'));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.userId).toBeNull();
  });

  it('should only call initAuth once on mount', async () => {
    mockInitAuth.mockResolvedValue('user-456');

    const { result, rerender } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    rerender({});
    rerender({});

    expect(mockInitAuth).toHaveBeenCalledTimes(1);
  });
});
