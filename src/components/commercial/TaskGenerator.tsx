'use client';

import React, { useState, useEffect } from 'react';
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
      [TaskPriority.URGENT]: 'bg-red-100 text-red-800 border-red-200',
      [TaskPriority.HIGH]: 'bg-orange-100 text-orange-800 border-orange-200',
      [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [TaskPriority.LOW]: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: TaskStatus) => {
    const colors = {
      [TaskStatus.NOT_STARTED]: 'bg-gray-100 text-gray-800',
      [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
      [TaskStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [TaskStatus.CANCELLED]: 'bg-red-100 text-red-800',
      [TaskStatus.OVERDUE]: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: TaskCategory) => {
    const icons = {
      [TaskCategory.RATING_IMPROVEMENT]: '⭐',
      [TaskCategory.FOLLOW_UP]: '📅',
      [TaskCategory.OPPORTUNITY_DEVELOPMENT]: '💼',
      [TaskCategory.RELATIONSHIP_BUILDING]: '🤝',
      [TaskCategory.MAINTENANCE]: '🔧'
    };
    return icons[category] || '📋';
  };

  const getActionIcon = (action: InteractionType) => {
    const icons = {
      [InteractionType.PHONE_CALL]: '📞',
      [InteractionType.EMAIL]: '📧',
      [InteractionType.MEETING]: '🤝',
      [InteractionType.LUNCH_AND_LEARN]: '🍽️',
      [InteractionType.SITE_VISIT]: '🏗️',
      [InteractionType.TRADE_SHOW]: '🏢',
      [InteractionType.WEBINAR]: '💻'
    };
    return icons[action] || '💬';
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Generator</h1>
          <p className="text-sm text-gray-600 mt-1">
            AI-generated tasks to improve engineer relationships and move contacts up the rating scale
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoGenerateEnabled}
              onChange={(e) => setAutoGenerateEnabled(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Auto-generate</span>
          </label>
          <button
            onClick={() => loadData()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Refresh Tasks
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setShowTaskMetrics(!showTaskMetrics)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          {showTaskMetrics ? 'Hide' : 'Show'} Metrics
        </button>
        <button
          onClick={() => setShowWorkflowTemplates(!showWorkflowTemplates)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
        >
          {showWorkflowTemplates ? 'Hide' : 'Show'} Templates
        </button>
        <button
          onClick={() => setShowTaskAssignment(!showTaskAssignment)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
        >
          Task Assignment
        </button>
      </div>

      {/* Task Metrics */}
      {showTaskMetrics && taskMetrics && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{taskMetrics.totalTasks}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{taskMetrics.completedTasks}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{taskMetrics.overdueTasks}</div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{taskMetrics.completionRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Tasks by Priority</h4>
              <div className="space-y-1">
                {Object.entries(taskMetrics.tasksByPriority).map(([priority, count]) => (
                  <div key={priority} className="flex justify-between text-sm">
                    <span className="capitalize">{priority}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Rating Improvements</h4>
              <div className="text-2xl font-bold text-green-600">{taskMetrics.ratingImprovements}</div>
              <div className="text-sm text-gray-600">Engineers moved up rating scale</div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Templates */}
      {showWorkflowTemplates && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workflowTemplates.map(template => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                <div className="mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {template.steps.length} steps
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">
            {filteredTasks.filter(t => t.priority === TaskPriority.URGENT).length}
          </div>
          <div className="text-sm text-gray-600">Urgent Tasks</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">
            {filteredTasks.filter(t => t.priority === TaskPriority.HIGH).length}
          </div>
          <div className="text-sm text-gray-600">High Priority</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {filteredTasks.filter(t => t.category === TaskCategory.RATING_IMPROVEMENT).length}
          </div>
          <div className="text-sm text-gray-600">Rating Improvement</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {filteredTasks.filter(t => t.status === TaskStatus.COMPLETED).length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="priority-select" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority-select"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Priorities</option>
              <option value={TaskPriority.URGENT}>Urgent</option>
              <option value={TaskPriority.HIGH}>High</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.LOW}>Low</option>
            </select>
          </div>
          <div>
            <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Categories</option>
              <option value={TaskCategory.RATING_IMPROVEMENT}>Rating Improvement</option>
              <option value={TaskCategory.FOLLOW_UP}>Follow-up</option>
              <option value={TaskCategory.OPPORTUNITY_DEVELOPMENT}>Opportunity Development</option>
              <option value={TaskCategory.RELATIONSHIP_BUILDING}>Relationship Building</option>
              <option value={TaskCategory.MAINTENANCE}>Maintenance</option>
            </select>
          </div>
          <div>
            <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value={TaskStatus.NOT_STARTED}>Not Started</option>
              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
              <option value={TaskStatus.COMPLETED}>Completed</option>
              <option value={TaskStatus.OVERDUE}>Overdue</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedPriority('all');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Task Assignment Panel */}
      {showTaskAssignment && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Assignment Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(getTasksByAssignee()).map(([assigneeId, tasks]) => {
              const assignee = assigneeId === 'unassigned' 
                ? { name: 'Unassigned', role: '' }
                : availableUsers.find(u => u.id === assigneeId) || { name: 'Unknown User', role: '' };
              
              return (
                <div key={assigneeId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{assignee.name}</h4>
                      {assignee.role && (
                        <p className="text-sm text-gray-600">{assignee.role}</p>
                      )}
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {tasks.length} tasks
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {tasks.slice(0, 3).map(task => (
                      <div key={task.id} className="text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900 truncate">{task.title}</span>
                          <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded ${getPriorityColor(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {tasks.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{tasks.length - 3} more tasks
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-semibold text-red-600">
                        {tasks.filter(t => t.priority === TaskPriority.URGENT).length}
                      </div>
                      <div className="text-gray-600">Urgent</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-orange-600">
                        {tasks.filter(t => t.priority === TaskPriority.HIGH).length}
                      </div>
                      <div className="text-gray-600">High</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">
                        {tasks.filter(t => t.status === TaskStatus.COMPLETED).length}
                      </div>
                      <div className="text-gray-600">Done</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map(task => {
          const engineer = allEngineers.find(e => e.id === task.engineerId);
          const isOverdue = task.dueDate < new Date() && task.status !== TaskStatus.COMPLETED;
          const isCompleted = task.status === TaskStatus.COMPLETED;

          return (
            <div
              key={task.id}
              className={`bg-white rounded-lg shadow border-l-4 ${isCompleted
                  ? 'border-green-500 opacity-75'
                  : isOverdue
                    ? 'border-red-500'
                    : task.priority === TaskPriority.URGENT
                      ? 'border-red-400'
                      : 'border-blue-500'
                }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg">{getCategoryIcon(task.category)}</span>
                      <h3 className={`text-lg font-semibold ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {isOverdue && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          OVERDUE
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-3">{task.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-500">Suggested Action:</span>
                        <div className="flex items-center mt-1">
                          <span className="mr-2">{getActionIcon(task.suggestedAction)}</span>
                          <span className="text-gray-900">{task.suggestedAction}</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Due Date:</span>
                        <div className={`mt-1 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {task.dueDate.toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Duration:</span>
                        <div className="text-gray-900 mt-1">{task.estimatedDuration} minutes</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="font-medium text-gray-500">Expected Outcome:</span>
                      <p className="text-gray-900 mt-1">{task.expectedOutcome}</p>
                    </div>

                    {engineer && (
                      <div className="mt-3 text-sm text-gray-600">
                        <span className="font-medium">Engineer:</span> {engineer.personalInfo.firstName} {engineer.personalInfo.lastName}
                        <span className="ml-2">({engineer.engineeringFirmId})</span>
                        <span className="ml-2">Rating: {engineer.rating}★</span>
                      </div>
                    )}

                    {task.assignedTo && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Assigned to:</span> {
                          availableUsers.find(u => u.id === task.assignedTo)?.name || 'Unknown User'
                        }
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {task.status === TaskStatus.NOT_STARTED && (
                      <>
                        <button
                          onClick={() => handleStartTask(task.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                          Start Task
                        </button>
                        <button
                          onClick={() => handleRegenerateTask(task.id)}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
                        >
                          Regenerate
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTaskForAssignment(task);
                          }}
                          className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-200"
                        >
                          Assign
                        </button>
                      </>
                    )}
                    {task.status === TaskStatus.IN_PROGRESS && (
                      <>
                        <button
                          onClick={() => {
                            const outcome = prompt('Enter task outcome:');
                            if (outcome) {
                              handleCompleteTask(task.id, outcome);
                            }
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleRegenerateTask(task.id)}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
                        >
                          Regenerate
                        </button>
                      </>
                    )}
                    {task.status === TaskStatus.COMPLETED && (
                      <div className="space-y-1">
                        <span className="inline-flex px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg">
                          ✓ Completed
                        </span>
                        {task.completedAt && (
                          <div className="text-xs text-gray-500">
                            {task.completedAt.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">All engineers are up to date or try adjusting your filters</p>
          </div>
        </div>
      )}

      {/* Task Assignment Modal */}
      {selectedTaskForAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Assign Task</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedTaskForAssignment.title}</p>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to:
              </label>
              <div className="space-y-2">
                {availableUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => handleAssignTask(selectedTaskForAssignment.id, user.id)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.role}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedTaskForAssignment(null);
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}