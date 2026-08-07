import { render, screen } from '@testing-library/react';
import App from './App';

test('renders game menu', () => {
  render(<App />);
  const title = screen.getByText(/Tamil Whack-a-Mole/i);
  expect(title).toBeInTheDocument();
});
