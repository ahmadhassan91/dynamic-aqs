'use client';

import React, { useState, useEffect } from 'react';
import {
  WorkflowTemplate,
  WorkflowStep,
  EngineerContact,
  TaskExecution,
  TaskStatus,
  InteractionType
} from '@/types/commercial';

interface WorkflowExecution {
  id: string;
  templateId: string;
  engineerId: string;
  currentStepId: string;
  status: 'active' | 'completed' | 'paused' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  pausedAt?: Date;
  steps: WorkflowStepExecution[];
  notes?: string;
}

interface WorkflowStepExecution {
  stepId: string;
  status: 'pending' | 'active' | 'completed' | 'skipped' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  outcome?: string;
  actualDuration?: number;
  notes?: string;
}

interface WorkflowExecutionMonitorProps {
  className?: string;
}

export default function WorkflowExecutionMonitor({ className = '' }: WorkflowExecutionMonitorProps) {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [engineers, setEngineers] = useState<EngineerContact[]>([]);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'paused' | 'failed'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load workflow executions
      const executionData = await loadWorkflowExecutions();
      setExecutions(executionData);

      // Load templates and engineers for reference
      const templateData = await loadTemplates();
      setTemplates(templateData);

      const engineerData = await loadEngineers();
      setEngineers(engineerData);
    } catch (error) {
      console.error('Error loading workflow execution data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkflowExecutions = async (): Promise<WorkflowExecution[]> => {
    // Mock data - in real implementation, this would come from API
    return [
      {
        id: 'exec_1',
        templateId: 'template_rating_improvement',
        engineerId: 'eng_1',
        currentStepId: 'step_2',
        status: 'active',
        startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        steps: [
          {
            stepId: 'step_1',
            status: 'completed',
            startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            outcome: 'Successfully identified key concerns about product reliability',
            actualDuration: 35,
            notes: 'Engineer was receptive to discussion'
          },
          {
            stepId: 'step_2',
            status: 'active',
            startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            notes: 'Meeting scheduled for tomorrow'
          },
          {
            stepId: 'step_3',
            status: 'pending'
          }
        ]
      },
      {
        id: 'exec_2',
        templateId: 'template_new_contact',
        engineerId: 'eng_2',
        currentStepId: 'step_1',
        status: 'active',
        startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        steps: [
          {
            stepId: 'step_1',
            status: 'active',
            startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            notes: 'Initial call scheduled for this afternoon'
          },
          {
            stepId: 'step_2',
            status: 'pending'
          }
        ]
      },
      {
        id: 'exec_3',
        templateId: 'template_rating_improvement',
        engineerId: 'eng_3',
        currentStepId: 'step_3',
        status: 'completed',
        startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        steps: [
          {
            stepId: 'step_1',
            status: 'completed',
            startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            completedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
            outcome: 'Identified pricing concerns',
            actualDuration: 25
          },
          {
            stepId: 'step_2',
            status: 'completed',
            startedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
            completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            outcome: 'Addressed pricing concerns with value proposition',
            actualDuration: 60
          },
          {
            stepId: 'step_3',
            status: 'completed',
            startedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            outcome: 'Engineer rating improved from 2 to 4',
            actualDuration: 90
          }
        ]
      }
    ];
  };

  const loadTemplates = async (): Promise<WorkflowTemplate[]> => {
    // Mock data - would come from API
    return [
      {
        id: 'template_rating_improvement',
        name: 'Rating Improvement Workflow',
        description: 'Systematic approach to improve engineer ratings',
        category: 'rating_improvement' as any,
        isActive: true,
        steps: [
          {
            id: 'step_1',
            order: 1,
            title: 'Initial Assessment',
            description: 'Understand current concerns',
            suggestedAction: InteractionType.PHONE_CALL,
            estimatedDuration: 30,
            expectedOutcome: 'Identify issues',
            isRequired: true
          },
          {
            id: 'step_2',
            order: 2,
            title: 'Address Concerns',
            description: 'Schedule meeting to provide solutions',
            suggestedAction: InteractionType.MEETING,
            estimatedDuration: 60,
            expectedOutcome: 'Address objections',
            isRequired: true
          },
          {
            id: 'step_3',
            order: 3,
            title: 'Value Demonstration',
            description: 'Provide lunch & learn',
            suggestedAction: InteractionType.LUNCH_AND_LEARN,
            estimatedDuration: 90,
            expectedOutcome: 'Demonstrate value',
            isRequired: true
          }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  };

  const loadEngineers = async (): Promise<EngineerContact[]> => {
    // Mock data - would come from API
    return [
      {
        id: 'eng_1',
        personalInfo: {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          phone: '555-0101'
        },
        engineeringFirmId: 'firm_1',
        rating: 2,
        ratingHistory: [],
        opportunities: [],
        interactions: [],
        totalOpportunityValue: 0,
        wonOpportunityValue: 0,
        specificationHistory: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  };

  const handleCompleteStep = (executionId: string, stepId: string, outcome: string, actualDuration?: number) => {
    setExecutions(prev =>
      prev.map(execution => {
        if (execution.id !== executionId) return execution;

        const updatedSteps = execution.steps.map(step => {
          if (step.stepId === stepId) {
            return {
              ...step,
              status: 'completed' as const,
              completedAt: new Date(),
              outcome,
              actualDuration
            };
          }
          return step;
        });

        // Find next step to activate
        const template = templates.find(t => t.id === execution.templateId);
        const currentStepIndex = template?.steps.findIndex(s => s.id === stepId) || 0;
        const nextStep = template?.steps[currentStepIndex + 1];

        let updatedExecution = {
          ...execution,
          steps: updatedSteps
        };

        if (nextStep) {
          // Activate next step
          updatedExecution.currentStepId = nextStep.id;
          updatedExecution.steps = updatedSteps.map(step => {
            if (step.stepId === nextStep.id) {
              return {
                ...step,
                status: 'active' as const,
                startedAt: new Date()
              };
            }
            return step;
          });
        } else {
          // Workflow completed
          updatedExecution.status = 'completed';
          updatedExecution.completedAt = new Date();
        }

        return updatedExecution;
      })
    );
  };

  const handlePauseExecution = (executionId: string) => {
    setExecutions(prev =>
      prev.map(execution =>
        execution.id === executionId
          ? { ...execution, status: 'paused' as const, pausedAt: new Date() }
          : execution
      )
    );
  };

  const handleResumeExecution = (executionId: string) => {
    setExecutions(prev =>
      prev.map(execution =>
        execution.id === executionId
          ? { ...execution, status: 'active' as const, pausedAt: undefined }
          : execution
      )
    );
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStepStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: '⏳',
      active: '🔄',
      completed: '✅',
      skipped: '⏭️',
      failed: '❌'
    };
    return icons[status] || '❓';
  };

  const filteredExecutions = executions.filter(execution => {
    if (filter === 'all') return true;
    return execution.status === filter;
  });

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
          <h2 className="text-2xl font-bold text-gray-900">Workflow Execution Monitor</h2>
          <p className="text-sm text-gray-600 mt-1">
            Track and manage active workflow executions
          </p>
        </div>
        <button
          onClick={loadData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 mt-4 sm:mt-0"
        >
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          {(['all', 'active', 'completed', 'paused', 'failed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                filter === status
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {status} ({executions.filter(e => status === 'all' || e.status === status).length})
            </button>
          ))}
        </nav>
      </div>

      {/* Executions List */}
      <div className="space-y-6">
        {filteredExecutions.map(execution => {
          const template = templates.find(t => t.id === execution.templateId);
          const engineer = engineers.find(e => e.id === execution.engineerId);
          const currentStep = template?.steps.find(s => s.id === execution.currentStepId);
          const stepExecution = execution.steps.find(s => s.stepId === execution.currentStepId);

          return (
            <div key={execution.id} className="bg-white rounded-lg shadow border">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {template?.name || 'Unknown Template'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Engineer: {engineer?.personalInfo.firstName} {engineer?.personalInfo.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Started: {execution.startedAt.toLocaleDateString()}
                      {execution.completedAt && (
                        <span className="ml-4">
                          Completed: {execution.completedAt.toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(execution.status)}`}>
                      {execution.status.toUpperCase()}
                    </span>
                    {execution.status === 'active' && (
                      <button
                        onClick={() => handlePauseExecution(execution.id)}
                        className="text-yellow-600 hover:text-yellow-800 text-sm"
                      >
                        Pause
                      </button>
                    )}
                    {execution.status === 'paused' && (
                      <button
                        onClick={() => handleResumeExecution(execution.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Resume
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>
                      {execution.steps.filter(s => s.status === 'completed').length} of {execution.steps.length} steps
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(execution.steps.filter(s => s.status === 'completed').length / execution.steps.length) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Current Step */}
                {execution.status === 'active' && currentStep && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Current Step: {currentStep.title}
                    </h4>
                    <p className="text-sm text-blue-800 mb-3">{currentStep.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-blue-700">
                        <span>Action: {currentStep.suggestedAction}</span>
                        <span className="ml-4">Est. Duration: {currentStep.estimatedDuration} min</span>
                      </div>
                      <button
                        onClick={() => {
                          const outcome = prompt('Enter step outcome:');
                          if (outcome) {
                            const duration = prompt('Actual duration (minutes):');
                            handleCompleteStep(
                              execution.id,
                              currentStep.id,
                              outcome,
                              duration ? parseInt(duration) : undefined
                            );
                          }
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-700"
                      >
                        Complete Step
                      </button>
                    </div>
                  </div>
                )}

                {/* Steps Timeline */}
                <div className="space-y-3">
                  {template?.steps.map((step, index) => {
                    const stepExec = execution.steps.find(s => s.stepId === step.id);
                    const isActive = execution.currentStepId === step.id;

                    return (
                      <div
                        key={step.id}
                        className={`flex items-start space-x-3 p-3 rounded-lg ${
                          isActive ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          <span className="text-lg">
                            {getStepStatusIcon(stepExec?.status || 'pending')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900">
                              Step {step.order}: {step.title}
                            </h5>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(stepExec?.status || 'pending')}`}>
                              {(stepExec?.status || 'pending').toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                          {stepExec?.outcome && (
                            <p className="text-sm text-green-700 mt-2 font-medium">
                              Outcome: {stepExec.outcome}
                            </p>
                          )}
                          {stepExec?.notes && (
                            <p className="text-sm text-gray-500 mt-1">
                              Notes: {stepExec.notes}
                            </p>
                          )}
                          {stepExec?.completedAt && (
                            <div className="text-xs text-gray-500 mt-1">
                              Completed: {stepExec.completedAt.toLocaleDateString()}
                              {stepExec.actualDuration && (
                                <span className="ml-2">
                                  Duration: {stepExec.actualDuration} min
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExecutions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workflow executions found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No workflow executions are currently running'
                : `No ${filter} workflow executions found`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}