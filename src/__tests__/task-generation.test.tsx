import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import TaskGenerator from '@/components/commercial/TaskGenerator';
import { commercialService } from '@/lib/services/commercialService';
import { 
  EngineerRating, 
  InteractionType, 
  TaskPriority, 
  TaskCategory, 
  TaskStatus,
  WorkflowCategory 
} from '@/types/commercial';
import { theme } from '@/theme/theme';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/commercial/task-generator',
}));

// Mock the commercial service
jest.mock('@/lib/services/commercialService', () => ({
  commercialService: {
    getEngineers: jest.fn(),
    getTasks: jest.fn(),
    getWorkflowTemplates: jest.fn(),
    createTask: jest.fn(),
    completeTask: jest.fn(),
    getTaskMetrics: jest.fn(),
  },
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider theme={theme}>{children}</MantineProvider>
);

describe('Task Generation for Relationship Building', () => {
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
      rating: EngineerRating.NEUTRAL,
      ratingHistory: [],
      opportunities: [],
      interactions: [],
      lastContactDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
      nextFollowUpDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days overdue
      totalOpportunityValue: 100000,
      wonOpportunityValue: 50000,
      specificationHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'eng_2',
      personalInfo: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '555-0002',
        title: 'Principal Engineer',
        company: 'Another Engineering'
      },
      engineeringFirmId: 'firm_2',
      rating: EngineerRating.HOSTILE,
      ratingHistory: [],
      opportunities: [],
      interactions: [],
      lastContactDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), // 150 days ago
      totalOpportunityValue: 200000,
      wonOpportunityValue: 0,
      specificationHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockWorkflowTemplates = [
    {
      id: 'template_rating_improvement',
      name: 'Rating Improvement Workflow',
      description: 'Systematic approach to improve engineer ratings',
      category: WorkflowCategory.RATING_IMPROVEMENT,
      isActive: true,
      steps: [
        {
          id: 'step_1',
          order: 1,
          title: 'Initial Assessment',
          description: 'Understand current concerns and objections',
          suggestedAction: InteractionType.PHONE_CALL,
          estimatedDuration: 30,
          expectedOutcome: 'Identify specific issues and concerns',
          isRequired: true,
          conditions: [
            { type: 'rating' as const, operator: 'less_equal' as const, value: EngineerRating.UNFAVORABLE }
          ]
        }
      ],
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(() => {
    (commercialService.getEngineers as jest.Mock).mockResolvedValue(mockEngineers);
    (commercialService.getTasks as jest.Mock).mockResolvedValue([]);
    (commercialService.getWorkflowTemplates as jest.Mock).mockResolvedValue(mockWorkflowTemplates);
    (commercialService.getTaskMetrics as jest.Mock).mockResolvedValue({
      totalTasks: 0,
      completedTasks: 0,
      overdueTasks: 0,
      completionRate: 0,
      averageCompletionTime: 0,
      tasksByPriority: {
        [TaskPriority.LOW]: 0,
        [TaskPriority.MEDIUM]: 0,
        [TaskPriority.HIGH]: 0,
        [TaskPriority.URGENT]: 0
      },
      tasksByCategory: {
        [TaskCategory.RATING_IMPROVEMENT]: 0,
        [TaskCategory.FOLLOW_UP]: 0,
        [TaskCategory.OPPORTUNITY_DEVELOPMENT]: 0,
        [TaskCategory.RELATIONSHIP_BUILDING]: 0,
        [TaskCategory.MAINTENANCE]: 0
      },
      ratingImprovements: 0,
      relationshipTrend: 'stable' as const
    });
  });

  test('renders task generator component', async () => {
    render(
      <TestWrapper>
        <TaskGenerator />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Task Generator')).toBeInTheDocument();
    });
  });

  test('displays task generation description', async () => {
    render(
      <TestWrapper>
        <TaskGenerator />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/AI-generated tasks to improve engineer relationships/)).toBeInTheDocument();
    });
  });

  test('shows workflow templates when button is clicked', async () => {
    render(
      <TestWrapper>
        <TaskGenerator />
      </TestWrapper>
    );

    await waitFor(() => {
      const showTemplatesButton = screen.getByText('Show Templates');
      fireEvent.click(showTemplatesButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Workflow Templates')).toBeInTheDocument();
      expect(screen.getByText('Rating Improvement Workflow')).toBeInTheDocument();
    });
  });

  test('shows task metrics when button is clicked', async () => {
    render(
      <TestWrapper>
        <TaskGenerator />
      </TestWrapper>
    );

    await waitFor(() => {
      const showMetricsButton = screen.getByText('Show Metrics');
      fireEvent.click(showMetricsButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Task Performance Metrics')).toBeInTheDocument();
      expect(screen.getByText('Total Tasks')).toBeInTheDocument();
      expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    });
  });

  test('filters tasks by priority', async () => {
    render(
      <TestWrapper>
        <TaskGenerator />
      </TestWrapper>
    );

    await waitFor(() => {
      const prioritySelect = screen.getByLabelText('Priority');
      fireEvent.change(prioritySelect, { target: { value: TaskPriority.URGENT } });
    });

    // Verify filter is applied
    expect(screen.getByDisplayValue('urgent')).toBeInTheDocument();
  });

  test('filters tasks by category', async () => {
    render(
      <TestWrapper>
        <TaskGenerator />
      </TestWrapper>
    );

    await waitFor(() => {
      const categorySelect = screen.getByLabelText('Category');
      fireEvent.change(categorySelect, { target: { value: TaskCategory.RATING_IMPROVEMENT } });
    });

    // Verify filter is applied
    expect(screen.getByDisplayValue('rating_improvement')).toBeInTheDocument();
  });

  test('filters tasks by status', async () => {
    render(
      <TestWrapper>
        <TaskGenerator />
      </TestWrapper>
    );

    await waitFor(() => {
      const statusSelect = screen.getByLabelText('Status');
      fireEvent.change(statusSelect, { target: { value: TaskStatus.COMPLETED } });
    });

    // Verify filter is applied
    expect(screen.getByDisplayValue('completed')).toBeInTheDocument();
  });

  test('clears all filters when clear button is clicked', async () => {
    render(
      <TestWrapper>
        <TaskGenerator />
      </TestWrapper>
    );

    await waitFor(() => {
      // Set some filters first
      const prioritySelect = screen.getByLabelText('Priority');
      fireEvent.change(prioritySelect, { target: { value: TaskPriority.HIGH } });
      
      const categorySelect = screen.getByLabelText('Category');
      fireEvent.change(categorySelect, { target: { value: TaskCategory.FOLLOW_UP } });
      
      // Clear filters
      const clearButton = screen.getByText('Clear Filters');
      fireEvent.click(clearButton);
    });

    // Verify filters are cleared
    expect(screen.getByDisplayValue('all')).toBeInTheDocument();
  });

  test('auto-generate toggle works correctly', async () => {
    render(
      <TestWrapper>
        <TaskGenerator />
      </TestWrapper>
    );

    await waitFor(() => {
      const autoGenerateCheckbox = screen.getByLabelText('Auto-generate');
      expect(autoGenerateCheckbox).toBeChecked();
      
      fireEvent.click(autoGenerateCheckbox);
      expect(autoGenerateCheckbox).not.toBeChecked();
    });
  });

  test('refresh tasks button triggers data reload', async () => {
    render(
      <TestWrapper>
        <TaskGenerator />
      </TestWrapper>
    );

    await waitFor(() => {
      const refreshButton = screen.getByText('Refresh Tasks');
      fireEvent.click(refreshButton);
    });

    // Verify service methods are called again
    expect(commercialService.getEngineers).toHaveBeenCalledTimes(2); // Initial load + refresh
  });

  test('task priority enum values are correct', () => {
    expect(TaskPriority.LOW).toBe('low');
    expect(TaskPriority.MEDIUM).toBe('medium');
    expect(TaskPriority.HIGH).toBe('high');
    expect(TaskPriority.URGENT).toBe('urgent');
  });

  test('task category enum values are correct', () => {
    expect(TaskCategory.RATING_IMPROVEMENT).toBe('rating_improvement');
    expect(TaskCategory.FOLLOW_UP).toBe('follow_up');
    expect(TaskCategory.OPPORTUNITY_DEVELOPMENT).toBe('opportunity_development');
    expect(TaskCategory.RELATIONSHIP_BUILDING).toBe('relationship_building');
    expect(TaskCategory.MAINTENANCE).toBe('maintenance');
  });

  test('task status enum values are correct', () => {
    expect(TaskStatus.NOT_STARTED).toBe('not_started');
    expect(TaskStatus.IN_PROGRESS).toBe('in_progress');
    expect(TaskStatus.COMPLETED).toBe('completed');
    expect(TaskStatus.CANCELLED).toBe('cancelled');
    expect(TaskStatus.OVERDUE).toBe('overdue');
  });
});