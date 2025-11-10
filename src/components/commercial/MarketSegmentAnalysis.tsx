'use client';

import React, { useState, useEffect } from 'react';
import { 
  CommercialOpportunity, 
  OpportunityMetrics, 
  MarketSegment,
  SalesPhase 
} from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';

interface MarketSegmentAnalysisProps {
  className?: string;
}

interface SegmentMetrics {
  segment: MarketSegment;
  totalOpportunities: number;
  totalValue: number;
  averageValue: number;
  conversionRate: number;
  pipelineDistribution: Record<SalesPhase, number>;
  valueDistribution: Record<SalesPhase, number>;
  trends: {
    monthlyOpportunities: Array<{ month: string; count: number; value: number }>;
    quarterlyGrowth: number;
  };
}

export default function MarketSegmentAnalysis({ className = '' }: MarketSegmentAnalysisProps) {
  const [segmentMetrics, setSegmentMetrics] = useState<SegmentMetrics[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<MarketSegment | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '12m'>('6m');

  useEffect(() => {
    loadSegmentAnalysis();
  }, [timeRange]);

  const loadSegmentAnalysis = async () => {
    try {
      setLoading(true);
      const opportunities = await commercialService.getOpportunities();
      const metrics = calculateSegmentMetrics(opportunities);
      setSegmentMetrics(metrics);
    } catch (error) {
      console.error('Error loading segment analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSegmentMetrics = (opportunities: CommercialOpportunity[]): SegmentMetrics[] => {
    const segments = Object.values(MarketSegment);
    
    return segments.map(segment => {
      const segmentOpportunities = opportunities.filter(opp => opp.marketSegment === segment);
      const totalOpportunities = segmentOpportunities.length;
      const totalValue = segmentOpportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0);
      const averageValue = totalValue / totalOpportunities || 0;
      
      const wonOpportunities = segmentOpportunities.filter(opp => opp.salesPhase === SalesPhase.WON);
      const conversionRate = (wonOpportunities.length / totalOpportunities) * 100 || 0;
      
      const pipelineDistribution = segmentOpportunities.reduce((acc, opp) => {
        acc[opp.salesPhase] = (acc[opp.salesPhase] || 0) + 1;
        return acc;
      }, {} as Record<SalesPhase, number>);
      
      const valueDistribution = segmentOpportunities.reduce((acc, opp) => {
        acc[opp.salesPhase] = (acc[opp.salesPhase] || 0) + opp.estimatedValue;
        return acc;
      }, {} as Record<SalesPhase, number>);

      // Generate mock monthly trends
      const monthlyOpportunities = generateMonthlyTrends(segmentOpportunities, timeRange);
      const quarterlyGrowth = calculateQuarterlyGrowth(monthlyOpportunities);

      return {
        segment,
        totalOpportunities,
        totalValue,
        averageValue,
        conversionRate,
        pipelineDistribution,
        valueDistribution,
        trends: {
          monthlyOpportunities,
          quarterlyGrowth
        }
      };
    }).filter(metrics => metrics.totalOpportunities > 0);
  };

  const generateMonthlyTrends = (opportunities: CommercialOpportunity[], range: string) => {
    const months = range === '3m' ? 3 : range === '6m' ? 6 : 12;
    const trends = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      // Mock data based on opportunities
      const count = Math.floor(Math.random() * 10) + 1;
      const value = count * (Math.floor(Math.random() * 100000) + 50000);
      
      trends.push({
        month: monthName,
        count,
        value
      });
    }
    
    return trends;
  };

  const calculateQuarterlyGrowth = (monthlyData: Array<{ month: string; count: number; value: number }>) => {
    if (monthlyData.length < 6) return 0;
    
    const recentQuarter = monthlyData.slice(-3).reduce((sum, month) => sum + month.value, 0);
    const previousQuarter = monthlyData.slice(-6, -3).reduce((sum, month) => sum + month.value, 0);
    
    return previousQuarter > 0 ? ((recentQuarter - previousQuarter) / previousQuarter) * 100 : 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getSegmentColor = (segment: MarketSegment) => {
    const colors = {
      [MarketSegment.HEALTHCARE]: 'bg-red-100 text-red-800 border-red-200',
      [MarketSegment.CANNABIS]: 'bg-green-100 text-green-800 border-green-200',
      [MarketSegment.UNIVERSITY]: 'bg-blue-100 text-blue-800 border-blue-200',
      [MarketSegment.COMMERCIAL_OFFICE]: 'bg-gray-100 text-gray-800 border-gray-200',
      [MarketSegment.MANUFACTURING]: 'bg-orange-100 text-orange-800 border-orange-200',
      [MarketSegment.RETAIL]: 'bg-purple-100 text-purple-800 border-purple-200',
      [MarketSegment.HOSPITALITY]: 'bg-pink-100 text-pink-800 border-pink-200',
      [MarketSegment.DATA_CENTER]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      [MarketSegment.OTHER]: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[segment] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const renderSegmentCard = (metrics: SegmentMetrics) => {
    const isSelected = selectedSegment === metrics.segment;
    
    return (
      <div
        key={metrics.segment}
        className={`bg-white rounded-lg shadow border-2 cursor-pointer transition-all ${
          isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => setSelectedSegment(isSelected ? null : metrics.segment)}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${getSegmentColor(metrics.segment)}`}>
              {metrics.segment}
            </h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {metrics.totalOpportunities}
              </div>
              <div className="text-sm text-gray-600">Opportunities</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(metrics.totalValue)}
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-blue-600">
                {formatCurrency(metrics.averageValue)}
              </div>
              <div className="text-sm text-gray-600">Avg Deal Size</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-purple-600">
                {metrics.conversionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
            <div className={`text-sm font-medium ${
              metrics.trends.quarterlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.trends.quarterlyGrowth >= 0 ? '↗' : '↘'} {Math.abs(metrics.trends.quarterlyGrowth).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSegmentDetails = () => {
    if (!selectedSegment) {
      return (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Market Segment</h3>
            <p className="text-gray-600">Click on a segment card above to view detailed analysis</p>
          </div>
        </div>
      );
    }

    const metrics = segmentMetrics.find(m => m.segment === selectedSegment);
    if (!metrics) return null;

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{selectedSegment} Analysis</h2>
            <button
              onClick={() => setSelectedSegment(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Pipeline Distribution */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Distribution</h3>
            <div className="space-y-3">
              {Object.entries(metrics.pipelineDistribution).map(([phase, count]) => {
                const percentage = (count / metrics.totalOpportunities) * 100;
                const value = metrics.valueDistribution[phase as SalesPhase] || 0;
                
                return (
                  <div key={phase} className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <span className="text-sm font-medium text-gray-700 w-32">{phase}</span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{count} opportunities</div>
                        <div className="text-xs text-gray-600">{formatCurrency(value)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trends */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trends ({timeRange})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Monthly Opportunities</h4>
                <div className="space-y-2">
                  {metrics.trends.monthlyOpportunities.map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{month.month}</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ 
                              width: `${(month.count / Math.max(...metrics.trends.monthlyOpportunities.map(m => m.count))) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">{month.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Monthly Value</h4>
                <div className="space-y-2">
                  {metrics.trends.monthlyOpportunities.map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{month.month}</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ 
                              width: `${(month.value / Math.max(...metrics.trends.monthlyOpportunities.map(m => m.value))) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-900">
                          {formatCurrency(month.value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          Market Segment Analysis
        </h1>
        <div className="flex space-x-2">
          {(['3m', '6m', '12m'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === '3m' ? '3 Months' : range === '6m' ? '6 Months' : '12 Months'}
            </button>
          ))}
        </div>
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {segmentMetrics.map(metrics => renderSegmentCard(metrics))}
      </div>

      {/* Detailed Analysis */}
      {renderSegmentDetails()}
    </div>
  );
}