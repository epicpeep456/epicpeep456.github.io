import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home screen with title and difficulty buttons', () => {
  render(<App />);
  expect(screen.getByText(/tamil wordle/i)).toBeInTheDocument();
  expect(screen.getByText(/தமிழ் வேர்டில்/i)).toBeInTheDocument();
  expect(screen.getByText(/easy/i)).toBeInTheDocument();
  expect(screen.getByText(/medium/i)).toBeInTheDocument();
  expect(screen.getByText(/hard/i)).toBeInTheDocument();
  expect(screen.getByText(/challenge/i)).toBeInTheDocument();
});
