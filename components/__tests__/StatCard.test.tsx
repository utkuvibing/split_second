import React from 'react';
import { render } from '@testing-library/react-native';
import { StatCard } from '../StatCard';

describe('StatCard', () => {
  it('renders emoji', () => {
    const { getByText } = render(
      <StatCard emoji="🔥" value="7" label="Day Streak" />
    );
    expect(getByText('🔥')).toBeTruthy();
  });

  it('renders value', () => {
    const { getByText } = render(
      <StatCard emoji="🔥" value="7" label="Day Streak" />
    );
    expect(getByText('7')).toBeTruthy();
  });

  it('renders label', () => {
    const { getByText } = render(
      <StatCard emoji="🔥" value="7" label="Day Streak" />
    );
    expect(getByText('Day Streak')).toBeTruthy();
  });

  it('renders all props together', () => {
    const { getByText } = render(
      <StatCard emoji="✅" value="42" label="Total Votes" />
    );
    expect(getByText('✅')).toBeTruthy();
    expect(getByText('42')).toBeTruthy();
    expect(getByText('Total Votes')).toBeTruthy();
  });
});
