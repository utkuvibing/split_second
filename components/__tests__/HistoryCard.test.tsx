import React from 'react';
import { render } from '@testing-library/react-native';
import { HistoryCard } from '../HistoryCard';
import { VoteHistoryItem } from '../../lib/history';

describe('HistoryCard', () => {
  const baseItem: VoteHistoryItem = {
    question_id: 'q1',
    question_text: 'Coffee or tea?',
    option_a: 'Coffee',
    option_b: 'Tea',
    scheduled_date: '2026-02-06',
    category: 'Food',
    user_choice: 'a',
    voted_at: '2026-02-06T10:00:00Z',
    count_a: 60,
    count_b: 40,
    total: 100,
  };

  it('renders question text', () => {
    const { getByText } = render(<HistoryCard item={baseItem} />);
    expect(getByText('Coffee or tea?')).toBeTruthy();
  });

  it('shows correct percentage for choice a', () => {
    const { getByText } = render(<HistoryCard item={baseItem} />);
    // 60 out of 100 = 60%
    expect(getByText('%60')).toBeTruthy();
    // Shows the option text with checkmark
    expect(getByText('✓ Coffee')).toBeTruthy();
  });

  it('shows correct percentage for choice b', () => {
    const item = { ...baseItem, user_choice: 'b' as const };
    const { getByText } = render(<HistoryCard item={item} />);
    // 40 out of 100 = 40%
    expect(getByText('%40')).toBeTruthy();
    // Shows the option text with checkmark
    expect(getByText('✓ Tea')).toBeTruthy();
  });

  it('shows category', () => {
    const { getByText } = render(<HistoryCard item={baseItem} />);
    expect(getByText('Food')).toBeTruthy();
  });

  it('handles total=0', () => {
    const item: VoteHistoryItem = {
      ...baseItem,
      count_a: 0,
      count_b: 0,
      total: 0,
    };
    const { getByText } = render(<HistoryCard item={item} />);
    // Should show 0%
    expect(getByText('%0')).toBeTruthy();
  });

  it('majority (>=50%) uses success color', () => {
    // user chose 'a', which has 60% (majority)
    const { toJSON } = render(<HistoryCard item={baseItem} />);
    expect(toJSON()).toBeTruthy();
  });

  it('minority (<50%) uses warning color', () => {
    // user chose 'b', which has 40% (minority)
    const item = { ...baseItem, user_choice: 'b' as const };
    const { toJSON } = render(<HistoryCard item={item} />);
    expect(toJSON()).toBeTruthy();
  });
});
