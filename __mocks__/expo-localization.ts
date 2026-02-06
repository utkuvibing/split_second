export const getLocales = jest.fn(() => [
  {
    languageCode: 'en',
    languageTag: 'en-US',
    regionCode: 'US',
    currencyCode: 'USD',
    currencySymbol: '$',
    decimalSeparator: '.',
    digitGroupingSeparator: ',',
  },
]);

export const getCalendars = jest.fn(() => [
  {
    calendar: 'gregorian',
    timeZone: 'America/New_York',
    uses24hourClock: false,
    firstWeekday: 0,
  },
]);
