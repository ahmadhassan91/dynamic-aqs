'use client';

import { useState } from 'react';

interface DashboardCustomizerProps {
  widgets: string[];
  onWidgetReorder: (widgets: string[]) => void;
  onClose: () => void;
}

interface WidgetConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export function DashboardCustomizer({ widgets, onWidgetReorder, onClose }: DashboardCustomizerProps) {
  const [availableWidgets, setAvailableWidgets] = useState<WidgetConfig[]>([
    {
      id: 'revenue',
      name: 'Revenue Metrics',
      description: 'Total revenue and growth trends',
      icon: '💰',
      enabled: widgets.includes('revenue')
    },
    {
      id: 'customers',
      name: 'Customer Metrics',
      description: 'Active customers and acquisition rates',
      icon: '👥',
      enabled: widgets.includes('customers')
    },
    {
      id: 'leads',
      name: 'Lead Conversion',
      description: 'Lead pipeline and conversion rates',
      icon: '🎯',
      enabled: widgets.includes('leads')
    },
    {
      id: 'training',
      name: 'Training Completion',
      description: 'Training sessions and completion rates',
      icon: '🎓',
      enabled: widgets.includes('training')
    },
    {
      id: 'orders',
      name: 'Order Fulfillment',
      description: 'Order processing and delivery metrics',
      icon: '📦',
      enabled: widgets.includes('orders')
    },
    {
      id: 'performance',
      name: 'Performance Metrics',
      description: 'Overall business performance indicators',
      icon: '📊',
      enabled: widgets.includes('performance')
    },
    {
      id: 'territories',
      name: 'Territory Performance',
      description: 'Performance by territory and region',
      icon: '🗺️',
      enabled: widgets.includes('territories')
    },
    {
      id: 'dealers',
      name: 'Dealer Analytics',
      description: 'Dealer engagement and ordering patterns',
      icon: '🏪',
      enabled: widgets.includes('dealers')
    }
  ]);

  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const handleWidgetToggle = (widgetId: string) => {
    const updatedWidgets = availableWidgets.map(widget =>
      widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget
    );
    setAvailableWidgets(updatedWidgets);

    const enabledWidgets = updatedWidgets
      .filter(widget => widget.enabled)
      .map(widget => widget.id);
    
    onWidgetReorder(enabledWidgets);
  };

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetWidgetId: string) => {
    e.preventDefault();
    
    if (!draggedWidget || draggedWidget === targetWidgetId) return;

    const enabledWidgets = availableWidgets.filter(w => w.enabled).map(w => w.id);
    const draggedIndex = enabledWidgets.indexOf(draggedWidget);
    const targetIndex = enabledWidgets.indexOf(targetWidgetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrder = [...enabledWidgets];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedWidget);

    onWidgetReorder(newOrder);
    setDraggedWidget(null);
  };

  const handleSaveLayout = () => {
    // Mock save functionality
    const layout = {
      widgets: availableWidgets.filter(w => w.enabled).map(w => w.id),
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('dashboard-layout', JSON.stringify(layout));
    alert('Dashboard layout saved successfully!');
  };

  const handleResetLayout = () => {
    const defaultWidgets = ['revenue', 'customers', 'leads', 'training', 'orders', 'performance'];
    const resetWidgets = availableWidgets.map(widget => ({
      ...widget,
      enabled: defaultWidgets.includes(widget.id)
    }));
    
    setAvailableWidgets(resetWidgets);
    onWidgetReorder(defaultWidgets);
  };

  const enabledWidgets = availableWidgets.filter(w => w.enabled);
  const disabledWidgets = availableWidgets.filter(w => !w.enabled);

  return (
    <div className="bg-white rounded-lg shadow-lg border p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Customize Dashboard</h3>
        <div className="flex space-x-3">
          <button
            onClick={handleSaveLayout}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
          >
            Save Layout
          </button>
          <button
            onClick={handleResetLayout}
            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enabled Widgets */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Active Widgets</h4>
          <div className="space-y-2 min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-3">
            {enabledWidgets.map((widget, index) => (
              <div
                key={widget.id}
                draggable
                onDragStart={(e) => handleDragStart(e, widget.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, widget.id)}
                className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-move hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{widget.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{widget.name}</div>
                    <div className="text-sm text-gray-600">{widget.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                  <button
                    onClick={() => handleWidgetToggle(widget.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
              </div>
            ))}
            {enabledWidgets.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No widgets selected. Add widgets from the available list.
              </div>
            )}
          </div>
        </div>

        {/* Available Widgets */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Available Widgets</h4>
          <div className="space-y-2 min-h-[200px]">
            {disabledWidgets.map((widget) => (
              <div
                key={widget.id}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{widget.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{widget.name}</div>
                    <div className="text-sm text-gray-600">{widget.description}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleWidgetToggle(widget.id)}
                  className="text-green-600 hover:text-green-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            ))}
            {disabledWidgets.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                All available widgets are currently active.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2">Customization Instructions</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Drag and drop widgets in the Active Widgets section to reorder them</li>
          <li>• Click the + button to add widgets from the Available Widgets section</li>
          <li>• Click the trash button to remove widgets from your dashboard</li>
          <li>• Use Save Layout to persist your changes</li>
          <li>• Use Reset to return to the default layout</li>
        </ul>
      </div>
    </div>
  );
}