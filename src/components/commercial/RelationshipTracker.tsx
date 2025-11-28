'use client';

import React, { useState, useEffect } from 'react';
import { 
  EngineerContact, 
  CommercialOpportunity,
  Interaction,
  EngineerRating 
} from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';

interface RelationshipTrackerProps {
  engineer: EngineerContact;
  className?: string;
}

interface RelationshipMetrics {
  totalInteractions: number;
  recentInteractions: Interaction[];
  opportunityCount: number;
  totalOpportunityValue: number;
  wonOpportunityValue: number;
  conversionRate: number;
  averageInteractionFrequency: number; // days between interactions
  relationshipTrend: 'improving' | 'stable' | 'declining';
  nextSuggestedAction: string;
  ratingHistory: Array<{
    date: Date;
    rating: EngineerRating;
    reason: string;
  }>;
}

export default function RelationshipTracker({ engineer, className = '' }: RelationshipTrackerProps) {
  const [metrics, setMetrics] = useState<RelationshipMetrics | null>(null);
  const [opportunities, setOpportunities] = useState<CommercialOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'3m' | '6m' | '12m'>('6m');

  useEffect(() => {
    loadRelationshipData();
  }, [engineer.id, selectedTimeRange]);

  const loadRelationshipData = async () => {
    try {
      setLoading(true);
      
      // Load opportunities for this engineer
      const allOpportunities = await commercialService.getOpportunities();
      const engineerOpportunities = allOpportunities.filter(opp => 
        opp.engineeringFirmId === engineer.engineeringFirmId
      );
      setOpportunities(engineerOpportunities);

      // Calculate metrics
      const calculatedMetrics = calculateRelationshipMetrics(engineer, engineerOpportunities);
      setMetrics(calculatedMetrics);
    } catch (error) {
      console.error('Error loading relationship data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRelationshipMetrics = (
    engineer: EngineerContact, 
    opportunities: CommercialOpportunity[]
  ): RelationshipMetrics => {
    const now = new Date();
    const timeRangeMonths = selectedTimeRange === '3m' ? 3 : selectedTimeRange === '6m' ? 6 : 12;
    const cutoffDate = new Date(now.getTime() - (timeRangeMonths * 30 * 24 * 60 * 60 * 1000));

    // Filter recent interactions
    const recentInteractions = engineer.interactions.filter(
      interaction => new Date(interaction.date) >= cutoffDate
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate opportunity metrics
    const engineerOpportunities = opportunities.filter(opp => 
      engineer.opportunities.includes(opp.id)
    );
    const wonOpportunities = engineerOpportunities.filter(opp => opp.salesPhase === 'Won');
    const conversionRate = engineerOpportunities.length > 0 
      ? (wonOpportunities.length / engineerOpportunities.length) * 100 
      : 0;

    // Calculate interaction frequency
    let averageInteractionFrequency = 0;
    if (recentInteractions.length > 1) {
      const intervals = [];
      for (let i = 0; i < recentInteractions.length - 1; i++) {
        const current = new Date(recentInteractions[i].date);
        const next = new Date(recentInteractions[i + 1].date);
        intervals.push((current.getTime() - next.getTime()) / (24 * 60 * 60 * 1000));
      }
      averageInteractionFrequency = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    }

    // Determine relationship trend
    let relationshipTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (engineer.ratingHistory.length >= 2) {
      const recentRatingChanges = engineer.ratingHistory
        .filter(change => new Date(change.changedAt) >= cutoffDate)
        .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());
      
      if (recentRatingChanges.length > 0) {
        const latestChange = recentRatingChanges[0];
        if (latestChange.newRating > latestChange.previousRating) {
          relationshipTrend = 'improving';
        } else if (latestChange.newRating < latestChange.previousRating) {
          relationshipTrend = 'declining';
        }
      }
    }

    // Suggest next action
    let nextSuggestedAction = 'Schedule regular check-in';
    const daysSinceLastContact = engineer.lastContactDate 
      ? Math.floor((now.getTime() - new Date(engineer.lastContactDate).getTime()) / (24 * 60 * 60 * 1000))
      : 999;

    if (daysSinceLastContact > 90) {
      nextSuggestedAction = 'Urgent: Re-establish contact - no interaction in 3+ months';
    } else if (daysSinceLastContact > 60) {
      nextSuggestedAction = 'Schedule lunch & learn or site visit';
    } else if (engineer.rating < EngineerRating.FAVORABLE) {
      nextSuggestedAction = 'Focus on relationship building activities';
    } else if (engineer.rating === EngineerRating.CHAMPION && engineerOpportunities.length === 0) {
      nextSuggestedAction = 'Explore new project opportunities';
    }

    return {
      totalInteractions: engineer.interactions.length,
      recentInteractions: recentInteractions.slice(0, 10), // Last 10 interactions
      opportunityCount: engineerOpportunities.length,
      totalOpportunityValue: engineer.totalOpportunityValue,
      wonOpportunityValue: engineer.wonOpportunityValue,
      conversionRate,
      averageInteractionFrequency,
      relationshipTrend,
      nextSuggestedAction,
      ratingHistory: engineer.ratingHistory.map(change => ({
        date: new Date(change.changedAt),
        rating: change.newRating,
        reason: change.reason
      })).sort((a, b) => b.date.getTime() - a.date.getTime())
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRatingColor = (rating: EngineerRating) => {
    const colors: Record<number, string> = {
      [EngineerRating.HOSTILE]: 'text-red-600',
      [EngineerRating.UNFAVORABLE]: 'text-orange-600',
      [EngineerRating.NEUTRAL]: 'text-gray-600',
      [EngineerRating.FAVORABLE]: 'text-blue-600',
      [EngineerRating.CHAMPION]: 'text-green-600',
      [EngineerRating.LEVEL_6]: 'text-teal-600',
      [EngineerRating.LEVEL_7]: 'text-cyan-600',
      [EngineerRating.LEVEL_8]: 'text-indigo-600',
      [EngineerRating.LEVEL_9]: 'text-purple-600',
      [EngineerRating.LEVEL_10]: 'text-emerald-600'
    };
    return colors[rating] || 'text-gray-600';
  };

  const getTrendIcon = (trend: 'improving' | 'stable' | 'declining') => {
    const icons = {
      improving: { icon: '📈', color: 'text-green-600', bg: 'bg-green-100' },
      stable: { icon: '➡️', color: 'text-gray-600', bg: 'bg-gray-100' },
      declining: { icon: '📉', color: 'text-red-600', bg: 'bg-red-100' }
    };
    return icons[trend];
  };

  const getInteractionIcon = (type: string) => {
    const icons: Record<string, string> = {
      'Phone Call': '📞',
      'Email': '📧',
      'Meeting': '🤝',
      'Lunch and Learn': '🍽️',
      'Site Visit': '🏗️',
      'Trade Show': '🏢',
      'Webinar': '💻'
    };
    return icons[type] || '💬';
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center text-gray-500">
          Unable to load relationship data
        </div>
      </div>
    );
  }

  const trendInfo = getTrendIcon(metrics.relationshipTrend);

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Relationship Tracker</h2>
          <p className="text-sm text-gray-600">
            {engineer.personalInfo.firstName} {engineer.personalInfo.lastName} - {engineer.engineeringFirmId}
          </p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          {(['3m', '6m', '12m'] as const).map(range => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                selectedTimeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === '3m' ? '3M' : range === '6m' ? '6M' : '12M'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.recentInteractions.length}
              </div>
              <div className="text-sm text-gray-600">Recent Interactions</div>
            </div>
            <div className="text-2xl">💬</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {metrics.opportunityCount}
              </div>
              <div className="text-sm text-gray-600">Opportunities</div>
            </div>
            <div className="text-2xl">💼</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {metrics.conversionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
            <div className="text-2xl">🎯</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-2xl font-bold ${trendInfo.color}`}>
                {metrics.relationshipTrend}
              </div>
              <div className="text-sm text-gray-600">Trend</div>
            </div>
            <div className="text-2xl">{trendInfo.icon}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interaction History */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Interactions</h3>
          </div>
          <div className="p-6">
            {metrics.recentInteractions.length > 0 ? (
              <div className="space-y-4">
                {metrics.recentInteractions.map((interaction, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg">{getInteractionIcon(interaction.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{interaction.type}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(interaction.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{interaction.description}</p>
                      {interaction.outcome && (
                        <p className="text-xs text-blue-600 mt-1">Outcome: {interaction.outcome}</p>
                      )}
                      {interaction.followUpRequired && (
                        <div className="flex items-center mt-2">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                            Follow-up Required
                          </span>
                          {interaction.followUpDate && (
                            <span className="ml-2 text-xs text-gray-500">
                              by {new Date(interaction.followUpDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">📝</div>
                <p>No recent interactions recorded</p>
              </div>
            )}
          </div>
        </div>

        {/* Rating History & Insights */}
        <div className="space-y-6">
          {/* Rating History */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Rating History</h3>
            </div>
            <div className="p-6">
              {metrics.ratingHistory.length > 0 ? (
                <div className="space-y-3">
                  {metrics.ratingHistory.slice(0, 5).map((change, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className={`text-sm font-medium ${getRatingColor(change.rating)}`}>
                          Rating: {change.rating}★
                        </div>
                        <div className="text-xs text-gray-500">{change.reason}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {change.date.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <p>No rating changes recorded</p>
                </div>
              )}
            </div>
          </div>

          {/* Next Suggested Action */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recommended Action</h3>
            </div>
            <div className="p-6">
              <div className={`p-4 rounded-lg ${trendInfo.bg}`}>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{trendInfo.icon}</div>
                  <div>
                    <h4 className={`font-medium ${trendInfo.color}`}>
                      Relationship is {metrics.relationshipTrend}
                    </h4>
                    <p className="text-sm text-gray-700 mt-1">
                      {metrics.nextSuggestedAction}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Insights */}
              <div className="mt-4 space-y-2">
                <div className="text-sm text-gray-600">
                  <strong>Interaction Frequency:</strong> {' '}
                  {metrics.averageInteractionFrequency > 0 
                    ? `Every ${Math.round(metrics.averageInteractionFrequency)} days`
                    : 'Insufficient data'
                  }
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Total Pipeline Value:</strong> {formatCurrency(metrics.totalOpportunityValue)}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Won Value:</strong> {formatCurrency(metrics.wonOpportunityValue)}
                </div>
                {engineer.nextFollowUpDate && (
                  <div className="text-sm text-orange-600 font-medium">
                    <strong>Next Follow-up:</strong> {engineer.nextFollowUpDate.toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}