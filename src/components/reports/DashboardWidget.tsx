'use client';

import { useState } from 'react';

interface DashboardWidgetProps {
  type: 'metric' | 'line-chart' | 'pie-chart' | 'bar-chart' | 'metric-grid';
  title: string;
  data: any;
  isCustomizing?: boolean;
}

export function DashboardWidget({ type, title, data, isCustomizing }: DashboardWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderMetric = (metric: any) => {
    const IconComponent = metric.icon;
    return (
      <div className="text-center">
        <div className="text-3xl mb-2 flex justify-center">
          {typeof metric.icon === 'string' ? (
            <span>{metric.icon}</span>
          ) : IconComponent ? (
            <IconComponent size={32} color={metric.color} />
          ) : null}
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
        <div className="text-sm text-gray-600 mb-2">{metric.title}</div>
        <div className={`flex items-center justify-center text-sm ${
          metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
        }`}>
          <span className="mr-1">
            {metric.changeType === 'increase' ? '↗️' : '↘️'}
          </span>
          {Math.abs(metric.change)}%
        </div>
      </div>
    );
  };

  const renderLineChart = (data: any[]) => (
    <div className="h-64">
      <svg viewBox="0 0 400 200" className="w-full h-full">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1="40"
            y1={40 + i * 32}
            x2="380"
            y2={40 + i * 32}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}
        
        {/* Chart line */}
        <polyline
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          points={data.map((item, index) => 
            `${40 + (index * 28)},${180 - (item.value / Math.max(...data.map(d => d.value)) * 140)}`
          ).join(' ')}
        />
        
        {/* Data points */}
        {data.map((item, index) => (
          <circle
            key={index}
            cx={40 + (index * 28)}
            cy={180 - (item.value / Math.max(...data.map(d => d.value)) * 140)}
            r="3"
            fill="#3B82F6"
          />
        ))}
        
        {/* X-axis labels */}
        {data.map((item, index) => (
          <text
            key={index}
            x={40 + (index * 28)}
            y="195"
            textAnchor="middle"
            fontSize="10"
            fill="#6B7280"
          >
            {item.name}
          </text>
        ))}
      </svg>
    </div>
  );

  const renderPieChart = (data: any[]) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="flex items-center">
        <div className="w-48 h-48">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {data.map((item, index) => {
              const percentage = item.value / total;
              const angle = percentage * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              
              const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 100 100`,
                `L ${x1} ${y1}`,
                `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              currentAngle += angle;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color || `hsl(${index * 60}, 70%, 50%)`}
                />
              );
            })}
          </svg>
        </div>
        <div className="ml-6 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color || `hsl(${index * 60}, 70%, 50%)` }}
              />
              <span className="text-sm text-gray-700">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBarChart = (data: any[]) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="h-64">
        <svg viewBox="0 0 400 200" className="w-full h-full">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="40"
              y1={40 + i * 32}
              x2="380"
              y2={40 + i * 32}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}
          
          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * 140;
            const barWidth = 60;
            const x = 60 + index * 80;
            const y = 180 - barHeight;
            
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={item.color || '#3B82F6'}
                  rx="4"
                />
                <text
                  x={x + barWidth / 2}
                  y="195"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6B7280"
                >
                  {item.name}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#374151"
                >
                  {item.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderMetricGrid = (metrics: any[]) => (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-1 flex justify-center">
              {typeof metric.icon === 'string' ? (
                <span>{metric.icon}</span>
              ) : IconComponent ? (
                <IconComponent size={24} color={metric.color} />
              ) : null}
            </div>
            <div className="text-xl font-bold text-gray-900">{metric.value}</div>
            <div className="text-xs text-gray-600">{metric.title}</div>
          </div>
        );
      })}
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'metric':
        return renderMetric(data);
      case 'line-chart':
        return renderLineChart(data);
      case 'pie-chart':
        return renderPieChart(data);
      case 'bar-chart':
        return renderBarChart(data);
      case 'metric-grid':
        return renderMetricGrid(data);
      default:
        return <div>Unsupported widget type</div>;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${isCustomizing ? 'ring-2 ring-blue-300' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex space-x-2">
          {isCustomizing && (
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className={`w-4 h-4 transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className={isExpanded ? 'block' : 'block'}>
        {renderContent()}
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <button className="text-blue-600 hover:text-blue-800">View Details</button>
          </div>
        </div>
      )}
    </div>
  );
}