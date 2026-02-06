import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingScreen } from '../LoadingScreen';

describe('LoadingScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<LoadingScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('contains ActivityIndicator', () => {
    const tree = render(<LoadingScreen />).toJSON();
    expect(tree).toBeTruthy();
    // ActivityIndicator should be present in the tree
    expect(JSON.stringify(tree)).toContain('ActivityIndicator');
  });
});
