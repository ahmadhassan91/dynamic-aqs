'use client';

import React, { useState, useEffect } from 'react';
import { 
  CommercialOpportunity,
  ManufacturerRep,
  EngineerContact 
} from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  trigger: NotificationTrigger;
  recipients: NotificationRecipient[];
  template: NotificationTemplate;
  isActive: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

interface NotificationTrigger {
  type: 'po_entered' | 'ship_date_set' | 'shipment_completed' | 'opportunity_won' | 'follow_up_due';
  conditions: Record<string, any>;
  delay?: number; // minutes
}

interface NotificationRecipient {
  type: 'regional_sales_manager' | 'manufacturer_rep' | 'engineer' | 'custom_email';
  identifier: string; // ID or email address
  name: string;
}

interface NotificationTemplate {
  subject: string;
  body: string;
  variables: string[]; // Available template variables
}

interface NotificationLog {
  id: string;
  ruleId: string;
  ruleName: string;
  triggeredBy: string;
  recipients: string[];
  subject: string;
  body: string;
  sentAt: Date;
  status: 'sent' | 'failed' | 'pending';
  opportunityId?: string;
  metadata: Record<string, any>;
}

interface AutomatedNotificationSystemProps {
  className?: string;
}

export default function AutomatedNotificationSystem({ className = '' }: AutomatedNotificationSystemProps) {
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([]);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'rules' | 'logs' | 'templates'>('rules');
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null);

  useEffect(() => {
    loadNotificationData();
  }, []);

  const loadNotificationData = async () => {
    try {
      setLoading(true);
      // Mock data - in real implementation, this would load from the backend
      const mockRules = generateMockNotificationRules();
      const mockLogs = generateMockNotificationLogs();
      
      setNotificationRules(mockRules);
      setNotificationLogs(mockLogs);
    } catch (error) {
      console.error('Error loading notification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockNotificationRules = (): NotificationRule[] => {
    return [
      {
        id: 'rule_1',
        name: 'PO Entry Notification',
        description: 'Notify Regional Sales Managers when a PO is entered in Acumatica',
        trigger: {
          type: 'po_entered',
          conditions: {
            minimumAmount: 10000
          }
        },
        recipients: [
          {
            type: 'regional_sales_manager',
            identifier: 'rsm_1',
            name: 'John Smith (RSM)'
          },
          {
            type: 'manufacturer_rep',
            identifier: 'rep_1',
            name: 'Mike Johnson (Rep)'
          }
        ],
        template: {
          subject: 'New PO Entered - {{jobName}} ({{customerPO}})',
          body: 'A new purchase order has been entered in Acumatica:\n\nJob: {{jobName}}\nCustomer PO: {{customerPO}}\nAmount: {{poAmount}}\nExpected Ship Date: {{expectedShipDate}}\n\nPlease review and take any necessary follow-up actions.',
          variables: ['jobName', 'customerPO', 'poAmount', 'expectedShipDate']
        },
        isActive: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastTriggered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        triggerCount: 15
      },
      {
        id: 'rule_2',
        name: 'Ship Date Notification',
        description: 'Notify stakeholders when expected ship date is set',
        trigger: {
          type: 'ship_date_set',
          conditions: {}
        },
        recipients: [
          {
            type: 'regional_sales_manager',
            identifier: 'rsm_1',
            name: 'John Smith (RSM)'
          }
        ],
        template: {
          subject: 'Ship Date Set - {{jobName}}',
          body: 'The expected ship date has been set for:\n\nJob: {{jobName}}\nExpected Ship Date: {{expectedShipDate}}\nCustomer: {{customerName}}\n\nPlease coordinate with the customer as needed.',
          variables: ['jobName', 'expectedShipDate', 'customerName']
        },
        isActive: true,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        lastTriggered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        triggerCount: 8
      },
      {
        id: 'rule_3',
        name: 'Shipment Completion',
        description: 'Notify all stakeholders when shipment is completed',
        trigger: {
          type: 'shipment_completed',
          conditions: {}
        },
        recipients: [
          {
            type: 'regional_sales_manager',
            identifier: 'rsm_1',
            name: 'John Smith (RSM)'
          },
          {
            type: 'manufacturer_rep',
            identifier: 'rep_1',
            name: 'Mike Johnson (Rep)'
          },
          {
            type: 'custom_email',
            identifier: 'customer@company.com',
            name: 'Customer Contact'
          }
        ],
        template: {
          subject: 'Shipment Completed - {{jobName}}',
          body: 'Your order has been shipped:\n\nJob: {{jobName}}\nTracking Number: {{trackingNumber}}\nCarrier: {{carrier}}\nEstimated Delivery: {{estimatedDelivery}}\n\nThank you for your business!',
          variables: ['jobName', 'trackingNumber', 'carrier', 'estimatedDelivery']
        },
        isActive: true,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        lastTriggered: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        triggerCount: 12
      },
      {
        id: 'rule_4',
        name: 'High-Profile Follow-up (6 months)',
        description: 'Schedule follow-up alerts for high-profile opportunities',
        trigger: {
          type: 'follow_up_due',
          conditions: {
            profileLevel: 'high',
            followUpPeriod: '6months'
          }
        },
        recipients: [
          {
            type: 'regional_sales_manager',
            identifier: 'rsm_1',
            name: 'John Smith (RSM)'
          }
        ],
        template: {
          subject: '6-Month Follow-up Due - {{jobName}}',
          body: 'It\'s time for a 6-month follow-up on this high-profile opportunity:\n\nJob: {{jobName}}\nOriginal Ship Date: {{originalShipDate}}\nCustomer: {{customerName}}\nEngineer: {{engineerName}}\n\nPlease schedule a follow-up interaction to maintain the relationship.',
          variables: ['jobName', 'originalShipDate', 'customerName', 'engineerName']
        },
        isActive: true,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        triggerCount: 3
      }
    ];
  };

  const generateMockNotificationLogs = (): NotificationLog[] => {
    return [
      {
        id: 'log_1',
        ruleId: 'rule_1',
        ruleName: 'PO Entry Notification',
        triggeredBy: 'Acumatica Integration',
        recipients: ['john.smith@company.com', 'mike.johnson@rep.com'],
        subject: 'New PO Entered - Hospital HVAC Project (PO-2024-001)',
        body: 'A new purchase order has been entered...',
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'sent',
        opportunityId: 'opp_1',
        metadata: {
          poNumber: 'PO-2024-001',
          amount: 125000
        }
      },
      {
        id: 'log_2',
        ruleId: 'rule_2',
        ruleName: 'Ship Date Notification',
        triggeredBy: 'Acumatica Integration',
        recipients: ['john.smith@company.com'],
        subject: 'Ship Date Set - University Lab Project',
        body: 'The expected ship date has been set...',
        sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'sent',
        opportunityId: 'opp_2',
        metadata: {
          expectedShipDate: '2024-02-15'
        }
      },
      {
        id: 'log_3',
        ruleId: 'rule_3',
        ruleName: 'Shipment Completion',
        triggeredBy: 'Acumatica Integration',
        recipients: ['john.smith@company.com', 'customer@hospital.com'],
        subject: 'Shipment Completed - Hospital HVAC Project',
        body: 'Your order has been shipped...',
        sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'sent',
        opportunityId: 'opp_1',
        metadata: {
          trackingNumber: 'TRK123456789',
          carrier: 'FedEx Freight'
        }
      }
    ];
  };

  const handleToggleRule = async (ruleId: string) => {
    setNotificationRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const handleTestRule = async (rule: NotificationRule) => {
    // Mock test notification
    const testLog: NotificationLog = {
      id: `test_${Date.now()}`,
      ruleId: rule.id,
      ruleName: `${rule.name} (TEST)`,
      triggeredBy: 'Manual Test',
      recipients: rule.recipients.map(r => r.name),
      subject: rule.template.subject.replace(/\{\{(\w+)\}\}/g, '[TEST_$1]'),
      body: rule.template.body.replace(/\{\{(\w+)\}\}/g, '[TEST_$1]'),
      sentAt: new Date(),
      status: 'sent',
      metadata: { isTest: true }
    };

    setNotificationLogs(prev => [testLog, ...prev]);
    alert('Test notification sent successfully!');
  };

  const renderRulesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Notification Rules</h3>
        <button
          onClick={() => setShowRuleModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Create Rule
        </button>
      </div>

      <div className="space-y-4">
        {notificationRules.map(rule => (
          <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-medium text-gray-900">{rule.name}</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{rule.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Trigger:</span>
                    <div className="text-sm text-gray-900 capitalize">
                      {rule.trigger.type.replace('_', ' ')}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Recipients:</span>
                    <div className="text-sm text-gray-900">
                      {rule.recipients.length} recipient{rule.recipients.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Triggered:</span>
                    <div className="text-sm text-gray-900">
                      {rule.triggerCount} times
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-500">Recipients:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {rule.recipients.map((recipient, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {recipient.name}
                      </span>
                    ))}
                  </div>
                </div>

                {rule.lastTriggered && (
                  <div className="text-sm text-gray-600">
                    Last triggered: {rule.lastTriggered.toLocaleString()}
                  </div>
                )}
              </div>
              
              <div className="ml-6 flex flex-col space-y-2">
                <button
                  onClick={() => handleToggleRule(rule.id)}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    rule.isActive 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {rule.isActive ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => handleTestRule(rule)}
                  className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Test
                </button>
                <button
                  onClick={() => setEditingRule(rule)}
                  className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLogsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Notification Logs</h3>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notificationLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.ruleName}</div>
                    <div className="text-sm text-gray-500">{log.triggeredBy}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{log.subject}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{log.recipients.length} recipients</div>
                    <div className="text-sm text-gray-500">
                      {log.recipients.slice(0, 2).join(', ')}
                      {log.recipients.length > 2 && ` +${log.recipients.length - 2} more`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      log.status === 'sent' ? 'bg-green-100 text-green-800' :
                      log.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.sentAt.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Notification Templates</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {notificationRules.map(rule => (
          <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-3">{rule.name}</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Template</label>
                <div className="p-3 bg-gray-50 rounded border text-sm font-mono">
                  {rule.template.subject}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Template</label>
                <div className="p-3 bg-gray-50 rounded border text-sm font-mono whitespace-pre-wrap">
                  {rule.template.body}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Variables</label>
                <div className="flex flex-wrap gap-1">
                  {rule.template.variables.map(variable => (
                    <span key={variable} className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded font-mono">
                      {`{{${variable}}}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Automated Notification System</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage automated notifications for PO entries, shipments, and follow-ups
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {notificationRules.filter(r => r.isActive).length}
          </div>
          <div className="text-sm text-gray-600">Active Rules</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {notificationLogs.filter(l => l.status === 'sent').length}
          </div>
          <div className="text-sm text-gray-600">Sent Today</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">
            {notificationRules.reduce((sum, rule) => sum + rule.triggerCount, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Triggered</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">
            {notificationLogs.filter(l => l.status === 'failed').length}
          </div>
          <div className="text-sm text-gray-600">Failed</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'rules', label: 'Rules', icon: '⚙️' },
            { id: 'logs', label: 'Logs', icon: '📋' },
            { id: 'templates', label: 'Templates', icon: '📝' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === 'rules' && renderRulesTab()}
      {selectedTab === 'logs' && renderLogsTab()}
      {selectedTab === 'templates' && renderTemplatesTab()}
    </div>
  );
}