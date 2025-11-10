import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { Logo } from '@/components/ui/Logo';
import { theme } from '@/theme/theme';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider theme={theme}>{children}</MantineProvider>
);

describe('Components', () => {
  test('Logo renders correctly', () => {
    render(
      <TestWrapper>
        <Logo />
      </TestWrapper>
    );
    
    expect(screen.getByText('CRM')).toBeInTheDocument();
    expect(screen.getByAltText('Dynamic AQS')).toBeInTheDocument();
  });
});