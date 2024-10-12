import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from '../Dashboard';
import { useAppContext } from '../../contexts/AppContext';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';



// Mock the entire AppContext module
vi.mock('../../contexts/AppContext', () => ({
  useAppContext: vi.fn(),
}));

// const mockUseAppContext = useAppContext as vi.Mock;


describe('Dashboard Component', () => {
  beforeEach(() => {

    (useAppContext as vi.Mock).mockReturnValue({
      state: { page: 1 },
      updateState: vi.fn(),
    });
  });

  it('renders the logo and title', () => {
    render(<Dashboard />);

    // Check if the image is rendered
    const logo = screen.getByTestId('main-logo');
    const src = logo.getAttribute('src');
    expect(src).toBe('/src/assets/surge_view_new_cropped_transparent.png');

    // Check if the title is rendered
    expect(screen.getByText('Business Tools')).toBeInTheDocument();
    
  });

  it('renders side menu items', () => {
    render(<Dashboard />);

    // Check if side menu items are present
    expect(screen.getByText('Home', {selector: '.ant-menu-title-content'})).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('handles menu click', async () => {
    const user = userEvent.setup();
    // const mockUpdateState = (useAppContext as unknown as vi.Mock).mock.results[0].value.updateState;

    render(<Dashboard />);

    // Simulate clicking on 'Profile' in the menu
    await user.click(screen.getByText('Profile'));

    // Ensure that the updateState function was called with the correct key
    expect(useAppContext().updateState).toHaveBeenCalledWith({ page: 2 });
  });
});
