'use client';

import React from 'react';
import TaskGenerator from '@/components/commercial/TaskGenerator';

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Commercial Task Automation</h1>
          <p className="mt-2 text-gray-600">
            AI-generated tasks to improve engineer relationships and drive opportunity development
          </p>
        </div>
        
        <TaskGenerator />
      </div>
    </div>
  );
}