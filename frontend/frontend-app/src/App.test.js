import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

test('renders Product Review POC header', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const headerElement = screen.getByText(/Product Review POC/i);
  expect(headerElement).toBeInTheDocument();
});
