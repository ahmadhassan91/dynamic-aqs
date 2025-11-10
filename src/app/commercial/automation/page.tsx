'use client';

import React, { useState } from 'react';
import TaskGenerator from '@/components/commercial/TaskGenerator';
import WorkflowManagementSystem from '@/components/commercial/WorkflowManagementSystem';

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'workflows'>('tasks');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Commercial Automation</h1>
          <p className="mt-2 text-gray-600">
            Automated task generation and workflow management for commercial processes
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Task Generation
            </button>
            <button
              onClick={() => setActiveTab('workflows')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'workflows'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Workflow Management
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'tasks' && <TaskGenerator />}
        {activeTab === 'workflows' && <WorkflowManagementSystem />}
      </div>
    </div>
  );
}