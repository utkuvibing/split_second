import { renderHook, act } from '@testing-library/react-native';
import { useCountdownTimer } from '../useCountdownTimer';

describe('useCountdownTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with correct timeLeft and progress', () => {
    const onExpire = jest.fn();
    const { result } = renderHook(() => useCountdownTimer(10, onExpire, true));

    expect(result.current.timeLeft).toBe(10);
    expect(result.current.progress).toBe(1.0);
  });

  it('should count down each second when active', () => {
    const onExpire = jest.fn();
    const { result } = renderHook(() => useCountdownTimer(5, onExpire, true));

    expect(result.current.timeLeft).toBe(5);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.timeLeft).toBe(4);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.timeLeft).toBe(3);
  });

  it('should call onExpire when timer reaches 0', () => {
    const onExpire = jest.fn();
    const { result } = renderHook(() => useCountdownTimer(3, onExpire, true));

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.timeLeft).toBe(0);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('should not run timer when active is false', () => {
    const onExpire = jest.fn();
    const { result } = renderHook(() => useCountdownTimer(10, onExpire, false));

    expect(result.current.timeLeft).toBe(10);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.timeLeft).toBe(10);
    expect(onExpire).not.toHaveBeenCalled();
  });

  it('should stop timer when active changes from true to false', () => {
    const onExpire = jest.fn();
    const { result, rerender } = renderHook(
      ({ active }: { active: boolean }) => useCountdownTimer(10, onExpire, active),
      { initialProps: { active: true } }
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.timeLeft).toBe(8);

    rerender({ active: false });

    const frozenTime = result.current.timeLeft;

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    // Timer stops counting but does not reset — value stays frozen
    expect(result.current.timeLeft).toBe(frozenTime);
    expect(onExpire).not.toHaveBeenCalled();
  });

  it('should reset timeLeft when reset is called', () => {
    const onExpire = jest.fn();
    const { result } = renderHook(() => useCountdownTimer(10, onExpire, true));

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(result.current.timeLeft).toBe(5);

    act(() => {
      result.current.reset();
    });
    expect(result.current.timeLeft).toBe(10);
  });

  it('should update progress proportionally to timeLeft', () => {
    const onExpire = jest.fn();
    const { result } = renderHook(() => useCountdownTimer(10, onExpire, true));

    expect(result.current.progress).toBe(1.0);

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(result.current.progress).toBe(0.5);

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.progress).toBe(0.2);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.progress).toBe(0);
  });

  it('should restart timer when active changes from false to true', () => {
    const onExpire = jest.fn();
    const { result, rerender } = renderHook(
      ({ active }: { active: boolean }) => useCountdownTimer(5, onExpire, active),
      { initialProps: { active: false } }
    );

    expect(result.current.timeLeft).toBe(5);

    rerender({ active: true });

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.timeLeft).toBe(3);
  });

  it('should use latest onExpire callback', () => {
    const onExpire1 = jest.fn();
    const onExpire2 = jest.fn();
    const { rerender } = renderHook(
      ({ callback }: { callback: () => void }) => useCountdownTimer(2, callback, true),
      { initialProps: { callback: onExpire1 } }
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    rerender({ callback: onExpire2 });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onExpire1).not.toHaveBeenCalled();
    expect(onExpire2).toHaveBeenCalledTimes(1);
  });
});
