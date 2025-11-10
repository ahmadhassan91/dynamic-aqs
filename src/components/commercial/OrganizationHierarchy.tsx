'use client';

import React, { useState, useEffect } from 'react';
import { Organization, OrganizationType } from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';

interface OrganizationHierarchyProps {
  className?: string;
  organizationType?: OrganizationType;
  onOrganizationSelect?: (organization: Organization) => void;
}

interface HierarchyNode extends Organization {
  children: HierarchyNode[];
  level: number;
  isExpanded: boolean;
}

export default function OrganizationHierarchy({ 
  className = '', 
  organizationType,
  onOrganizationSelect 
}: OrganizationHierarchyProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [hierarchyTree, setHierarchyTree] = useState<HierarchyNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadOrganizations();
  }, [organizationType]);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const data = await commercialService.getOrganizations(organizationType);
      setOrganizations(data);
      buildHierarchyTree(data);
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildHierarchyTree = (orgs: Organization[]) => {
    const orgMap = new Map<string, HierarchyNode>();
    const rootNodes: HierarchyNode[] = [];

    // Create nodes
    orgs.forEach(org => {
      orgMap.set(org.id, {
        ...org,
        children: [],
        level: 0,
        isExpanded: expandedNodes.has(org.id)
      });
    });

    // Build hierarchy
    orgs.forEach(org => {
      const node = orgMap.get(org.id)!;
      if (org.parentId && orgMap.has(org.parentId)) {
        const parent = orgMap.get(org.parentId)!;
        parent.children.push(node);
        node.level = parent.level + 1;
      } else {
        rootNodes.push(node);
      }
    });

    setHierarchyTree(rootNodes);
  };

  const toggleExpansion = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
    
    // Update hierarchy tree with new expansion state
    buildHierarchyTree(organizations);
  };

  const handleOrganizationClick = (organization: Organization) => {
    setSelectedOrganization(organization);
    onOrganizationSelect?.(organization);
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

  const renderHierarchyNode = (node: HierarchyNode) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedOrganization?.id === node.id;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center py-2 px-3 rounded-lg cursor-pointer transition-colors ${
            isSelected 
              ? 'bg-blue-100 border-blue-300 border' 
              : 'hover:bg-gray-50'
          }`}
          style={{ marginLeft: `${node.level * 24}px` }}
          onClick={() => handleOrganizationClick(node)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpansion(node.id);
              }}
              className="mr-2 p-1 hover:bg-gray-200 rounded"
            >
              <svg
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          {!hasChildren && <div className="w-6 mr-2"></div>}
          
          <span className="mr-2 text-lg">{getOrganizationIcon(node.type)}</span>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {node.name}
                </h3>
                <p className="text-xs text-gray-500">{node.type}</p>
              </div>
              <div className="flex items-center space-x-2">
                {!node.isActive && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    Inactive
                  </span>
                )}
                {hasChildren && (
                  <span className="text-xs text-gray-400">
                    {node.children.length} {node.children.length === 1 ? 'child' : 'children'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {node.children.map(child => renderHierarchyNode(child))}
          </div>
        )}
      </div>
    );
  };

  const renderOrganizationDetails = () => {
    if (!selectedOrganization) {
      return (
        <div className="p-6 text-center text-gray-500">
          Select an organization to view details
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="flex items-center mb-4">
          <span className="mr-3 text-2xl">{getOrganizationIcon(selectedOrganization.type)}</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selectedOrganization.name}</h2>
            <p className="text-sm text-gray-600">{selectedOrganization.type}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-500">Contact:</span>
                <p className="text-sm text-gray-900">
                  {selectedOrganization.contactInfo.firstName} {selectedOrganization.contactInfo.lastName}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="text-sm text-gray-900">{selectedOrganization.contactInfo.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Phone:</span>
                <p className="text-sm text-gray-900">{selectedOrganization.contactInfo.phone}</p>
              </div>
              {selectedOrganization.contactInfo.title && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Title:</span>
                  <p className="text-sm text-gray-900">{selectedOrganization.contactInfo.title}</p>
                </div>
              )}
            </div>
          </div>

          {selectedOrganization.contactInfo.address && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Address</h3>
              <div className="text-sm text-gray-900">
                <p>{selectedOrganization.contactInfo.address.street}</p>
                <p>
                  {selectedOrganization.contactInfo.address.city}, {selectedOrganization.contactInfo.address.state} {selectedOrganization.contactInfo.address.zipCode}
                </p>
                <p>{selectedOrganization.contactInfo.address.country}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Organization Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                selectedOrganization.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedOrganization.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Created:</span>
              <span className="ml-2 text-sm text-gray-900">
                {selectedOrganization.createdAt.toLocaleDateString()}
              </span>
            </div>
            {selectedOrganization.territoryId && (
              <div>
                <span className="text-sm font-medium text-gray-500">Territory:</span>
                <span className="ml-2 text-sm text-gray-900">{selectedOrganization.territoryId}</span>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-500">Last Updated:</span>
              <span className="ml-2 text-sm text-gray-900">
                {selectedOrganization.updatedAt.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {selectedOrganization.parentId && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Hierarchy</h3>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Parent Organization:</span>
              <span className="ml-2">{selectedOrganization.parentId}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Hierarchy Tree */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Organization Hierarchy
              {organizationType && ` - ${organizationType}`}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Click to expand/collapse, select to view details
            </p>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            {hierarchyTree.length > 0 ? (
              <div className="space-y-1">
                {hierarchyTree.map(node => renderHierarchyNode(node))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No organizations found
              </div>
            )}
          </div>
        </div>

        {/* Organization Details */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Organization Details</h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {renderOrganizationDetails()}
          </div>
        </div>
      </div>
    </div>
  );
}