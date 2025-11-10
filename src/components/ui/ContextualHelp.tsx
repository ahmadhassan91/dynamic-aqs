'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AccessibleModal } from './AccessibleComponents';
import { FadeIn, SlideIn } from './Animations';

interface HelpStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector for the element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface HelpTour {
  id: string;
  title: string;
  description: string;
  steps: HelpStep[];
}

interface ContextualHelpProps {
  helpId: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function ContextualHelp({ 
  helpId, 
  content, 
  position = 'top', 
  className = '' 
}: ContextualHelpProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let x = 0;
      let y = 0;

      switch (position) {
        case 'top':
          x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          y = triggerRect.top - tooltipRect.height - 8;
          break;
        case 'bottom':
          x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          y = triggerRect.bottom + 8;
          break;
        case 'left':
          x = triggerRect.left - tooltipRect.width - 8;
          y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          break;
        case 'right':
          x = triggerRect.right + 8;
          y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          break;
      }

      // Ensure tooltip stays within viewport
      x = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8));
      y = Math.max(8, Math.min(y, window.innerHeight - tooltipRect.height - 8));

      setTooltipPosition({ x, y });
    }
  }, [isVisible, position]);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={triggerRef}
        onClick={() => setIsVisible(!isVisible)}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        aria-label="Show help"
        aria-describedby={`help-${helpId}`}
      >
        <HelpCircle size={16} />
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          id={`help-${helpId}`}
          role="tooltip"
          className="fixed z-50 max-w-xs p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          <div className="relative">
            {content}
            <div
              className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
                position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
                position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
                position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
                'left-[-4px] top-1/2 -translate-y-1/2'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface OnboardingTourProps {
  tour: HelpTour;
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingTour({ tour, isActive, onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const step = tour.steps[currentStep];
    if (step?.target) {
      const element = document.querySelector(step.target) as HTMLElement;
      if (element) {
        setHighlightedElement(element);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight class
        element.classList.add('tour-highlight');
        
        return () => {
          element.classList.remove('tour-highlight');
        };
      }
    }
  }, [currentStep, isActive, tour.steps]);

  const nextStep = () => {
    if (currentStep < tour.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isActive) return null;

  const step = tour.steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Tour popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <FadeIn>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-500">
                  Step {currentStep + 1} of {tour.steps.length}
                </p>
              </div>
              <button
                onClick={onSkip}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label="Skip tour"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">{step.content}</p>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>

              <div className="flex space-x-1">
                {tour.steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currentStep === tour.steps.length - 1 ? 'Finish' : 'Next'}
                {currentStep < tour.steps.length - 1 && (
                  <ChevronRight size={16} className="ml-1" />
                )}
              </button>
            </div>
          </div>
        </FadeIn>
      </div>

      <style jsx global>{`
        .tour-highlight {
          position: relative;
          z-index: 45;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpCenter({ isOpen, onClose }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpCategories = [
    { id: 'all', name: 'All Topics' },
    { id: 'customers', name: 'Customer Management' },
    { id: 'leads', name: 'Lead Management' },
    { id: 'training', name: 'Training' },
    { id: 'reports', name: 'Reports' },
    { id: 'admin', name: 'Administration' },
  ];

  const helpArticles = [
    {
      id: '1',
      title: 'How to add a new customer',
      category: 'customers',
      content: 'Step-by-step guide to adding customers...',
    },
    {
      id: '2',
      title: 'Managing lead pipeline',
      category: 'leads',
      content: 'Learn how to effectively manage your leads...',
    },
    {
      id: '3',
      title: 'Scheduling training sessions',
      category: 'training',
      content: 'Guide to scheduling and managing training...',
    },
    // Add more articles as needed
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Help Center"
      size="lg"
    >
      <div className="space-y-6">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {helpCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 text-sm rounded-full border ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Articles */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredArticles.map(article => (
            <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2">{article.title}</h4>
              <p className="text-sm text-gray-600">{article.content}</p>
            </div>
          ))}
          
          {filteredArticles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No help articles found matching your search.
            </div>
          )}
        </div>
      </div>
    </AccessibleModal>
  );
}