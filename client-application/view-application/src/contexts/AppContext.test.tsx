import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppContextProvider, useAppContext } from './AppContext';
import { describe, it, expect, vi } from 'vitest';


// A simple component to test the context usage
const TestComponent = () => {
  const appContext = useAppContext();

  return (
    <div>
      <div data-testid="page">{appContext.state.page}</div>
      <button onClick={() => appContext.updateState({ page: 2 })}>Update</button>
    </div>
  );
};

describe('AppContext', () => {
  it('provides initial context value', () => {
    render(
      <AppContextProvider>
        <TestComponent />
      </AppContextProvider>
    );

    const valueElement = screen.getByTestId('page');
    expect(valueElement.textContent).toBe('1'); // Adjust for string comparison
  });

  it('updates context value when updateState is called', () => {
    render(
      <AppContextProvider>
        <TestComponent />
      </AppContextProvider>
    );

    const valueElement = screen.getByTestId('page');
    const updateButton = screen.getByText('Update');

    expect(valueElement.textContent).toBe('1'); // Initially 1

    // Simulate clicking the update button
    fireEvent.click(updateButton);

    // Value should be updated to 2
    expect(valueElement.textContent).toBe('2');
  });

  it('throws error if useAppContext is used outside of AppContextProvider', () => {
    // This will intentionally throw an error because the context is used without the provider
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const BrokenComponent = () => {
      useAppContext(); // Should throw an error
      return null;
    };

    expect(() => render(<BrokenComponent />)).toThrowError(
      'useAppContext must be used within an AppContextProvider'
    );

    errorSpy.mockRestore(); // Clean up
  });
});
