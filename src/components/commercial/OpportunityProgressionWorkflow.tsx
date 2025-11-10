'use client';

import React, { useState, useEffect } from 'react';
import { 
  CommercialOpportunity,
  SalesPhase,
  Quote,
  QuoteStatus 
} from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';

interface WorkflowStep {
  phase: SalesPhase;
  title: string;
  description: string;
  requiredActions: string[];
  automatedActions: string[];
  nextPhases: SalesPhase[];
  estimatedDuration: number; // days
  successCriteria: string[];
}

interface OpportunityProgressionWorkflowProps {
  opportunityId: string;
  className?: string;
}

export default function OpportunityProgressionWorkflow({ 
  opportunityId, 
  className = '' 
}: OpportunityProgressionWorkflowProps) {
  const [opportunity, setOpportunity] = useState<CommercialOpportunity | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedNextPhase, setSelectedNextPhase] = useState<SalesPhase | null>(null);
  const [progressNotes, setProgressNotes] = useState('');

  useEffect(() => {
    loadOpportunityData();
    initializeWorkflowSteps();
  }, [opportunityId]);

  const loadOpportunityData = async () => {
    try {
      setLoading(true);
      const [oppData, quotesData] = await Promise.all([
        commercialService.getOpportunityById(opportunityId),
        commercialService.getQuotesByOpportunity(opportunityId)
      ]);
      
      setOpportunity(oppData);
      setQuotes(quotesData);
    } catch (error) {
      console.error('Error loading opportunity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeWorkflowSteps = () => {
    const steps: WorkflowStep[] = [
      {
        phase: SalesPhase.PROSPECT,
        title: 'Prospect Identification',
        description: 'Initial opportunity identification and qualification',
        requiredActions: [
          'Identify key stakeholders (Engineer, Architect, Building Owner)',
          'Gather project requirements and specifications',
          'Assess project timeline and budget',
          'Determine decision-making process'
        ],
        automatedActions: [
          'Create opportunity record in CRM',
          'Assign to appropriate Regional Sales Manager',
          'Generate initial follow-up tasks'
        ],
        nextPhases: [SalesPhase.PRELIMINARY_QUOTE, SalesPhase.LOST],
        estimatedDuration: 14,
        successCriteria: [
          'All stakeholders identified',
          'Project requirements documented',
          'Budget range confirmed',
          'Timeline established'
        ]
      },
      {
        phase: SalesPhase.PRELIMINARY_QUOTE,
        title: 'Preliminary Quoting',
        description: 'Initial pricing and solution development',
        requiredActions: [
          'Develop preliminary solution design',
          'Generate pricing using pricing tool',
          'Review with engineering team',
          'Present preliminary quote to customer'
        ],
        automatedActions: [
          'Generate quote in pricing tool',
          'Create quote record in CRM',
          'Schedule follow-up reminders',
          'Notify manufacturer rep of quote submission'
        ],
        nextPhases: [SalesPhase.FINAL_QUOTE, SalesPhase.PROSPECT, SalesPhase.LOST],
        estimatedDuration: 21,
        successCriteria: [
          'Preliminary quote submitted',
          'Customer feedback received',
          'Technical requirements validated',
          'Competitive position assessed'
        ]
      },
      {
        phase: SalesPhase.FINAL_QUOTE,
        title: 'Final Quoting',
        description: 'Detailed proposal and final pricing',
        requiredActions: [
          'Finalize technical specifications',
          'Complete detailed pricing analysis',
          'Prepare formal proposal document',
          'Conduct final presentation to decision makers'
        ],
        automatedActions: [
          'Generate final quote in pricing tool',
          'Update CRM with final quote details',
          'Set quote expiration reminders',
          'Trigger approval workflows if needed'
        ],
        nextPhases: [SalesPhase.PO_IN_HAND, SalesPhase.PRELIMINARY_QUOTE, SalesPhase.LOST],
        estimatedDuration: 30,
        successCriteria: [
          'Final quote approved internally',
          'Proposal submitted to customer',
          'All technical questions resolved',
          'Delivery timeline confirmed'
        ]
      },
      {
        phase: SalesPhase.PO_IN_HAND,
        title: 'Purchase Order Received',
        description: 'Customer commitment secured',
        requiredActions: [
          'Review PO terms and conditions',
          'Confirm delivery schedule',
          'Process order in Acumatica',
          'Coordinate with manufacturing'
        ],
        automatedActions: [
          'Create order in Acumatica ERP',
          'Notify all stakeholders of PO receipt',
          'Generate manufacturing work orders',
          'Schedule follow-up alerts (6mo, 1yr, 3yr)'
        ],
        nextPhases: [SalesPhase.WON],
        estimatedDuration: 7,
        successCriteria: [
          'PO processed in system',
          'Manufacturing scheduled',
          'Delivery date confirmed',
          'Customer notified of acceptance'
        ]
      },
      {
        phase: SalesPhase.WON,
        title: 'Project Won',
        description: 'Successful project completion and delivery',
        requiredActions: [
          'Monitor manufacturing progress',
          'Coordinate shipping and delivery',
          'Ensure customer satisfaction',
          'Document lessons learned'
        ],
        automatedActions: [
          'Update opportunity status to Won',
          'Generate shipment notifications',
          'Schedule long-term follow-up alerts',
          'Update rep performance metrics'
        ],
        nextPhases: [],
        estimatedDuration: 0,
        successCriteria: [
          'Product delivered successfully',
          'Customer satisfaction confirmed',
          'Payment received',
          'Relationship maintained for future opportunities'
        ]
      },
      {
        phase: SalesPhase.LOST,
        title: 'Project Lost',
        description: 'Opportunity not won - analysis and learning',
        requiredActions: [
          'Document loss reasons',
          'Conduct post-mortem analysis',
          'Maintain relationship for future opportunities',
          'Update competitive intelligence'
        ],
        automatedActions: [
          'Update opportunity status to Lost',
          'Generate loss analysis report',
          'Schedule future follow-up (if appropriate)',
          'Update market intelligence database'
        ],
        nextPhases: [],
        estimatedDuration: 0,
        successCriteria: [
          'Loss reasons documented',
          'Lessons learned captured',
          'Relationship preserved',
          'Future opportunities identified'
        ]
      }
    ];

    setWorkflowSteps(steps);
  };

  const getCurrentStep = (): WorkflowStep | null => {
    if (!opportunity) return null;
    return workflowSteps.find(step => step.phase === opportunity.salesPhase) || null;
  };

  const getStepStatus = (step: WorkflowStep): 'completed' | 'current' | 'upcoming' => {
    if (!opportunity) return 'upcoming';
    
    const phaseOrder = [
      SalesPhase.PROSPECT,
      SalesPhase.PRELIMINARY_QUOTE,
      SalesPhase.FINAL_QUOTE,
      SalesPhase.PO_IN_HAND,
      SalesPhase.WON
    ];
    
    const currentIndex = phaseOrder.indexOf(opportunity.salesPhase);
    const stepIndex = phaseOrder.indexOf(step.phase);
    
    if (step.phase === SalesPhase.LOST) {
      return opportunity.salesPhase === SalesPhase.LOST ? 'current' : 'upcoming';
    }
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const handleProgressOpportunity = async () => {
    if (!opportunity || !selectedNextPhase) return;

    try {
      const updatedOpportunity = await commercialService.updateOpportunity(opportunity.id, {
        salesPhase: selectedNextPhase,
        notes: [
          ...opportunity.notes,
          {
            id: `note_${Date.now()}`,
            opportunityId: opportunity.id,
            authorId: 'current_user',
            content: progressNotes || `Progressed from ${opportunity.salesPhase} to ${selectedNextPhase}`,
            type: 'General' as any,
            isPrivate: false,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      });

      setOpportunity(updatedOpportunity);
      setShowProgressModal(false);
      setSelectedNextPhase(null);
      setProgressNotes('');
      
      // Trigger automated actions based on new phase
      await triggerAutomatedActions(selectedNextPhase);
      
      alert('Opportunity progressed successfully!');
    } catch (error) {
      console.error('Error progressing opportunity:', error);
      alert('Error progressing opportunity. Please try again.');
    }
  };

  const triggerAutomatedActions = async (newPhase: SalesPhase) => {
    const step = workflowSteps.find(s => s.phase === newPhase);
    if (!step) return;

    // Mock automated actions - in real implementation, these would trigger actual system actions
    console.log('Triggering automated actions for phase:', newPhase);
    step.automatedActions.forEach(action => {
      console.log('Automated action:', action);
    });

    // Example: If moving to PO_IN_HAND, create order in Acumatica
    if (newPhase === SalesPhase.PO_IN_HAND) {
      // Mock Acumatica integration
      console.log('Creating order in Acumatica...');
      console.log('Notifying stakeholders of PO receipt...');
      console.log('Scheduling follow-up alerts...');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPhaseColor = (phase: SalesPhase) => {
    const colors = {
      [SalesPhase.PROSPECT]: 'bg-gray-500',
      [SalesPhase.PRELIMINARY_QUOTE]: 'bg-blue-500',
      [SalesPhase.FINAL_QUOTE]: 'bg-yellow-500',
      [SalesPhase.PO_IN_HAND]: 'bg-green-500',
      [SalesPhase.WON]: 'bg-emerald-500',
      [SalesPhase.LOST]: 'bg-red-500'
    };
    return colors[phase] || 'bg-gray-500';
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

  if (!opportunity) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Opportunity Not Found</h3>
          <p>The requested opportunity could not be loaded.</p>
        </div>
      </div>
    );
  }

  const currentStep = getCurrentStep();
  const nextPhases = currentStep?.nextPhases || [];

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{opportunity.jobSiteName}</h1>
        <p className="text-gray-600 mt-1">{opportunity.description}</p>
        <div className="flex items-center space-x-4 mt-3">
          <span className="text-sm text-gray-500">Current Phase:</span>
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full text-white ${getPhaseColor(opportunity.salesPhase)}`}>
            {opportunity.salesPhase}
          </span>
          <span className="text-sm text-gray-500">Value:</span>
          <span className="text-sm font-medium text-gray-900">{formatCurrency(opportunity.estimatedValue)}</span>
          <span className="text-sm text-gray-500">Probability:</span>
          <span className="text-sm font-medium text-gray-900">{opportunity.probability}%</span>
        </div>
      </div>

      {/* Workflow Progress */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Process Workflow</h2>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-8 left-8 right-8 h-0.5 bg-gray-200"></div>
          
          {/* Workflow Steps */}
          <div className="relative flex justify-between">
            {workflowSteps.filter(step => step.phase !== SalesPhase.LOST).map((step, index) => {
              const status = getStepStatus(step);
              
              return (
                <div key={step.phase} className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                    status === 'completed' ? 'bg-green-500' :
                    status === 'current' ? getPhaseColor(step.phase) :
                    'bg-gray-300'
                  }`}>
                    {status === 'completed' ? '✓' : index + 1}
                  </div>
                  <div className="mt-2 text-center max-w-24">
                    <div className="text-xs font-medium text-gray-900">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.estimatedDuration}d</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Current Step Details */}
      {currentStep && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Step: {currentStep.title}</h3>
            <p className="text-gray-600 mb-4">{currentStep.description}</p>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Required Actions</h4>
              <ul className="space-y-2">
                {currentStep.requiredActions.map((action, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Success Criteria</h4>
              <ul className="space-y-1">
                {currentStep.successCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Automated Actions</h3>
            <p className="text-sm text-gray-600 mb-4">
              These actions will be triggered automatically when progressing to the next phase:
            </p>
            
            <ul className="space-y-2">
              {currentStep.automatedActions.map((action, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="mt-1 w-4 h-4 bg-green-100 rounded flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">{action}</span>
                </li>
              ))}
            </ul>

            {nextPhases.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowProgressModal(true)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                >
                  Progress to Next Phase
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Related Quotes */}
      {quotes.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Quotes</h3>
          <div className="space-y-3">
            {quotes.map(quote => (
              <div key={quote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-gray-900">{quote.quoteNumber}</div>
                  <div className="text-sm text-gray-600">
                    Submitted: {quote.submittedDate.toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{formatCurrency(quote.amount)}</div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    quote.status === QuoteStatus.ACCEPTED ? 'bg-green-100 text-green-800' :
                    quote.status === QuoteStatus.REJECTED ? 'bg-red-100 text-red-800' :
                    quote.status === QuoteStatus.EXPIRED ? 'bg-gray-100 text-gray-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {quote.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Opportunity</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Next Phase
              </label>
              <select
                value={selectedNextPhase || ''}
                onChange={(e) => setSelectedNextPhase(e.target.value as SalesPhase)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select a phase...</option>
                {nextPhases.map(phase => (
                  <option key={phase} value={phase}>{phase}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress Notes (Optional)
              </label>
              <textarea
                value={progressNotes}
                onChange={(e) => setProgressNotes(e.target.value)}
                placeholder="Add any notes about this progression..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[80px]"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowProgressModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleProgressOpportunity}
                disabled={!selectedNextPhase}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Progress Opportunity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}