import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import StateDisplay, { LoadingState, ErrorState, EmptyState, SuccessState } from '../StateDisplay';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('StateDisplay', () => {
  it('renders loading state correctly', () => {
    renderWithTheme(<StateDisplay state="loading" />);
    
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state with action button', () => {
    const mockAction = jest.fn();
    
    renderWithTheme(
      <StateDisplay 
        state="error" 
        action={{ label: 'Reintentar', onClick: mockAction }}
      />
    );
    
    expect(screen.getByText('Error')).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /Reintentar/i });
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('renders empty state', () => {
    renderWithTheme(<StateDisplay state="empty" />);
    
    expect(screen.getByText('Sin datos')).toBeInTheDocument();
    expect(screen.getByText(/No hay información disponible/)).toBeInTheDocument();
  });

  it('renders success state', () => {
    renderWithTheme(<StateDisplay state="success" />);
    
    expect(screen.getByText('¡Éxito!')).toBeInTheDocument();
    expect(screen.getByText(/La operación se completó correctamente/)).toBeInTheDocument();
  });

  it('renders custom title and message', () => {
    const customTitle = 'Custom Title';
    const customMessage = 'Custom message content';
    
    renderWithTheme(
      <StateDisplay 
        state="loading" 
        title={customTitle}
        message={customMessage}
      />
    );
    
    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('shows home button when requested', () => {
    renderWithTheme(
      <StateDisplay 
        state="error" 
        showHomeButton={true}
      />
    );
    
    expect(screen.getByRole('button', { name: /Ir al Dashboard/i })).toBeInTheDocument();
  });
});

describe('StateDisplay convenience components', () => {
  it('LoadingState renders correctly', () => {
    renderWithTheme(<LoadingState title="Loading data..." />);
    
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('ErrorState renders with home button by default', () => {
    renderWithTheme(<ErrorState />);
    
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ir al Dashboard/i })).toBeInTheDocument();
  });

  it('EmptyState renders correctly', () => {
    renderWithTheme(<EmptyState message="No items found" />);
    
    expect(screen.getByText('Sin datos')).toBeInTheDocument();
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('SuccessState renders correctly', () => {
    renderWithTheme(<SuccessState message="Data saved successfully" />);
    
    expect(screen.getByText('¡Éxito!')).toBeInTheDocument();
    expect(screen.getByText('Data saved successfully')).toBeInTheDocument();
  });
});
