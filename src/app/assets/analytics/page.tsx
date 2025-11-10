'use client';

import React, { useState } from 'react';
import { AssetAnalyticsDashboard } from '@/components/assets/AssetAnalyticsDashboard';

export default function AssetAnalyticsPage() {
  const [showDashboard, setShowDashboard] = useState(true);

  if (!showDashboard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Asset Analytics</h1>
          <button
            onClick={() => setShowDashboard(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Open Analytics Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <AssetAnalyticsDashboard
      onClose={() => setShowDashboard(false)}
    />
  );
}