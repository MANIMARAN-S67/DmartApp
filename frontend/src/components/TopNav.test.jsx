import { render, screen } from '@testing-library/react';
import TopNav from '../components/TopNav';

describe('TopNav', () => {
  test('renders TopNav component', () => {
    render(<TopNav />);
    const linkElement = screen.getByText(/Home/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('navigates to the correct page on link click', () => {
    render(<TopNav />);
    const linkElement = screen.getByText(/About/i);
    linkElement.click();
    expect(window.location.pathname).toBe('/about');
  });
});