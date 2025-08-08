import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import StatsCard from '../StatsCard';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('StatsCard', () => {
  it('renders stats card with title and value', () => {
    const mockIcon = <div data-testid="test-icon">👤</div>;
    
    renderWithTheme(
      <StatsCard
        title="Total Users"
        value="100"
        icon={mockIcon}
        color="primary"
      />
    );
    
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders with different colors correctly', () => {
    const mockIcon = <div data-testid="test-icon">📊</div>;
    
    renderWithTheme(
      <StatsCard
        title="Revenue"
        value="$1,000"
        icon={mockIcon}
        color="success"
      />
    );
    
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
  });

  it('handles missing values gracefully', () => {
    const mockIcon = <div data-testid="test-icon">⚠️</div>;
    
    renderWithTheme(
      <StatsCard
        title=""
        value=""
        icon={mockIcon}
        color="warning"
      />
    );
    
    // Should still render the component without errors
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });
});
