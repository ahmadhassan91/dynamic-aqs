'use client';

import React from 'react';
import WorkflowManagementSystem from '@/components/commercial/WorkflowManagementSystem';

export default function WorkflowPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Commercial Workflow Management</h1>
          <p className="mt-2 text-gray-600">
            Design, configure, and monitor automated workflows for commercial processes
          </p>
        </div>
        
        <WorkflowManagementSystem />
      </div>
    </div>
  );
}