/**
 * ErrorBoundary Tests
 * 
 * This file contains tests for the ErrorBoundary component.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '../ErrorBoundary.js';
import { ServicesProvider } from '../../../context/services-context.js';

// Create a mock error service
const mockErrorService = {
  handleError: jest.fn(),
  createError: jest.fn(),
  createAndHandleError: jest.fn()
};

// Mock the error service
jest.mock('../../../services/error/error-service', () => ({
  ErrorService: jest.fn().mockImplementation(() => mockErrorService)
}));

jest.mock('../../../context/services-context', () => {
  const originalModule = jest.requireActual('../../../context/services-context');
  const mockedUseErrorService = jest.fn().mockReturnValue({
    handleError: jest.fn(),
    createError: jest.fn(),
    createAndHandleError: jest.fn(),
  });

  return {
    ...originalModule,
    useErrorService: mockedUseErrorService,
  };
});

// Component that throws an error
const ThrowError = () => {
  throw new Error('Test error');
  return <div>This will not render</div>;
};

// Component that throws an error on button click
const ThrowErrorOnClick = () => {
  const [shouldThrow, setShouldThrow] = React.useState(false);

  if (shouldThrow) {
    throw new Error('Error on click');
  }

  return (
    <button onClick={() => setShouldThrow(true)}>
      Throw Error
    </button>
  );
};

describe('ErrorBoundary', () => {
  // Suppress console errors during tests
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalConsoleError;
  });

  test('should render children when no error occurs', () => {
    const mockErrorService = { handleError: jest.fn() };
    render(
      <ErrorBoundary errorService={mockErrorService}>
        <div>No error</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  test('should render fallback UI when an error occurs', () => {
    const mockErrorService = { handleError: jest.fn() };
    render(
      <ErrorBoundary errorService={mockErrorService}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('Please try again later or contact support if the problem persists.')).toBeInTheDocument();
  });

  test('should render custom fallback UI when provided', () => {
    const mockErrorService = { handleError: jest.fn() };
    render(
      <ErrorBoundary fallback={<div>Custom error message</div>} errorService={mockErrorService}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  test('should show error details when showError is true', () => {
    const mockErrorService = { handleError: jest.fn() };
    render(
      <ErrorBoundary showError={true} errorService={mockErrorService}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error details')).toBeInTheDocument();
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });

  test('should call onReset when try again button is clicked', async () => {
    const onReset = jest.fn();
    const mockErrorService = { handleError: jest.fn() };
    const user = userEvent.setup();

    render(
      <ErrorBoundary onReset={onReset} errorService={mockErrorService}>
        <ThrowError />
      </ErrorBoundary>
    );

    const tryAgainButton = screen.getByText('Try Again');
    await user.click(tryAgainButton);

    expect(onReset).toHaveBeenCalled();
  });

  test('should log error with error service', () => {
    // Use the mockErrorService we defined at the top of the file
    render(
      <ErrorBoundary 
        componentName="TestComponent" 
        errorService={mockErrorService}
      >
        <ThrowError />
      </ErrorBoundary>
    );

    expect(mockErrorService.handleError).toHaveBeenCalled();
    expect(mockErrorService.handleError.mock.calls[0][1]).toBe('TestComponent');
  });
});
