import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ErrorBoundary } from '../ErrorBoundary';

// Silence expected console.error from React error boundary
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});

function ThrowingChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Test error');
  return <Text>Child content</Text>;
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Child content</Text>
      </ErrorBoundary>
    );

    expect(getByText('Child content')).toBeTruthy();
  });

  it('shows fallback UI when child throws', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText(':(')).toBeTruthy();
    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('The app encountered an unexpected error')).toBeTruthy();
    expect(getByText('Try Again')).toBeTruthy();
  });

  it('Try Again button resets error state and re-renders children', async () => {
    const { getByText, rerender } = render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>
    );

    // Verify error UI is shown
    expect(getByText('Try Again')).toBeTruthy();

    // Re-render with non-throwing child (still shows error UI because hasError is still true)
    rerender(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={false} />
      </ErrorBoundary>
    );

    // Error UI should still be shown
    expect(getByText('Try Again')).toBeTruthy();

    // Click Try Again to reset error state
    fireEvent.press(getByText('Try Again'));

    // Now children should be rendered
    await waitFor(() => {
      expect(getByText('Child content')).toBeTruthy();
    });
  });

  it('componentDidCatch logs error to console.error', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });

  it('handles sequential errors', async () => {
    const { getByText, rerender } = render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>
    );

    // First error
    expect(getByText('Try Again')).toBeTruthy();

    // Change to non-throwing child
    rerender(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={false} />
      </ErrorBoundary>
    );

    // Retry
    fireEvent.press(getByText('Try Again'));

    await waitFor(() => {
      expect(getByText('Child content')).toBeTruthy();
    });

    // Throw again
    rerender(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Try Again')).toBeTruthy();
  });
});
