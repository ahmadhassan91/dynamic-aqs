'use client';

import React, { useState, useEffect } from 'react';
import {
  WorkflowTemplate,
  WorkflowStep,
  WorkflowCategory,
  WorkflowCondition,
  InteractionType,
  TaskExecution,
  EngineerRating
} from '@/types/commercial';
import WorkflowExecutionMonitor from './WorkflowExecutionMonitor';

interface WorkflowPerformanceMetrics {
  templateId: string;
  templateName: string;
  totalExecutions: number;
  completionRate: number;
  averageCompletionTime: number;
  ratingImprovements: number;
  successRate: number;
}

interface WorkflowExecutionData {
  id: string;
  templateId: string;
  engineerId: string;
  engineerName: string;
  currentStep: number;
  totalSteps: number;
  status: 'active' | 'completed' | 'paused' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  progress: number;
}

export default function WorkflowManagementSystem() {
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>([]);
  const [activeExecutions, setActiveExecutions] = useState<WorkflowExecutionData[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<WorkflowPerformanceMetrics[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [showDesigner, setShowDesigner] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [showExecutionMonitor, setShowExecutionMonitor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflowData();
  }, []);

  const loadWorkflowData = async () => {
    try {
      setLoading(true);
      
      // Load workflow templates
      const templates = await loadWorkflowTemplates();
      setWorkflowTemplates(templates);

      // Load active executions
      const executions = await loadActiveExecutions();
      setActiveExecutions(executions);

      // Load performance metrics
      const metrics = await loadPerformanceMetrics();
      setPerformanceMetrics(metrics);
    } catch (error) {
      console.error('Error loading workflow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkflowTemplates = async (): Promise<WorkflowTemplate[]> => {
    // Mock data - in real implementation, this would come from API
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
          }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  };

  const loadActiveExecutions = async (): Promise<WorkflowExecutionData[]> => {
    // Mock data - in real implementation, this would come from API
    return [
      {
        id: 'exec_1',
        templateId: 'template_rating_improvement',
        engineerId: 'eng_1',
        engineerName: 'John Smith',
        currentStep: 2,
        totalSteps: 3,
        status: 'active',
        startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        progress: 66
      },
      {
        id: 'exec_2',
        templateId: 'template_new_contact',
        engineerId: 'eng_2',
        engineerName: 'Sarah Johnson',
        currentStep: 1,
        totalSteps: 2,
        status: 'active',
        startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        progress: 50
      }
    ];
  };

  const loadPerformanceMetrics = async (): Promise<WorkflowPerformanceMetrics[]> => {
    // Mock data - in real implementation, this would come from API
    return [
      {
        templateId: 'template_rating_improvement',
        templateName: 'Rating Improvement Workflow',
        totalExecutions: 25,
        completionRate: 84,
        averageCompletionTime: 21,
        ratingImprovements: 18,
        successRate: 72
      },
      {
        templateId: 'template_new_contact',
        templateName: 'New Contact Onboarding',
        totalExecutions: 42,
        completionRate: 95,
        averageCompletionTime: 14,
        ratingImprovements: 35,
        successRate: 88
      }
    ];
  };

  const handleCreateTemplate = () => {
    const newTemplate: WorkflowTemplate = {
      id: `template_${Date.now()}`,
      name: 'New Workflow Template',
      description: 'Description for new workflow',
      category: WorkflowCategory.RELATIONSHIP_MAINTENANCE,
      isActive: false,
      steps: [],
      createdBy: 'current_user',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setWorkflowTemplates(prev => [...prev, newTemplate]);
    setSelectedTemplate(newTemplate);
    setShowDesigner(true);
  };

  const handleEditTemplate = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    setShowDesigner(true);
  };

  const handleSaveTemplate = (template: WorkflowTemplate) => {
    setWorkflowTemplates(prev =>
      prev.map(t => t.id === template.id ? template : t)
    );
    setShowDesigner(false);
    setSelectedTemplate(null);
  };

  const handleToggleTemplateStatus = (templateId: string) => {
    setWorkflowTemplates(prev =>
      prev.map(template =>
        template.id === templateId
          ? { ...template, isActive: !template.isActive }
          : template
      )
    );
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this workflow template?')) {
      setWorkflowTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  };

  const getCategoryColor = (category: WorkflowCategory) => {
    const colors = {
      [WorkflowCategory.RATING_IMPROVEMENT]: 'bg-red-100 text-red-800',
      [WorkflowCategory.NEW_CONTACT_ONBOARDING]: 'bg-blue-100 text-blue-800',
      [WorkflowCategory.RELATIONSHIP_MAINTENANCE]: 'bg-green-100 text-green-800',
      [WorkflowCategory.OPPORTUNITY_DEVELOPMENT]: 'bg-purple-100 text-purple-800',
      [WorkflowCategory.RE_ENGAGEMENT]: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCreateTemplate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Create Template
          </button>
          <button
            onClick={() => setShowMetrics(!showMetrics)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
          >
            {showMetrics ? 'Hide' : 'Show'} Analytics
          </button>
          <button
            onClick={() => setShowExecutionMonitor(!showExecutionMonitor)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
          >
            {showExecutionMonitor ? 'Hide' : 'Show'} Executions
          </button>
          <button
            onClick={loadWorkflowData}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      {showMetrics && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Performance Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map(metric => (
              <div key={metric.templateId} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{metric.templateName}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Executions:</span>
                    <span className="font-medium">{metric.totalExecutions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completion Rate:</span>
                    <span className="font-medium text-green-600">{metric.completionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Time:</span>
                    <span className="font-medium">{metric.averageCompletionTime} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="font-medium text-blue-600">{metric.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating Improvements:</span>
                    <span className="font-medium text-purple-600">{metric.ratingImprovements}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Executions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Workflow Executions</h3>
        {activeExecutions.length === 0 ? (
          <p className="text-gray-600">No active workflow executions</p>
        ) : (
          <div className="space-y-4">
            {activeExecutions.map(execution => (
              <div key={execution.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{execution.engineerName}</h4>
                    <p className="text-sm text-gray-600">
                      {workflowTemplates.find(t => t.id === execution.templateId)?.name}
                    </p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(execution.status)}`}>
                    {execution.status.toUpperCase()}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress: Step {execution.currentStep} of {execution.totalSteps}</span>
                    <span>{execution.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${execution.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Started: {execution.startedAt.toLocaleDateString()}
                  {execution.completedAt && (
                    <span className="ml-4">
                      Completed: {execution.completedAt.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workflow Templates */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowTemplates.map(template => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <button
                    onClick={() => handleToggleTemplateStatus(template.id)}
                    className={`w-8 h-4 rounded-full ${
                      template.isActive ? 'bg-green-500' : 'bg-gray-300'
                    } relative transition-colors`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${
                        template.isActive ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
              
              <div className="mb-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(template.category)}`}>
                  {template.category.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <div className="flex justify-between">
                  <span>Steps:</span>
                  <span>{template.steps.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={template.isActive ? 'text-green-600' : 'text-gray-500'}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Execution Monitor */}
      {showExecutionMonitor && (
        <WorkflowExecutionMonitor />
      )}

      {/* Workflow Designer Modal */}
      {showDesigner && selectedTemplate && (
        <WorkflowDesigner
          template={selectedTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setShowDesigner(false);
            setSelectedTemplate(null);
          }}
        />
      )}
    </div>
  );
}

// Workflow Designer Component
interface WorkflowDesignerProps {
  template: WorkflowTemplate;
  onSave: (template: WorkflowTemplate) => void;
  onCancel: () => void;
}

function WorkflowDesigner({ template, onSave, onCancel }: WorkflowDesignerProps) {
  const [editingTemplate, setEditingTemplate] = useState<WorkflowTemplate>({ ...template });
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);

  const handleSaveStep = (step: WorkflowStep) => {
    if (editingStep && editingStep.id) {
      // Update existing step
      setEditingTemplate(prev => ({
        ...prev,
        steps: prev.steps.map(s => s.id === step.id ? step : s)
      }));
    } else {
      // Add new step
      const newStep = {
        ...step,
        id: `step_${Date.now()}`,
        order: editingTemplate.steps.length + 1
      };
      setEditingTemplate(prev => ({
        ...prev,
        steps: [...prev.steps, newStep]
      }));
    }
    setEditingStep(null);
  };

  const handleDeleteStep = (stepId: string) => {
    setEditingTemplate(prev => ({
      ...prev,
      steps: prev.steps.filter(s => s.id !== stepId)
    }));
  };

  const handleSave = () => {
    onSave({
      ...editingTemplate,
      updatedAt: new Date()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Workflow Designer</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Template Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name
              </label>
              <input
                type="text"
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={editingTemplate.category}
                onChange={(e) => setEditingTemplate(prev => ({ ...prev, category: e.target.value as WorkflowCategory }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {Object.values(WorkflowCategory).map(category => (
                  <option key={category} value={category}>
                    {category.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editingTemplate.description}
              onChange={(e) => setEditingTemplate(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Workflow Steps */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Workflow Steps</h3>
              <button
                onClick={() => setEditingStep({
                  id: '',
                  order: editingTemplate.steps.length + 1,
                  title: '',
                  description: '',
                  suggestedAction: InteractionType.PHONE_CALL,
                  estimatedDuration: 30,
                  expectedOutcome: '',
                  isRequired: true
                })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Add Step
              </button>
            </div>
            
            <div className="space-y-4">
              {editingTemplate.steps.map((step, index) => (
                <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        Step {step.order}: {step.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        <span>Action: {step.suggestedAction}</span>
                        <span className="ml-4">Duration: {step.estimatedDuration} min</span>
                        <span className="ml-4">Required: {step.isRequired ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setEditingStep(step)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStep(step.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Save Template
          </button>
        </div>
      </div>

      {/* Step Editor Modal */}
      {editingStep && (
        <StepEditor
          step={editingStep}
          onSave={handleSaveStep}
          onCancel={() => setEditingStep(null)}
        />
      )}
    </div>
  );
}

// Step Editor Component
interface StepEditorProps {
  step: WorkflowStep;
  onSave: (step: WorkflowStep) => void;
  onCancel: () => void;
}

function StepEditor({ step, onSave, onCancel }: StepEditorProps) {
  const [editingStep, setEditingStep] = useState<WorkflowStep>({ ...step });

  const handleSave = () => {
    onSave(editingStep);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {step.id ? 'Edit Step' : 'Add Step'}
          </h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Step Title
            </label>
            <input
              type="text"
              value={editingStep.title}
              onChange={(e) => setEditingStep(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editingStep.description}
              onChange={(e) => setEditingStep(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Suggested Action
              </label>
              <select
                value={editingStep.suggestedAction}
                onChange={(e) => setEditingStep(prev => ({ ...prev, suggestedAction: e.target.value as InteractionType }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {Object.values(InteractionType).map(action => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Duration (minutes)
              </label>
              <input
                type="number"
                value={editingStep.estimatedDuration}
                onChange={(e) => setEditingStep(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Outcome
            </label>
            <textarea
              value={editingStep.expectedOutcome}
              onChange={(e) => setEditingStep(prev => ({ ...prev, expectedOutcome: e.target.value }))}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isRequired"
              checked={editingStep.isRequired}
              onChange={(e) => setEditingStep(prev => ({ ...prev, isRequired: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isRequired" className="ml-2 text-sm text-gray-700">
              This step is required
            </label>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Save Step
          </button>
        </div>
      </div>
    </div>
  );
}