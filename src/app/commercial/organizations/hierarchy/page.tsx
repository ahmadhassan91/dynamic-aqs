'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { CommercialLayout } from '@/components/layout/CommercialLayout';
import { Organization, OrganizationType } from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';

interface OrganizationNode extends Organization {
  children: OrganizationNode[];
  level: number;
  isExpanded: boolean;
}

interface ValidationError {
  type: 'circular_reference' | 'invalid_parent' | 'max_depth_exceeded';
  message: string;
  organizationId: string;
}

export default function OrganizationHierarchyPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [hierarchyTree, setHierarchyTree] = useState<OrganizationNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const data = await commercialService.getOrganizations();
      setOrganizations(data);
      buildHierarchyTree(data);
      validateHierarchy(data);
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildHierarchyTree = (orgs: Organization[]) => {
    const orgMap = new Map<string, OrganizationNode>();
    const rootNodes: OrganizationNode[] = [];

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

    // Sort nodes by name
    const sortNodes = (nodes: OrganizationNode[]) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      nodes.forEach(node => sortNodes(node.children));
    };
    sortNodes(rootNodes);

    setHierarchyTree(rootNodes);
  };

  const validateHierarchy = (orgs: Organization[]) => {
    const errors: ValidationError[] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const detectCircularReference = (orgId: string, path: string[] = []): boolean => {
      if (recursionStack.has(orgId)) {
        errors.push({
          type: 'circular_reference',
          message: `Circular reference detected in path: ${path.join(' -> ')} -> ${orgId}`,
          organizationId: orgId
        });
        return true;
      }

      if (visited.has(orgId)) {
        return false;
      }

      visited.add(orgId);
      recursionStack.add(orgId);

      const org = orgs.find(o => o.id === orgId);
      if (org?.parentId) {
        const newPath = [...path, org.name];
        if (detectCircularReference(org.parentId, newPath)) {
          return true;
        }
      }

      recursionStack.delete(orgId);
      return false;
    };

    // Check for circular references and max depth
    orgs.forEach(org => {
      if (!visited.has(org.id)) {
        detectCircularReference(org.id);
      }

      // Check max depth (e.g., 5 levels)
      let depth = 0;
      let currentOrg = org;
      const pathIds = new Set<string>();
      
      while (currentOrg.parentId && depth < 10) {
        if (pathIds.has(currentOrg.id)) {
          break; // Circular reference already detected
        }
        pathIds.add(currentOrg.id);
        currentOrg = orgs.find(o => o.id === currentOrg.parentId) || currentOrg;
        depth++;
      }

      if (depth >= 5) {
        errors.push({
          type: 'max_depth_exceeded',
          message: `Organization hierarchy exceeds maximum depth of 5 levels`,
          organizationId: org.id
        });
      }
    });

    setValidationErrors(errors);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    if (!destination || !isEditMode) {
      return;
    }

    // If dropped in the same position, do nothing
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    try {
      const draggedOrg = organizations.find(org => org.id === draggableId);
      if (!draggedOrg) return;

      let newParentId: string | undefined;
      
      // Determine new parent based on drop target
      if (destination.droppableId !== 'root') {
        newParentId = destination.droppableId;
        
        // Validate the move won't create circular reference
        if (wouldCreateCircularReference(draggableId, newParentId)) {
          alert('Cannot move organization: This would create a circular reference.');
          return;
        }
      }

      // Update organization
      const updatedOrg = { ...draggedOrg, parentId: newParentId };
      await commercialService.updateOrganization(updatedOrg);

      // Reload data
      await loadOrganizations();
    } catch (error) {
      console.error('Error updating organization hierarchy:', error);
      alert('Failed to update organization hierarchy. Please try again.');
    }
  };

  const wouldCreateCircularReference = (orgId: string, newParentId: string): boolean => {
    // Check if newParentId is a descendant of orgId
    const isDescendant = (checkId: string, ancestorId: string): boolean => {
      const org = organizations.find(o => o.id === checkId);
      if (!org || !org.parentId) return false;
      if (org.parentId === ancestorId) return true;
      return isDescendant(org.parentId, ancestorId);
    };

    return isDescendant(newParentId, orgId);
  };

  const toggleExpansion = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
    buildHierarchyTree(organizations);
  };

  const handleOrganizationClick = (organization: Organization) => {
    setSelectedOrganization(organization);
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

  const renderHierarchyNode = (node: OrganizationNode, index: number) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedOrganization?.id === node.id;
    const hasError = validationErrors.some(error => error.organizationId === node.id);

    return (
      <Draggable 
        key={node.id} 
        draggableId={node.id} 
        index={index}
        isDragDisabled={!isEditMode}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`select-none ${snapshot.isDragging ? 'opacity-50' : ''}`}
          >
            <div
              className={`flex items-center py-2 px-3 rounded-lg cursor-pointer transition-colors ${
                isSelected 
                  ? 'bg-blue-100 border-blue-300 border' 
                  : hasError
                  ? 'bg-red-50 border-red-200 border'
                  : 'hover:bg-gray-50'
              }`}
              style={{ marginLeft: `${node.level * 24}px` }}
              onClick={() => handleOrganizationClick(node)}
            >
              {isEditMode && (
                <div className="mr-2 text-gray-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </div>
              )}
              
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
                    {hasError && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Error
                      </span>
                    )}
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
              <Droppable droppableId={node.id} type="organization">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="ml-4"
                  >
                    {node.children.map((child, childIndex) => 
                      renderHierarchyNode(child, childIndex)
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </div>
        )}
      </Draggable>
    );
  };

  const renderValidationErrors = () => {
    if (validationErrors.length === 0) return null;

    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-sm font-medium text-red-800 mb-2">Hierarchy Validation Errors</h3>
        <ul className="text-sm text-red-700 space-y-1">
          {validationErrors.map((error, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{error.message}</span>
            </li>
          ))}
        </ul>
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

    const orgErrors = validationErrors.filter(error => error.organizationId === selectedOrganization.id);

    return (
      <div className="p-6">
        <div className="flex items-center mb-4">
          <span className="mr-3 text-2xl">{getOrganizationIcon(selectedOrganization.type)}</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selectedOrganization.name}</h2>
            <p className="text-sm text-gray-600">{selectedOrganization.type}</p>
          </div>
        </div>

        {orgErrors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <h4 className="text-sm font-medium text-red-800 mb-1">Validation Issues</h4>
            <ul className="text-sm text-red-700">
              {orgErrors.map((error, index) => (
                <li key={index}>• {error.message}</li>
              ))}
            </ul>
          </div>
        )}

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
      <div className="p-6">
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
    <CommercialLayout>
      <div className="residential-content-container">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Organization Hierarchy</h1>
              <p className="text-gray-600 mt-1">
                Manage organization relationships and structure
              </p>
            </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isEditMode
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {isEditMode ? 'Exit Edit Mode' : 'Edit Hierarchy'}
            </button>
          </div>
        </div>
      </div>

      {renderValidationErrors()}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Hierarchy Tree */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Organization Structure
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isEditMode 
                  ? 'Drag and drop to reorganize hierarchy' 
                  : 'Click to expand/collapse, select to view details'
                }
              </p>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {hierarchyTree.length > 0 ? (
                <Droppable droppableId="root" type="organization">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-1"
                    >
                      {hierarchyTree.map((node, index) => 
                        renderHierarchyNode(node, index)
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
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
      </DragDropContext>
      </div>
    </CommercialLayout>
  );
}