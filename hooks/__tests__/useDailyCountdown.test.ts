import { renderHook, act } from '@testing-library/react-native';
import { useDailyCountdown } from '../useDailyCountdown';

describe('useDailyCountdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with positive secondsLeft less than 86400', () => {
    const { result } = renderHook(() => useDailyCountdown());

    expect(result.current.secondsLeft).toBeGreaterThan(0);
    expect(result.current.secondsLeft).toBeLessThanOrEqual(86400);
  });

  it('should format time as HH:MM:SS pattern', () => {
    const { result } = renderHook(() => useDailyCountdown());

    expect(result.current.formatted).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it('should update timer after 1 second', () => {
    const { result } = renderHook(() => useDailyCountdown());

    const initialSeconds = result.current.secondsLeft;

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.secondsLeft).toBeLessThanOrEqual(initialSeconds);
    expect(result.current.formatted).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it('should continuously update every second', () => {
    const { result } = renderHook(() => useDailyCountdown());

    const initialSeconds = result.current.secondsLeft;

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const afterOneSecond = result.current.secondsLeft;

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const afterTwoSeconds = result.current.secondsLeft;

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const afterThreeSeconds = result.current.secondsLeft;

    expect(afterOneSecond).toBeLessThanOrEqual(initialSeconds);
    expect(afterTwoSeconds).toBeLessThanOrEqual(afterOneSecond);
    expect(afterThreeSeconds).toBeLessThanOrEqual(afterTwoSeconds);
  });

  it('should format time correctly for different values', () => {
    const { result } = renderHook(() => useDailyCountdown());

    expect(result.current.formatted).toMatch(/^\d{2}:\d{2}:\d{2}$/);

    const parts = result.current.formatted.split(':');
    expect(parts).toHaveLength(3);

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);

    expect(hours).toBeGreaterThanOrEqual(0);
    expect(hours).toBeLessThan(24);
    expect(minutes).toBeGreaterThanOrEqual(0);
    expect(minutes).toBeLessThan(60);
    expect(seconds).toBeGreaterThanOrEqual(0);
    expect(seconds).toBeLessThan(60);
  });

  it('should cleanup interval on unmount', () => {
    const { unmount } = renderHook(() => useDailyCountdown());

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
