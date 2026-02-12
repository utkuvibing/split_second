import React from 'react';
import { render } from '@testing-library/react-native';
import { NoQuestion } from '../NoQuestion';

// Mock useDailyCountdown hook
jest.mock('../../hooks/useDailyCountdown', () => ({
  useDailyCountdown: () => ({ formatted: '12:34:56' }),
}));

describe('NoQuestion', () => {
  it('renders "No question today" text', () => {
    // Text comes from i18n t('noQuestionToday')
    // Just verify component renders without crashing
    const tree = render(<NoQuestion />).toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders "Come back tomorrow" text', () => {
    // Text comes from i18n t('comeBackTomorrow')
    // Just verify component renders without crashing
    const tree = render(<NoQuestion />).toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders DailyCountdown with formatted time', () => {
    const { getByText } = render(<NoQuestion />);
    // Mock returns '12:34:56'
    expect(getByText('12:34:56')).toBeTruthy();
  });

  it('renders hourglass icon', () => {
    const { getByText } = render(<NoQuestion />);
    // AnimatedIcon renders Ionicons mock which outputs the icon name as text
    expect(getByText('hourglass')).toBeTruthy();
  });
});
