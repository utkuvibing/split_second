import {
  getAppLocalDateKey,
  compareLocalDateKeys,
  getLocalDateKeyFromParams,
  isPastLocalDate,
  isFutureLocalDate,
  isTodayLocalDate,
} from '../date';

describe('date helpers', () => {
  const realDate = Date;

  afterEach(() => {
    global.Date = realDate;
  });

  function mockNow(isoLocal: string) {
    const fixed = new realDate(isoLocal);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.Date = class extends realDate {
      constructor(...args: unknown[]) {
        if (args.length === 0) {
          super(fixed.getTime());
          return;
        }
        super(...(args as ConstructorParameters<typeof realDate>));
      }
      static now() {
        return fixed.getTime();
      }
    } as DateConstructor;
  }

  it('getAppLocalDateKey returns YYYY-MM-DD for local date', () => {
    mockNow('2026-05-29T15:00:00');
    expect(getAppLocalDateKey()).toBe('2026-05-29');
  });

  it('compareLocalDateKeys orders lexicographically', () => {
    expect(compareLocalDateKeys('2026-05-28', '2026-05-29')).toBe(-1);
    expect(compareLocalDateKeys('2026-05-29', '2026-05-29')).toBe(0);
    expect(compareLocalDateKeys('2026-05-30', '2026-05-29')).toBe(1);
  });

  it('getLocalDateKeyFromParams validates calendar dates', () => {
    expect(getLocalDateKeyFromParams('2026-05-29')).toBe('2026-05-29');
    expect(getLocalDateKeyFromParams('2026-02-30')).toBeNull();
    expect(getLocalDateKeyFromParams('bad')).toBeNull();
  });

  it('isPast/isFuture/isToday relative to app local today', () => {
    mockNow('2026-05-29T12:00:00');
    expect(isTodayLocalDate('2026-05-29')).toBe(true);
    expect(isPastLocalDate('2026-05-28')).toBe(true);
    expect(isFutureLocalDate('2026-05-30')).toBe(true);
  });
});
