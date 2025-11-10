'use client';

import React, { useState, useEffect } from 'react';
import { Organization, OrganizationType, CommercialOpportunity, EngineerContact } from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';

interface ConsolidatedData {
  organization: Organization;
  children: Organization[];
  totalContacts: number;
  totalOpportunities: number;
  totalOpportunityValue: number;
  activeContacts: number;
  recentOpportunities: CommercialOpportunity[];
  topContacts: EngineerContact[];
  historicalRelationships: HistoricalRelationship[];
}

interface HistoricalRelationship {
  id: string;
  organizationId: string;
  organizationName: string;
  relationshipType: 'parent' | 'child' | 'sibling';
  startDate: Date;
  endDate?: Date;
  reason?: string;
}

interface ConsolidatedReportingViewProps {
  organizationId?: string;
  organizationType?: OrganizationType;
  className?: string;
}

export default function ConsolidatedReportingView({ 
  organizationId, 
  organizationType,
  className = '' 
}: ConsolidatedReportingViewProps) {
  const [consolidatedData, setConsolidatedData] = useState<ConsolidatedData[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<ConsolidatedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'contacts' | 'opportunities'>('name');
  const [filterActive, setFilterActive] = useState(true);

  useEffect(() => {
    loadConsolidatedData();
  }, [organizationId, organizationType, filterActive]);

  const loadConsolidatedData = async () => {
    try {
      setLoading(true);
      const organizations = await commercialService.getOrganizations(organizationType);
      const opportunities = await commercialService.getOpportunities();
      const engineers = await commercialService.getEngineers();

      // Filter organizations based on criteria
      let filteredOrgs = organizations;
      if (organizationId) {
        filteredOrgs = organizations.filter(org => 
          org.id === organizationId || org.parentId === organizationId
        );
      }
      if (filterActive) {
        filteredOrgs = filteredOrgs.filter(org => org.isActive);
      }

      // Get parent organizations (those without parents or with specified parent)
      const parentOrgs = filteredOrgs.filter(org => 
        !org.parentId || org.parentId === organizationId
      );

      const consolidated = await Promise.all(
        parentOrgs.map(async (org) => {
          const children = organizations.filter(child => child.parentId === org.id);
          const allOrgIds = [org.id, ...children.map(c => c.id)];
          
          // Get contacts for this organization and its children
          const orgContacts = engineers.filter(eng => 
            allOrgIds.includes(eng.engineeringFirmId)
          );
          
          // Get opportunities for this organization and its children
          const orgOpportunities = opportunities.filter(opp => 
            allOrgIds.includes(opp.engineeringFirmId)
          );

          const totalOpportunityValue = orgOpportunities.reduce(
            (sum, opp) => sum + opp.estimatedValue, 0
          );

          const activeContacts = orgContacts.filter(contact => 
            contact.lastContactDate && 
            contact.lastContactDate > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          ).length;

          const recentOpportunities = orgOpportunities
            .filter(opp => opp.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 5);

          const topContacts = orgContacts
            .sort((a, b) => b.totalOpportunityValue - a.totalOpportunityValue)
            .slice(0, 5);

          // Generate mock historical relationships
          const historicalRelationships = generateMockHistoricalRelationships(org.id);

          return {
            organization: org,
            children,
            totalContacts: orgContacts.length,
            totalOpportunities: orgOpportunities.length,
            totalOpportunityValue,
            activeContacts,
            recentOpportunities,
            topContacts,
            historicalRelationships
          };
        })
      );

      // Sort consolidated data
      const sorted = consolidated.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.organization.name.localeCompare(b.organization.name);
          case 'value':
            return b.totalOpportunityValue - a.totalOpportunityValue;
          case 'contacts':
            return b.totalContacts - a.totalContacts;
          case 'opportunities':
            return b.totalOpportunities - a.totalOpportunities;
          default:
            return 0;
        }
      });

      setConsolidatedData(sorted);
    } catch (error) {
      console.error('Error loading consolidated data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockHistoricalRelationships = (orgId: string): HistoricalRelationship[] => {
    // Mock historical relationship data
    return [
      {
        id: `hist_${orgId}_1`,
        organizationId: `parent_${orgId}`,
        organizationName: 'Former Parent Company',
        relationshipType: 'parent',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2022-06-30'),
        reason: 'Corporate restructuring'
      },
      {
        id: `hist_${orgId}_2`,
        organizationId: `child_${orgId}`,
        organizationName: 'Acquired Division',
        relationshipType: 'child',
        startDate: new Date('2021-03-15'),
        reason: 'Acquisition'
      }
    ];
  };

  const getOrganizationIcon = (type: OrganizationType) => {
    const icons = {
      [OrganizationType.ENGINEERING_FIRM]: '🏗️',
      [OrganizationType.MANUFACTURER_REP]: '🏢',
      [OrganizationType.BUILDING_OWNER]: '🏛️',
      [OrganizationType.ARCHITECT]: '📐',
      [OrganizationType.MECHANICAL_CONTRACTOR]: '🔧',
      [OrganizationType.FACILITIES_MANAGER]: '🏭'
    };
    return icons[type] || '🏢';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderSummaryCard = (data: ConsolidatedData) => {
    return (
      <div
        key={data.organization.id}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setSelectedOrganization(data)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{getOrganizationIcon(data.organization.type)}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{data.organization.name}</h3>
              <p className="text-sm text-gray-600">{data.organization.type}</p>
            </div>
          </div>
          {data.children.length > 0 && (
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {data.children.length} {data.children.length === 1 ? 'Division' : 'Divisions'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{data.totalContacts}</div>
            <div className="text-xs text-gray-500">Total Contacts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{data.activeContacts}</div>
            <div className="text-xs text-gray-500">Active Contacts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{data.totalOpportunities}</div>
            <div className="text-xs text-gray-500">Opportunities</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{formatCurrency(data.totalOpportunityValue)}</div>
            <div className="text-xs text-gray-500">Total Value</div>
          </div>
        </div>

        {data.recentOpportunities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600 mb-2">Recent Opportunities:</div>
            <div className="space-y-1">
              {data.recentOpportunities.slice(0, 2).map(opp => (
                <div key={opp.id} className="text-xs text-gray-500 truncate">
                  {opp.jobSiteName} - {formatCurrency(opp.estimatedValue)}
                </div>
              ))}
              {data.recentOpportunities.length > 2 && (
                <div className="text-xs text-gray-400">
                  +{data.recentOpportunities.length - 2} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDetailedView = () => {
    if (!selectedOrganization) return null;

    const data = selectedOrganization;

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-3xl mr-4">{getOrganizationIcon(data.organization.type)}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{data.organization.name}</h2>
                <p className="text-gray-600">{data.organization.type}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedOrganization(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Organization Hierarchy */}
          {data.children.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Structure</h3>
              <div className="space-y-2">
                {data.children.map(child => (
                  <div key={child.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-lg mr-3">{getOrganizationIcon(child.type)}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{child.name}</div>
                      <div className="text-sm text-gray-600">{child.type}</div>
                    </div>
                    <div className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      child.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {child.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Metrics */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Consolidated Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{data.totalContacts}</div>
                <div className="text-sm text-blue-800">Total Contacts</div>
                <div className="text-xs text-blue-600 mt-1">
                  {data.activeContacts} active in last 90 days
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{data.totalOpportunities}</div>
                <div className="text-sm text-green-800">Total Opportunities</div>
                <div className="text-xs text-green-600 mt-1">
                  {data.recentOpportunities.length} in last 30 days
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(data.totalOpportunityValue)}</div>
                <div className="text-sm text-purple-800">Total Pipeline Value</div>
                <div className="text-xs text-purple-600 mt-1">
                  Avg: {formatCurrency(data.totalOpportunityValue / Math.max(data.totalOpportunities, 1))}
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">
                  {Math.round((data.activeContacts / Math.max(data.totalContacts, 1)) * 100)}%
                </div>
                <div className="text-sm text-orange-800">Engagement Rate</div>
                <div className="text-xs text-orange-600 mt-1">
                  Active contacts ratio
                </div>
              </div>
            </div>
          </div>

          {/* Top Contacts */}
          {data.topContacts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contacts by Value</h3>
              <div className="space-y-3">
                {data.topContacts.map(contact => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">
                        {contact.personalInfo.firstName} {contact.personalInfo.lastName}
                      </div>
                      <div className="text-sm text-gray-600">{contact.personalInfo.title}</div>
                      <div className="text-xs text-gray-500">{contact.personalInfo.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(contact.totalOpportunityValue)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Rating: {contact.rating}/5
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Opportunities */}
          {data.recentOpportunities.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Opportunities</h3>
              <div className="space-y-3">
                {data.recentOpportunities.map(opp => (
                  <div key={opp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{opp.jobSiteName}</div>
                      <div className="text-sm text-gray-600">{opp.description}</div>
                      <div className="text-xs text-gray-500">
                        {opp.marketSegment} • {opp.salesPhase}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(opp.estimatedValue)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {opp.probability}% probability
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historical Relationships */}
          {data.historicalRelationships.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Relationships</h3>
              <div className="space-y-3">
                {data.historicalRelationships.map(rel => (
                  <div key={rel.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{rel.organizationName}</div>
                      <div className="text-sm text-gray-600 capitalize">{rel.relationshipType} relationship</div>
                      {rel.reason && (
                        <div className="text-xs text-gray-500">Reason: {rel.reason}</div>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div>{rel.startDate.toLocaleDateString()}</div>
                      {rel.endDate && (
                        <div>to {rel.endDate.toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
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
    <div className={className}>
      {!selectedOrganization ? (
        <>
          {/* Header and Controls */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Consolidated Organization Reports</h1>
                <p className="text-gray-600 mt-1">
                  Parent organization rollup with consolidated metrics and relationships
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filterActive}
                    onChange={(e) => setFilterActive(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Active only</span>
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="value">Sort by Value</option>
                  <option value="contacts">Sort by Contacts</option>
                  <option value="opportunities">Sort by Opportunities</option>
                </select>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consolidatedData.map(data => renderSummaryCard(data))}
          </div>

          {consolidatedData.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No organizations found matching the current filters
            </div>
          )}
        </>
      ) : (
        renderDetailedView()
      )}
    </div>
  );
}