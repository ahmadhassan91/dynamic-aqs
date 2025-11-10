import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { commercialService } from '@/lib/services/commercialService';
import { EngineerRating } from '@/types/commercial';
import { theme } from '@/theme/theme';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/commercial/engineers/ratings',
}));

// Mock the commercial service
jest.mock('@/lib/services/commercialService', () => ({
  commercialService: {
    getEngineers: jest.fn(),
    updateEngineer: jest.fn(),
    updateEngineerRating: jest.fn(),
    bulkUpdateEngineerRatings: jest.fn(),
  },
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider theme={theme}>{children}</MantineProvider>
);

describe('Engineer Rating Management', () => {
  const mockEngineers = [
    {
      id: 'eng_1',
      personalInfo: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        phone: '555-0001',
        title: 'Senior Engineer',
        company: 'Test Engineering'
      },
      engineeringFirmId: 'firm_1',
      rating: EngineerRating.FAVORABLE,
      ratingHistory: [],
      opportunities: [],
      interactions: [],
      totalOpportunityValue: 100000,
      wonOpportunityValue: 50000,
      specificationHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(() => {
    (commercialService.getEngineers as jest.Mock).mockResolvedValue(mockEngineers);
    (commercialService.updateEngineer as jest.Mock).mockResolvedValue(mockEngineers[0]);
    (commercialService.updateEngineerRating as jest.Mock).mockResolvedValue({
      ...mockEngineers[0],
      rating: EngineerRating.CHAMPION,
      ratingHistory: [{
        previousRating: EngineerRating.FAVORABLE,
        newRating: EngineerRating.CHAMPION,
        reason: 'Test update',
        changedBy: 'test_user',
        changedAt: new Date()
      }]
    });
  });

  test('commercialService updateEngineerRating works correctly', async () => {
    const result = await commercialService.updateEngineerRating(
      'eng_1',
      EngineerRating.CHAMPION,
      'Test rating update',
      'test_user'
    );

    expect(commercialService.updateEngineerRating).toHaveBeenCalledWith(
      'eng_1',
      EngineerRating.CHAMPION,
      'Test rating update',
      'test_user'
    );
    expect(result.rating).toBe(EngineerRating.CHAMPION);
    expect(result.ratingHistory).toHaveLength(1);
  });

  test('commercialService bulkUpdateEngineerRatings works correctly', async () => {
    const engineerIds = ['eng_1', 'eng_2'];
    (commercialService.bulkUpdateEngineerRatings as jest.Mock).mockResolvedValue([
      { ...mockEngineers[0], rating: EngineerRating.CHAMPION },
      { ...mockEngineers[0], id: 'eng_2', rating: EngineerRating.CHAMPION }
    ]);

    const result = await commercialService.bulkUpdateEngineerRatings(
      engineerIds,
      EngineerRating.CHAMPION,
      'Bulk update test',
      'test_user'
    );

    expect(commercialService.bulkUpdateEngineerRatings).toHaveBeenCalledWith(
      engineerIds,
      EngineerRating.CHAMPION,
      'Bulk update test',
      'test_user'
    );
    expect(result).toHaveLength(2);
    expect(result[0].rating).toBe(EngineerRating.CHAMPION);
  });

  test('EngineerRating enum values are correct', () => {
    expect(EngineerRating.HOSTILE).toBe(1);
    expect(EngineerRating.UNFAVORABLE).toBe(2);
    expect(EngineerRating.NEUTRAL).toBe(3);
    expect(EngineerRating.FAVORABLE).toBe(4);
    expect(EngineerRating.CHAMPION).toBe(5);
  });
});