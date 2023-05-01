import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

// Mocks the Sidebar component
jest.mock('./components/Sidebar/Sidebar', () => {
  // eslint-disable-next-line react/display-name
  return () => <div data-testid="sidebar">Sidebar</div>;
});

describe('App', () => {
  test('renders App component', () => {
    render(<App />);
    const appElement = screen.getByTestId('app');
    expect(appElement).toBeInTheDocument();
  });

  test('renders Sidebar component', () => {
    render(<App />);
    const sidebarElement = screen.getByTestId('sidebar');
    expect(sidebarElement).toBeInTheDocument();
  });
});
