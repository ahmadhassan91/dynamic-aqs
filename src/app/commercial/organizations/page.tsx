'use client';

import React from 'react';
import Link from 'next/link';
import { CommercialLayout } from '@/components/layout/CommercialLayout';
import { OrganizationType } from '@/types/commercial';

export default function OrganizationsPage() {
  const organizationFeatures = [
    {
      title: 'Organization Hierarchy',
      description: 'Interactive organization chart with drag-and-drop restructuring and hierarchy validation',
      href: '/commercial/organizations/hierarchy',
      icon: '🏗️',
      color: 'blue'
    },
    {
      title: 'Consolidated Reports',
      description: 'Parent organization rollup displays with consolidated contact and opportunity views',
      href: '/commercial/organizations/reports',
      icon: '📊',
      color: 'green'
    },
    {
      title: 'Bulk Management',
      description: 'Import, update, and validate organization data in bulk with performance analytics',
      href: '/commercial/organizations/bulk',
      icon: '⚡',
      color: 'purple'
    }
  ];

  const organizationTypes = [
    {
      type: OrganizationType.ENGINEERING_FIRM,
      icon: '🏗️',
      description: 'Engineering consulting firms and design companies'
    },
    {
      type: OrganizationType.MANUFACTURER_REP,
      icon: '🏢',
      description: 'Manufacturer representative organizations'
    },
    {
      type: OrganizationType.BUILDING_OWNER,
      icon: '🏛️',
      description: 'Building owners and property management companies'
    },
    {
      type: OrganizationType.ARCHITECT,
      icon: '📐',
      description: 'Architectural firms and design studios'
    },
    {
      type: OrganizationType.MECHANICAL_CONTRACTOR,
      icon: '🔧',
      description: 'Mechanical contractors and installation companies'
    },
    {
      type: OrganizationType.FACILITIES_MANAGER,
      icon: '🏭',
      description: 'Facilities management and maintenance organizations'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50',
      green: 'border-green-200 hover:border-green-400 hover:bg-green-50',
      purple: 'border-purple-200 hover:border-purple-400 hover:bg-purple-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <CommercialLayout>
      <div className="residential-content-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
          <p className="text-gray-600 mt-2">
            Manage organization hierarchies, relationships, and performance analytics
          </p>
        </div>

      {/* Main Features */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Management Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizationFeatures.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className={`block p-6 border-2 border-dashed rounded-lg transition-all ${getColorClasses(feature.color)}`}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Organization Types Overview */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Organization Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizationTypes.map((orgType) => (
            <div
              key={orgType.type}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start">
                <span className="text-2xl mr-3">{orgType.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{orgType.type}</h3>
                  <p className="text-sm text-gray-600">{orgType.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/commercial/organizations/hierarchy"
            className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <div className="text-2xl mb-2">🔄</div>
            <div className="text-sm font-medium text-gray-900">Restructure Hierarchy</div>
          </Link>
          
          <Link
            href="/commercial/organizations/reports"
            className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <div className="text-2xl mb-2">📈</div>
            <div className="text-sm font-medium text-gray-900">View Analytics</div>
          </Link>
          
          <Link
            href="/commercial/organizations/bulk"
            className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <div className="text-2xl mb-2">📥</div>
            <div className="text-sm font-medium text-gray-900">Import Data</div>
          </Link>
          
          <button className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center">
            <div className="text-2xl mb-2">➕</div>
            <div className="text-sm font-medium text-gray-900">Add Organization</div>
          </button>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Getting Started</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>Organization Hierarchy:</strong> Use the interactive chart to visualize and manage parent-child relationships between organizations. Drag and drop to restructure, with automatic validation to prevent circular references.
          </p>
          <p>
            <strong>Consolidated Reports:</strong> View rollup data for parent organizations, including all contacts, opportunities, and performance metrics from child organizations.
          </p>
          <p>
            <strong>Bulk Management:</strong> Import large datasets, perform bulk updates, and generate comprehensive performance analytics across all organizations.
          </p>
        </div>
      </div>
      </div>
    </CommercialLayout>
  );
}