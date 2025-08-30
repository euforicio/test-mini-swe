import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ServicesPage from '../pages/Services';
import Overview from '../pages/Overview';
import App from '../App';

describe('Services page', () => {
  it('filters services by search text', async () => {
    render(
      <MemoryRouter initialEntries={['/services']}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="services" element={<ServicesPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    const input = await screen.findByLabelText(/search services/i);
    // Type "pay" to match Payments
    await (async () => {
      (input as HTMLInputElement).value = 'pay';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    })();
    // Expect a row with Payments
    const row = await screen.findByText(/Payments/i);
    expect(row).toBeInTheDocument();
  });
});

describe('Overview page', () => {
  it('shows overview counts', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Overview />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    const total = await screen.findByLabelText(/Total Services/i);
    expect(total).toHaveTextContent(/\d+/);
    const envs = screen.getByLabelText(/Environments/i);
    expect(envs).toHaveTextContent(/\d+/);
  });
});
