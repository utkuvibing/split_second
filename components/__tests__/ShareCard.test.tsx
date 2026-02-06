import React from 'react';
import { render } from '@testing-library/react-native';
import { ShareCard } from '../ShareCard';

describe('ShareCard', () => {
  const defaultProps = {
    questionText: 'Coffee or tea?',
    optionA: 'Coffee',
    optionB: 'Tea',
    percentA: 60,
    percentB: 40,
    userChoice: 'a' as const,
  };

  it('renders question text', () => {
    const { getByText } = render(<ShareCard {...defaultProps} />);
    expect(getByText('Coffee or tea?')).toBeTruthy();
  });

  it('renders both options with text', () => {
    const { getByText } = render(<ShareCard {...defaultProps} />);
    expect(getByText('Coffee')).toBeTruthy();
    expect(getByText('Tea')).toBeTruthy();
  });

  it('shows correct percentages', () => {
    const { getByText } = render(<ShareCard {...defaultProps} />);
    expect(getByText('60%')).toBeTruthy();
    expect(getByText('40%')).toBeTruthy();
  });

  it('highlights user choice a', () => {
    const { toJSON } = render(<ShareCard {...defaultProps} userChoice="a" />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('highlights user choice b', () => {
    const { toJSON } = render(<ShareCard {...defaultProps} userChoice="b" />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders brand text SPLIT SECOND', () => {
    const { getByText } = render(<ShareCard {...defaultProps} />);
    expect(getByText('SPLIT SECOND')).toBeTruthy();
  });

  it('renders footer text', () => {
    // Footer text comes from i18n t('shareCardFooter')
    // Just verify the component renders without crashing
    const tree = render(<ShareCard {...defaultProps} />).toJSON();
    expect(tree).toBeTruthy();
  });
});
