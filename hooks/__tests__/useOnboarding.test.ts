import { renderHook, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOnboarding } from '../useOnboarding';

describe('useOnboarding', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading true', () => {
    const { result } = renderHook(() => useOnboarding());

    expect(result.current.loading).toBe(true);
  });

  it('should show onboarding for first launch when AsyncStorage returns null', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useOnboarding());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.showOnboarding).toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('onboarding_complete');
  });

  it('should not show onboarding for returning user when AsyncStorage returns true', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');

    const { result } = renderHook(() => useOnboarding());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.showOnboarding).toBe(false);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('onboarding_complete');
  });

  it('should show onboarding when AsyncStorage returns any value other than true', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('false');

    const { result } = renderHook(() => useOnboarding());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.showOnboarding).toBe(true);
  });

  it('should complete onboarding and update state', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useOnboarding());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.showOnboarding).toBe(true);

    await act(async () => {
      await result.current.completeOnboarding();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('onboarding_complete', 'true');
    expect(result.current.showOnboarding).toBe(false);
  });

  it('should handle AsyncStorage getItem errors gracefully', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

    const { result } = renderHook(() => useOnboarding());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle AsyncStorage setItem errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

    const { result } = renderHook(() => useOnboarding());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.completeOnboarding();
      } catch {
        // Expected to throw
      }
    });

    consoleErrorSpy.mockRestore();
  });

  it('should only call AsyncStorage.getItem once on mount', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');

    const { result, rerender } = renderHook(() => useOnboarding());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    rerender({});
    rerender({});

    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
  });

  it('should allow multiple completeOnboarding calls', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useOnboarding());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.completeOnboarding();
    });

    expect(result.current.showOnboarding).toBe(false);

    await act(async () => {
      await result.current.completeOnboarding();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
    expect(result.current.showOnboarding).toBe(false);
  });
});
