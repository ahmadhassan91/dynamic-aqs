'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Text,
  Group,
  Stack,
  Button,
  Select,
  Checkbox,
  Badge,
  Grid,
  Paper,
  SimpleGrid,
  ThemeIcon,
  ActionIcon,
  Menu,
  LoadingOverlay,
  Modal,
  Pagination
} from '@mantine/core';
import {
  IconRefresh,
  IconSettings,
  IconCheck,
  IconX,
  IconDots,
  IconPhone,
  IconMail,
  IconUsers,
  IconBuilding,
  IconCalendar,
  IconStar,
  IconBriefcase,
  IconTool,
  IconTrendingUp
} from '@tabler/icons-react';
import {
  EngineerContact,
  EngineerRating,
  InteractionType,
  RelationshipTask,
  WorkflowTemplate,
  TaskPriority,
  TaskCategory,
  TaskStatus,
  TaskExecution,
  TaskMetrics,
  WorkflowCategory
} from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';

interface TaskGeneratorProps {
  engineers?: EngineerContact[];
  className?: string;
}

export default function TaskGenerator({ engineers, className = '' }: TaskGeneratorProps) {
  const [allEngineers, setAllEngineers] = useState<EngineerContact[]>([]);
  const [generatedTasks, setGeneratedTasks] = useState<RelationshipTask[]>([]);
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>([]);
  const [taskExecutions, setTaskExecutions] = useState<TaskExecution[]>([]);
  const [taskMetrics, setTaskMetrics] = useState<TaskMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [autoGenerateEnabled, setAutoGenerateEnabled] = useState(true);
  const [showWorkflowTemplates, setShowWorkflowTemplates] = useState(false);
  const [showTaskMetrics, setShowTaskMetrics] = useState(false);
  const [showTaskAssignment, setShowTaskAssignment] = useState(false);
  const [selectedTaskForAssignment, setSelectedTaskForAssignment] = useState<RelationshipTask | null>(null);
  const [availableUsers, setAvailableUsers] = useState<Array<{id: string, name: string, role: string}>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
    loadAvailableUsers();
  }, [engineers]);

  const loadData = async () => {
    try {
      setLoading(true);
      const engineerData = engineers || await commercialService.getEngineers();
      setAllEngineers(engineerData);

      // Load workflow templates
      const templates = await loadWorkflowTemplates();
      setWorkflowTemplates(templates);

      // Generate tasks using templates
      const tasks = generateTasksForEngineers(engineerData, templates);
      setGeneratedTasks(tasks);

      // Load task executions and calculate metrics
      const executions = await loadTaskExecutions();
      setTaskExecutions(executions);
      
      const metrics = calculateTaskMetrics(tasks, executions);
      setTaskMetrics(metrics);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkflowTemplates = async (): Promise<WorkflowTemplate[]> => {
    // Mock workflow templates - in real implementation, this would come from API
    return [
      {
        id: 'template_rating_improvement',
        name: 'Rating Improvement Workflow',
        description: 'Systematic approach to improve engineer ratings from hostile/unfavorable to champion',
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
              { type: 'rating', operator: 'less_equal', value: EngineerRating.UNFAVORABLE }
            ]
          },
          {
            id: 'step_2',
            order: 2,
            title: 'Address Concerns',
            description: 'Schedule meeting to provide solutions and build trust',
            suggestedAction: InteractionType.MEETING,
            estimatedDuration: 60,
            expectedOutcome: 'Address objections and establish common ground',
            isRequired: true,
            dependsOn: ['step_1']
          },
          {
            id: 'step_3',
            order: 3,
            title: 'Value Demonstration',
            description: 'Provide lunch & learn or technical presentation',
            suggestedAction: InteractionType.LUNCH_AND_LEARN,
            estimatedDuration: 90,
            expectedOutcome: 'Demonstrate product value and applications',
            isRequired: true,
            dependsOn: ['step_2']
          },
          {
            id: 'step_4',
            order: 4,
            title: 'Champion Development',
            description: 'Provide exclusive access and advanced training',
            suggestedAction: InteractionType.SITE_VISIT,
            estimatedDuration: 120,
            expectedOutcome: 'Convert to active champion',
            isRequired: false,
            dependsOn: ['step_3'],
            conditions: [
              { type: 'rating', operator: 'greater_equal', value: EngineerRating.FAVORABLE }
            ]
          }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'template_new_contact',
        name: 'New Contact Onboarding',
        description: 'Structured approach for engaging new engineer contacts',
        category: WorkflowCategory.NEW_CONTACT_ONBOARDING,
        isActive: true,
        steps: [
          {
            id: 'step_1',
            order: 1,
            title: 'Initial Introduction',
            description: 'Introduce yourself and company capabilities',
            suggestedAction: InteractionType.PHONE_CALL,
            estimatedDuration: 20,
            expectedOutcome: 'Establish initial contact and interest',
            isRequired: true
          },
          {
            id: 'step_2',
            order: 2,
            title: 'Company Overview Meeting',
            description: 'Present company capabilities and product portfolio',
            suggestedAction: InteractionType.MEETING,
            estimatedDuration: 45,
            expectedOutcome: 'Educate on products and establish credibility',
            isRequired: true,
            dependsOn: ['step_1']
          },
          {
            id: 'step_3',
            order: 3,
            title: 'Technical Deep Dive',
            description: 'Provide technical training on relevant products',
            suggestedAction: InteractionType.LUNCH_AND_LEARN,
            estimatedDuration: 90,
            expectedOutcome: 'Build technical knowledge and preference',
            isRequired: false,
            dependsOn: ['step_2']
          }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'template_maintenance',
        name: 'Relationship Maintenance',
        description: 'Regular touchpoints to maintain strong relationships',
        category: WorkflowCategory.RELATIONSHIP_MAINTENANCE,
        isActive: true,
        steps: [
          {
            id: 'step_1',
            order: 1,
            title: 'Quarterly Check-in',
            description: 'Regular relationship maintenance call',
            suggestedAction: InteractionType.PHONE_CALL,
            estimatedDuration: 15,
            expectedOutcome: 'Maintain relationship and identify opportunities',
            isRequired: true,
            conditions: [
              { type: 'days_since_contact', operator: 'greater_than', value: 90 }
            ]
          },
          {
            id: 'step_2',
            order: 2,
            title: 'Value-Add Interaction',
            description: 'Provide industry insights or new product information',
            suggestedAction: InteractionType.EMAIL,
            estimatedDuration: 10,
            expectedOutcome: 'Provide value and stay top-of-mind',
            isRequired: false,
            dependsOn: ['step_1']
          }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  };

  const loadTaskExecutions = async (): Promise<TaskExecution[]> => {
    // Mock task executions - in real implementation, this would come from API
    return [];
  };

  const loadAvailableUsers = async () => {
    // Mock users - in real implementation, this would come from API
    setAvailableUsers([
      { id: 'user_1', name: 'John Smith', role: 'Regional Sales Manager' },
      { id: 'user_2', name: 'Sarah Johnson', role: 'Sales Representative' },
      { id: 'user_3', name: 'Mike Wilson', role: 'Account Manager' },
      { id: 'user_4', name: 'Lisa Brown', role: 'Sales Representative' }
    ]);
  };

  const calculateTaskMetrics = (tasks: RelationshipTask[], executions: TaskExecution[]): TaskMetrics => {
    const now = new Date();
    const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    const overdueTasks = tasks.filter(t => t.dueDate < now && t.status !== TaskStatus.COMPLETED).length;
    
    const tasksByPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<TaskPriority, number>);

    const tasksByCategory = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<TaskCategory, number>);

    const ratingImprovements = executions.filter(e => 
      e.ratingChange && e.ratingChange.newRating > e.ratingChange.previousRating
    ).length;

    return {
      totalTasks: tasks.length,
      completedTasks,
      overdueTasks,
      completionRate: tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0,
      averageCompletionTime: 0, // Would calculate from actual completion data
      tasksByPriority,
      tasksByCategory,
      ratingImprovements,
      relationshipTrend: ratingImprovements > 0 ? 'improving' : 'stable'
    };
  };

  const generateTasksForEngineers = (engineers: EngineerContact[], templates: WorkflowTemplate[]): RelationshipTask[] => {
    const tasks: RelationshipTask[] = [];
    const now = new Date();

    engineers.forEach(engineer => {
      const engineerTasks = generateTasksForEngineer(engineer, now, templates);
      tasks.push(...engineerTasks);
    });

    // Sort by priority and due date
    return tasks.sort((a, b) => {
      const priorityOrder = { 
        [TaskPriority.URGENT]: 4, 
        [TaskPriority.HIGH]: 3, 
        [TaskPriority.MEDIUM]: 2, 
        [TaskPriority.LOW]: 1 
      };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  };

  const generateTasksForEngineer = (engineer: EngineerContact, now: Date, templates: WorkflowTemplate[]): RelationshipTask[] => {
    const tasks: RelationshipTask[] = [];
    const daysSinceLastContact = engineer.lastContactDate
      ? Math.floor((now.getTime() - new Date(engineer.lastContactDate).getTime()) / (24 * 60 * 60 * 1000))
      : 999;

    // Generate tasks from workflow templates
    templates.forEach(template => {
      if (!template.isActive) return;

      const templateTasks = generateTasksFromTemplate(engineer, template, now);
      tasks.push(...templateTasks);
    });

    // Generate ad-hoc tasks based on conditions
    
    // Follow-up tasks
    if (engineer.nextFollowUpDate && new Date(engineer.nextFollowUpDate) <= now) {
      tasks.push(generateFollowUpTask(engineer, now));
    }

    // Urgent re-engagement tasks
    if (daysSinceLastContact > 120) {
      tasks.push(generateUrgentReengagementTask(engineer, now));
    }

    // Opportunity development tasks
    if (engineer.rating >= EngineerRating.FAVORABLE && engineer.opportunities.length === 0) {
      tasks.push(generateOpportunityDevelopmentTask(engineer, now));
    }

    return tasks;
  };

  const generateTasksFromTemplate = (engineer: EngineerContact, template: WorkflowTemplate, now: Date): RelationshipTask[] => {
    const tasks: RelationshipTask[] = [];
    
    // Check if template applies to this engineer
    const applicableSteps = template.steps.filter(step => {
      if (!step.conditions) return true;
      
      return step.conditions.every(condition => {
        switch (condition.type) {
          case 'rating':
            return evaluateCondition(engineer.rating, condition.operator, condition.value as number);
          case 'days_since_contact':
            const daysSinceContact = engineer.lastContactDate
              ? Math.floor((now.getTime() - new Date(engineer.lastContactDate).getTime()) / (24 * 60 * 60 * 1000))
              : 999;
            return evaluateCondition(daysSinceContact, condition.operator, condition.value as number);
          case 'opportunity_count':
            return evaluateCondition(engineer.opportunities.length, condition.operator, condition.value as number);
          case 'interaction_count':
            return evaluateCondition(engineer.interactions.length, condition.operator, condition.value as number);
          default:
            return true;
        }
      });
    });

    // Generate tasks for applicable steps
    applicableSteps.forEach((step, index) => {
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + (step.order * 7)); // Space tasks 1 week apart

      const priority = determinePriority(engineer, step, now);
      
      tasks.push({
        id: `task_${engineer.id}_${template.id}_${step.id}_${Date.now()}`,
        engineerId: engineer.id,
        title: `${step.title} - ${engineer.personalInfo.firstName} ${engineer.personalInfo.lastName}`,
        description: step.description,
        priority,
        category: mapWorkflowCategoryToTaskCategory(template.category),
        suggestedAction: step.suggestedAction,
        dueDate,
        estimatedDuration: step.estimatedDuration,
        expectedOutcome: step.expectedOutcome,
        status: TaskStatus.NOT_STARTED,
        createdBy: 'system',
        createdAt: now,
        updatedAt: now,
        workflowTemplateId: template.id
      });
    });

    return tasks;
  };

  const evaluateCondition = (value: number, operator: string, target: number): boolean => {
    switch (operator) {
      case 'equals': return value === target;
      case 'greater_than': return value > target;
      case 'less_than': return value < target;
      case 'greater_equal': return value >= target;
      case 'less_equal': return value <= target;
      default: return true;
    }
  };

  const determinePriority = (engineer: EngineerContact, step: any, now: Date): TaskPriority => {
    const daysSinceContact = engineer.lastContactDate
      ? Math.floor((now.getTime() - new Date(engineer.lastContactDate).getTime()) / (24 * 60 * 60 * 1000))
      : 999;

    if (daysSinceContact > 120) return TaskPriority.URGENT;
    if (engineer.rating <= EngineerRating.UNFAVORABLE) return TaskPriority.HIGH;
    if (daysSinceContact > 60) return TaskPriority.MEDIUM;
    return TaskPriority.LOW;
  };

  const mapWorkflowCategoryToTaskCategory = (workflowCategory: WorkflowCategory): TaskCategory => {
    switch (workflowCategory) {
      case WorkflowCategory.RATING_IMPROVEMENT: return TaskCategory.RATING_IMPROVEMENT;
      case WorkflowCategory.NEW_CONTACT_ONBOARDING: return TaskCategory.RELATIONSHIP_BUILDING;
      case WorkflowCategory.RELATIONSHIP_MAINTENANCE: return TaskCategory.MAINTENANCE;
      case WorkflowCategory.OPPORTUNITY_DEVELOPMENT: return TaskCategory.OPPORTUNITY_DEVELOPMENT;
      case WorkflowCategory.RE_ENGAGEMENT: return TaskCategory.RELATIONSHIP_BUILDING;
      default: return TaskCategory.RELATIONSHIP_BUILDING;
    }
  };

  const generateFollowUpTask = (engineer: EngineerContact, now: Date): RelationshipTask => {
    const dueDate = new Date(engineer.nextFollowUpDate!);
    const isOverdue = dueDate < now;

    return {
      id: `followup_${engineer.id}_${Date.now()}`,
      engineerId: engineer.id,
      title: `${isOverdue ? 'Overdue ' : ''}Follow-up - ${engineer.personalInfo.firstName} ${engineer.personalInfo.lastName}`,
      description: 'Complete scheduled follow-up interaction based on previous commitment',
      priority: isOverdue ? TaskPriority.URGENT : TaskPriority.HIGH,
      category: TaskCategory.FOLLOW_UP,
      suggestedAction: InteractionType.PHONE_CALL,
      dueDate: isOverdue ? now : dueDate,
      estimatedDuration: 30,
      expectedOutcome: 'Maintain relationship momentum and identify next steps',
      status: TaskStatus.NOT_STARTED,
      createdBy: 'system',
      createdAt: now,
      updatedAt: now
    };
  };

  const generateOpportunityDevelopmentTask = (engineer: EngineerContact, now: Date): RelationshipTask => {
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 14);

    return {
      id: `opportunity_${engineer.id}_${Date.now()}`,
      engineerId: engineer.id,
      title: `Explore Opportunities - ${engineer.personalInfo.firstName} ${engineer.personalInfo.lastName}`,
      description: 'Favorable engineer with no current opportunities. Explore potential projects and applications',
      priority: TaskPriority.MEDIUM,
      category: TaskCategory.OPPORTUNITY_DEVELOPMENT,
      suggestedAction: InteractionType.MEETING,
      dueDate,
      estimatedDuration: 60,
      expectedOutcome: 'Identify potential projects and establish opportunity pipeline',
      status: TaskStatus.NOT_STARTED,
      createdBy: 'system',
      createdAt: now,
      updatedAt: now
    };
  };

  const generateUrgentReengagementTask = (engineer: EngineerContact, now: Date): RelationshipTask => {
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 1);

    return {
      id: `urgent_${engineer.id}_${Date.now()}`,
      engineerId: engineer.id,
      title: `URGENT: Re-engage - ${engineer.personalInfo.firstName} ${engineer.personalInfo.lastName}`,
      description: 'No contact for 4+ months. Immediate action required to prevent relationship deterioration',
      priority: TaskPriority.URGENT,
      category: TaskCategory.RELATIONSHIP_BUILDING,
      suggestedAction: InteractionType.PHONE_CALL,
      dueDate,
      estimatedDuration: 30,
      expectedOutcome: 'Re-establish contact and schedule face-to-face meeting',
      status: TaskStatus.NOT_STARTED,
      createdBy: 'system',
      createdAt: now,
      updatedAt: now
    };
  };

  const handleCompleteTask = async (taskId: string, outcome: string, actualDuration?: number, ratingChange?: any) => {
    const task = generatedTasks.find(t => t.id === taskId);
    if (!task) return;

    // Update task status
    setGeneratedTasks(prev =>
      prev.map(t =>
        t.id === taskId 
          ? { 
              ...t, 
              status: TaskStatus.COMPLETED, 
              completedAt: new Date(),
              completedBy: 'current_user', // In real app, get from auth context
              notes: outcome
            } 
          : t
      )
    );

    // Create task execution record
    const execution: TaskExecution = {
      id: `exec_${taskId}_${Date.now()}`,
      taskId,
      engineerId: task.engineerId,
      executedBy: 'current_user',
      executedAt: new Date(),
      outcome,
      actualDuration,
      followUpRequired: false,
      ratingChange
    };

    setTaskExecutions(prev => [...prev, execution]);

    // Recalculate metrics
    const updatedTasks = generatedTasks.map(t =>
      t.id === taskId ? { ...t, status: TaskStatus.COMPLETED } : t
    );
    const metrics = calculateTaskMetrics(updatedTasks, [...taskExecutions, execution]);
    setTaskMetrics(metrics);
  };

  const handleStartTask = (taskId: string) => {
    setGeneratedTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: TaskStatus.IN_PROGRESS } : task
      )
    );
  };

  const handleRegenerateTask = (taskId: string) => {
    const task = generatedTasks.find(t => t.id === taskId);
    if (!task) return;

    const engineer = allEngineers.find(e => e.id === task.engineerId);
    if (!engineer) return;

    const newTasks = generateTasksForEngineer(engineer, new Date(), workflowTemplates);
    setGeneratedTasks(prev => [
      ...prev.filter(t => t.id !== taskId),
      ...newTasks
    ]);
  };

  const createCustomTask = (engineerId: string, taskData: Partial<RelationshipTask>) => {
    const engineer = allEngineers.find(e => e.id === engineerId);
    if (!engineer) return;

    const newTask: RelationshipTask = {
      id: `custom_${engineerId}_${Date.now()}`,
      engineerId,
      title: taskData.title || 'Custom Task',
      description: taskData.description || '',
      priority: taskData.priority || TaskPriority.MEDIUM,
      category: taskData.category || TaskCategory.RELATIONSHIP_BUILDING,
      suggestedAction: taskData.suggestedAction || InteractionType.PHONE_CALL,
      dueDate: taskData.dueDate || new Date(),
      estimatedDuration: taskData.estimatedDuration || 30,
      expectedOutcome: taskData.expectedOutcome || '',
      status: TaskStatus.NOT_STARTED,
      assignedTo: taskData.assignedTo,
      createdBy: 'current_user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setGeneratedTasks(prev => [...prev, newTask]);
  };

  const handleAssignTask = (taskId: string, userId: string) => {
    setGeneratedTasks(prev =>
      prev.map(task =>
        task.id === taskId 
          ? { ...task, assignedTo: userId, updatedAt: new Date() }
          : task
      )
    );
    setShowTaskAssignment(false);
    setSelectedTaskForAssignment(null);
  };

  const handleBulkAssign = (taskIds: string[], userId: string) => {
    setGeneratedTasks(prev =>
      prev.map(task =>
        taskIds.includes(task.id)
          ? { ...task, assignedTo: userId, updatedAt: new Date() }
          : task
      )
    );
  };

  const getTasksByAssignee = () => {
    const tasksByUser = generatedTasks.reduce((acc, task) => {
      const assignee = task.assignedTo || 'unassigned';
      if (!acc[assignee]) {
        acc[assignee] = [];
      }
      acc[assignee].push(task);
      return acc;
    }, {} as Record<string, RelationshipTask[]>);

    return tasksByUser;
  };

  const filteredTasks = generatedTasks.filter(task => {
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && task.status !== selectedStatus) return false;
    return true;
  });

  const getPriorityColor = (priority: TaskPriority) => {
    const colors = {
      [TaskPriority.URGENT]: 'red',
      [TaskPriority.HIGH]: 'orange',
      [TaskPriority.MEDIUM]: 'yellow',
      [TaskPriority.LOW]: 'green'
    };
    return colors[priority] || 'gray';
  };

  const getStatusColor = (status: TaskStatus) => {
    const colors = {
      [TaskStatus.NOT_STARTED]: 'gray',
      [TaskStatus.IN_PROGRESS]: 'blue',
      [TaskStatus.COMPLETED]: 'green',
      [TaskStatus.CANCELLED]: 'red',
      [TaskStatus.OVERDUE]: 'red'
    };
    return colors[status] || 'gray';
  };

  const getCategoryIcon = (category: TaskCategory) => {
    const icons = {
      [TaskCategory.RATING_IMPROVEMENT]: IconStar,
      [TaskCategory.FOLLOW_UP]: IconCalendar,
      [TaskCategory.OPPORTUNITY_DEVELOPMENT]: IconBriefcase,
      [TaskCategory.RELATIONSHIP_BUILDING]: IconUsers,
      [TaskCategory.MAINTENANCE]: IconTool
    };
    return icons[category] || IconCheck;
  };

  const getActionIcon = (action: InteractionType) => {
    const icons = {
      [InteractionType.PHONE_CALL]: IconPhone,
      [InteractionType.EMAIL]: IconMail,
      [InteractionType.MEETING]: IconUsers,
      [InteractionType.LUNCH_AND_LEARN]: IconUsers,
      [InteractionType.SITE_VISIT]: IconBuilding,
      [InteractionType.TRADE_SHOW]: IconBuilding,
      [InteractionType.WEBINAR]: IconUsers
    };
    return icons[action] || IconDots;
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPriority, selectedCategory, selectedStatus]);

  if (loading) {
    return (
      <Paper p="md" withBorder style={{ minHeight: 400, position: 'relative' }}>
        <LoadingOverlay visible={true} />
      </Paper>
    );
  }

  return (
    <Stack gap="md">
      {/* Header & Controls */}
      <Group justify="space-between" align="center">
        <Group>
          <Checkbox
            label="Auto-generate tasks"
            checked={autoGenerateEnabled}
            onChange={(e) => setAutoGenerateEnabled(e.currentTarget.checked)}
          />
          <Button 
            variant="light" 
            leftSection={<IconRefresh size={16} />}
            onClick={() => loadData()}
            loading={loading}
          >
            Refresh Tasks
          </Button>
        </Group>
        
        <Group>
          <Button 
            variant={showTaskMetrics ? 'filled' : 'light'} 
            onClick={() => setShowTaskMetrics(!showTaskMetrics)}
          >
            Metrics
          </Button>
          <Button 
            variant={showWorkflowTemplates ? 'filled' : 'light'}
            onClick={() => setShowWorkflowTemplates(!showWorkflowTemplates)}
            color="violet"
          >
            Templates
          </Button>
          <Button 
            variant={showTaskAssignment ? 'filled' : 'light'}
            onClick={() => setShowTaskAssignment(!showTaskAssignment)}
            color="teal"
          >
            Assignment
          </Button>
        </Group>
      </Group>

      {/* Task Metrics Dashboard */}
      {showTaskMetrics && taskMetrics && (
        <Paper p="md" withBorder>
          <Title order={4} mb="md">Task Performance Metrics</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
            <Card withBorder p="sm">
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total Tasks</Text>
              <Text size="xl" fw={700} c="blue">{taskMetrics.totalTasks}</Text>
            </Card>
            <Card withBorder p="sm">
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Completed</Text>
              <Text size="xl" fw={700} c="green">{taskMetrics.completedTasks}</Text>
            </Card>
            <Card withBorder p="sm">
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Overdue</Text>
              <Text size="xl" fw={700} c="red">{taskMetrics.overdueTasks}</Text>
            </Card>
            <Card withBorder p="sm">
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Completion Rate</Text>
              <Text size="xl" fw={700} c="violet">{taskMetrics.completionRate.toFixed(1)}%</Text>
            </Card>
          </SimpleGrid>
          
          <Grid mt="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text size="sm" fw={500} mb="xs">Tasks by Priority</Text>
              <Stack gap="xs">
                {Object.entries(taskMetrics.tasksByPriority).map(([priority, count]) => (
                  <Group key={priority} justify="space-between">
                    <Badge color={getPriorityColor(priority as TaskPriority)} variant="light">
                      {priority}
                    </Badge>
                    <Text size="sm" fw={500}>{count}</Text>
                  </Group>
                ))}
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text size="sm" fw={500} mb="xs">Impact</Text>
              <Card withBorder>
                <Group>
                  <ThemeIcon size="lg" color="green" variant="light">
                    <IconStar size={20} />
                  </ThemeIcon>
                  <div>
                    <Text size="xl" fw={700}>{taskMetrics.ratingImprovements}</Text>
                    <Text size="xs" c="dimmed">Rating Improvements</Text>
                  </div>
                </Group>
              </Card>
            </Grid.Col>
          </Grid>
        </Paper>
      )}

      {/* Workflow Templates */}
      {showWorkflowTemplates && (
        <Paper p="md" withBorder>
          <Title order={4} mb="md">Workflow Templates</Title>
          <SimpleGrid cols={{ base: 1, md: 3 }}>
            {workflowTemplates.map(template => (
              <Card key={template.id} withBorder padding="sm">
                <Group justify="space-between" mb="xs">
                  <Text fw={600} size="sm" lineClamp={1}>{template.name}</Text>
                  <Badge 
                    size="xs" 
                    variant={template.isActive ? 'filled' : 'light'}
                    color={template.isActive ? 'green' : 'gray'}
                  >
                    {template.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed" lineClamp={2} mb="md">
                  {template.description}
                </Text>
                <Text size="xs" fw={500}>{template.steps.length} steps</Text>
              </Card>
            ))}
          </SimpleGrid>
        </Paper>
      )}

      {/* Summary Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
        <Card withBorder padding="sm">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">Urgent Tasks</Text>
              <Text size="xl" fw={700} c="red">
                {filteredTasks.filter(t => t.priority === TaskPriority.URGENT).length}
              </Text>
            </div>
            <ThemeIcon color="red" variant="light" size="lg">
              <IconRefresh size={20} />
            </ThemeIcon>
          </Group>
        </Card>
        <Card withBorder padding="sm">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">High Priority</Text>
              <Text size="xl" fw={700} c="orange">
                {filteredTasks.filter(t => t.priority === TaskPriority.HIGH).length}
              </Text>
            </div>
            <ThemeIcon color="orange" variant="light" size="lg">
              <IconStar size={20} />
            </ThemeIcon>
          </Group>
        </Card>
        <Card withBorder padding="sm">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">Rating Improve</Text>
              <Text size="xl" fw={700} c="blue">
                {filteredTasks.filter(t => t.category === TaskCategory.RATING_IMPROVEMENT).length}
              </Text>
            </div>
            <ThemeIcon color="blue" variant="light" size="lg">
              <IconTrendingUp size={20} />
            </ThemeIcon>
          </Group>
        </Card>
        <Card withBorder padding="sm">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">Completed</Text>
              <Text size="xl" fw={700} c="green">
                {filteredTasks.filter(t => t.status === TaskStatus.COMPLETED).length}
              </Text>
            </div>
            <ThemeIcon color="green" variant="light" size="lg">
              <IconCheck size={20} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Filters */}
      <Paper p="sm" withBorder>
        <Grid align="flex-end">
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Select
              label="Priority"
              value={selectedPriority}
              onChange={(val) => setSelectedPriority(val || 'all')}
              data={[
                { value: 'all', label: 'All Priorities' },
                { value: TaskPriority.URGENT, label: 'Urgent' },
                { value: TaskPriority.HIGH, label: 'High' },
                { value: TaskPriority.MEDIUM, label: 'Medium' },
                { value: TaskPriority.LOW, label: 'Low' }
              ]}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Select
              label="Category"
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val || 'all')}
              data={[
                { value: 'all', label: 'All Categories' },
                { value: TaskCategory.RATING_IMPROVEMENT, label: 'Rating Improvement' },
                { value: TaskCategory.FOLLOW_UP, label: 'Follow Up' },
                { value: TaskCategory.OPPORTUNITY_DEVELOPMENT, label: 'Opportunity Dev' },
                { value: TaskCategory.RELATIONSHIP_BUILDING, label: 'Relationship Building' }
              ]}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Select
              label="Status"
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val || 'all')}
              data={[
                { value: 'all', label: 'All Statuses' },
                { value: TaskStatus.NOT_STARTED, label: 'Not Started' },
                { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
                { value: TaskStatus.COMPLETED, label: 'Completed' },
                { value: TaskStatus.OVERDUE, label: 'Overdue' }
              ]}
            />
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Task List */}
      <Stack gap="sm">
        {paginatedTasks.map(task => {
          const CategoryIcon = getCategoryIcon(task.category);
          const SuggestedActionIcon = getActionIcon(task.suggestedAction);
          
          return (
            <Card key={task.id} withBorder padding="sm" radius="md">
              <Grid align="center">
                {/* Task Info */}
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group wrap="nowrap" align="flex-start">
                    <ThemeIcon 
                      size="lg" 
                      color={getPriorityColor(task.priority)} 
                      variant="light"
                      radius="md"
                    >
                      <CategoryIcon size={20} />
                    </ThemeIcon>
                    <div>
                      <Text fw={600} size="sm">{task.title}</Text>
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {task.description}
                      </Text>
                      <Group gap="xs" mt={4}>
                        <Badge size="xs" variant="dot" color={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Group gap={4}>
                          <SuggestedActionIcon size={14} />
                          <Text size="xs" c="dimmed">{task.suggestedAction}</Text>
                        </Group>
                      </Group>
                    </div>
                  </Group>
                </Grid.Col>

                {/* Details */}
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <Stack gap={2}>
                    <Text size="xs" c="dimmed">Due Date</Text>
                    <Text size="sm" fw={500} c={task.dueDate < new Date() ? 'red' : undefined}>
                      {task.dueDate.toLocaleDateString()}
                    </Text>
                  </Stack>
                </Grid.Col>

                {/* Actions */}
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <Group justify="flex-end" gap="xs">
                    {task.status !== TaskStatus.COMPLETED && (
                      <Button 
                        size="xs" 
                        variant="light" 
                        color="green"
                        onClick={() => handleCompleteTask(task.id, 'Completed via quick action')}
                        leftSection={<IconCheck size={14} />}
                      >
                        Complete
                      </Button>
                    )}
                    <Menu position="bottom-end" withArrow>
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <IconDots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<IconSettings size={14} />}>
                          Edit Task
                        </Menu.Item>
                        <Menu.Item leftSection={<IconUsers size={14} />}>
                          Reassign
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item 
                          color="red" 
                          leftSection={<IconX size={14} />}
                        >
                          Cancel Task
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Grid.Col>
              </Grid>
            </Card>
          );
        })}
        
        {filteredTasks.length === 0 && (
          <Paper p="xl" withBorder ta="center">
            <ThemeIcon size={48} radius="xl" color="gray" variant="light" mb="md">
              <IconRefresh size={24} />
            </ThemeIcon>
            <Text size="lg" fw={500}>No tasks found</Text>
            <Text size="sm" c="dimmed" mb="md">
              Try adjusting your filters or generate new tasks
            </Text>
            <Button onClick={() => loadData()} variant="light">
              Generate Tasks
            </Button>
          </Paper>
        )}
      </Stack>

      {/* Pagination */}
      {filteredTasks.length > 0 && (
        <Group justify="center" mt="md">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setCurrentPage}
            size="sm"
          />
          <Text size="sm" c="dimmed">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredTasks.length)} of {filteredTasks.length} tasks
          </Text>
        </Group>
      )}

      {/* Task Assignment Modal */}
      <Modal
        opened={showTaskAssignment && !!selectedTaskForAssignment}
        onClose={() => {
          setShowTaskAssignment(false);
          setSelectedTaskForAssignment(null);
        }}
        title="Assign Task"
      >
        {selectedTaskForAssignment && (
          <Stack>
            <Text size="sm" c="dimmed">{selectedTaskForAssignment.title}</Text>
            <Stack gap="xs">
              {availableUsers.map(user => (
                <Button
                  key={user.id}
                  variant="light"
                  color="gray"
                  fullWidth
                  justify="space-between"
                  onClick={() => handleAssignTask(selectedTaskForAssignment.id, user.id)}
                  rightSection={<Text size="xs" c="dimmed">{user.role}</Text>}
                >
                  {user.name}
                </Button>
              ))}
            </Stack>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
