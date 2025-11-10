'use client';

import React, { useState, useEffect } from 'react';
import { 
  CommercialOpportunity,
  Quote,
  QuoteStatus 
} from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';

interface PricingToolIntegrationProps {
  opportunityId?: string;
  className?: string;
}

interface PricingToolQuote {
  id: string;
  quoteNumber: string;
  customerName: string;
  projectName: string;
  totalAmount: number;
  lineItems: PricingLineItem[];
  createdDate: Date;
  validUntil: Date;
  status: 'draft' | 'submitted' | 'approved' | 'expired';
  pricingToolId: string;
  configurations: ProductConfiguration[];
}

interface PricingLineItem {
  id: string;
  productCode: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specifications: Record<string, any>;
}

interface ProductConfiguration {
  productType: string;
  model: string;
  capacity: string;
  efficiency: string;
  options: string[];
  customizations: Record<string, any>;
}

export default function PricingToolIntegration({ opportunityId, className = '' }: PricingToolIntegrationProps) {
  const [opportunity, setOpportunity] = useState<CommercialOpportunity | null>(null);
  const [pricingQuotes, setPricingQuotes] = useState<PricingToolQuote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<PricingToolQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('connected');
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);

  useEffect(() => {
    if (opportunityId) {
      loadOpportunityData();
    }
  }, [opportunityId]);

  const loadOpportunityData = async () => {
    if (!opportunityId) return;

    try {
      setLoading(true);
      const oppData = await commercialService.getOpportunityById(opportunityId);
      setOpportunity(oppData);
      
      if (oppData) {
        await loadPricingQuotes(oppData);
      }
    } catch (error) {
      console.error('Error loading opportunity data:', error);
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const loadPricingQuotes = async (opp: CommercialOpportunity) => {
    try {
      // Mock pricing tool integration - in real implementation, this would connect to MySQL database
      const mockQuotes: PricingToolQuote[] = [
        {
          id: 'pt_quote_1',
          quoteNumber: 'Q-2024-001',
          customerName: opp.jobSiteName,
          projectName: opp.description,
          totalAmount: opp.estimatedValue * 0.8, // Slightly lower than estimated
          lineItems: [
            {
              id: 'li_1',
              productCode: 'AHU-500',
              productName: 'Air Handling Unit 500 CFM',
              description: 'Commercial air handler with variable speed drive',
              quantity: 2,
              unitPrice: 15000,
              totalPrice: 30000,
              specifications: {
                cfm: 500,
                efficiency: 'High',
                controls: 'DDC'
              }
            },
            {
              id: 'li_2',
              productCode: 'COIL-CW-24',
              productName: 'Chilled Water Coil',
              description: '24" chilled water cooling coil',
              quantity: 2,
              unitPrice: 2500,
              totalPrice: 5000,
              specifications: {
                size: '24x24',
                rows: 6,
                fins: 'Aluminum'
              }
            }
          ],
          createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'submitted',
          pricingToolId: 'pricing_db_123',
          configurations: [
            {
              productType: 'Air Handler',
              model: 'AHU-500-VSD',
              capacity: '500 CFM',
              efficiency: 'Premium',
              options: ['Variable Speed Drive', 'DDC Controls', 'Sound Attenuation'],
              customizations: {
                coilType: 'Chilled Water',
                filterType: 'MERV 13',
                casingMaterial: 'Galvanized Steel'
              }
            }
          ]
        },
        {
          id: 'pt_quote_2',
          quoteNumber: 'Q-2024-002',
          customerName: opp.jobSiteName,
          projectName: `${opp.description} - Alternative`,
          totalAmount: opp.estimatedValue * 1.1, // Higher alternative
          lineItems: [
            {
              id: 'li_3',
              productCode: 'AHU-750',
              productName: 'Air Handling Unit 750 CFM',
              description: 'Premium commercial air handler with advanced controls',
              quantity: 2,
              unitPrice: 22000,
              totalPrice: 44000,
              specifications: {
                cfm: 750,
                efficiency: 'Premium',
                controls: 'Advanced DDC'
              }
            }
          ],
          createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'draft',
          pricingToolId: 'pricing_db_124',
          configurations: [
            {
              productType: 'Air Handler',
              model: 'AHU-750-PREM',
              capacity: '750 CFM',
              efficiency: 'Premium Plus',
              options: ['Variable Speed Drive', 'Advanced DDC', 'Sound Attenuation', 'Energy Recovery'],
              customizations: {
                coilType: 'Chilled Water with Hot Water Reheat',
                filterType: 'MERV 16',
                casingMaterial: 'Stainless Steel'
              }
            }
          ]
        }
      ];

      setPricingQuotes(mockQuotes);
    } catch (error) {
      console.error('Error loading pricing quotes:', error);
      setConnectionStatus('error');
    }
  };

  const handleImportQuote = async (quote: PricingToolQuote) => {
    if (!opportunity) return;

    try {
      // Convert pricing tool quote to CRM quote
      const crmQuote: Quote = {
        id: `quote_${Date.now()}`,
        opportunityId: opportunity.id,
        quoteNumber: quote.quoteNumber,
        amount: quote.totalAmount,
        status: QuoteStatus.SUBMITTED,
        submittedDate: quote.createdDate,
        validUntil: quote.validUntil,
        items: quote.lineItems.map(item => ({
          productId: item.productCode,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          specifications: JSON.stringify(item.specifications)
        })),
        notes: `Imported from pricing tool (${quote.pricingToolId})`,
        pricingToolId: quote.pricingToolId
      };

      await commercialService.createQuote(crmQuote);
      alert('Quote imported successfully!');
    } catch (error) {
      console.error('Error importing quote:', error);
      alert('Error importing quote. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderConnectionStatus = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow border">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'disconnected' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <div>
            <h3 className="font-medium text-gray-900">Pricing Tool Connection</h3>
            <p className="text-sm text-gray-600">
              {connectionStatus === 'connected' ? 'Connected to MySQL pricing database' :
               connectionStatus === 'disconnected' ? 'Connection temporarily unavailable' :
               'Connection error - please check configuration'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setConnectionStatus('connected')}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Test Connection
          </button>
          <button
            onClick={() => setShowQuoteBuilder(true)}
            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            New Quote
          </button>
        </div>
      </div>
    </div>
  );

  const renderQuotesList = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Available Quotes from Pricing Tool</h3>
        <p className="text-sm text-gray-600 mt-1">
          Quotes generated in the pricing tool for this opportunity
        </p>
      </div>
      <div className="divide-y divide-gray-200">
        {pricingQuotes.map(quote => (
          <div key={quote.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-medium text-gray-900">{quote.quoteNumber}</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                    {quote.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{quote.projectName}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Total Amount:</span>
                    <div className="text-lg font-bold text-green-600">{formatCurrency(quote.totalAmount)}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Created:</span>
                    <div className="text-sm text-gray-900">{quote.createdDate.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Valid Until:</span>
                    <div className="text-sm text-gray-900">{quote.validUntil.toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Line Items ({quote.lineItems.length})</h5>
                  <div className="space-y-2">
                    {quote.lineItems.slice(0, 3).map(item => (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                          <div className="text-xs text-gray-600">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.totalPrice)}
                        </div>
                      </div>
                    ))}
                    {quote.lineItems.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{quote.lineItems.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="ml-6 flex flex-col space-y-2">
                <button
                  onClick={() => setSelectedQuote(quote)}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleImportQuote(quote)}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Import Quote
                </button>
                <button
                  onClick={() => window.open(`/pricing-tool/quote/${quote.pricingToolId}`, '_blank')}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Edit in Tool
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {pricingQuotes.length === 0 && (
        <div className="p-12 text-center">
          <div className="text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes found</h3>
            <p className="text-gray-600">No quotes have been generated for this opportunity in the pricing tool.</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderQuoteDetails = () => {
    if (!selectedQuote) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedQuote.quoteNumber}</h2>
                <p className="text-gray-600">{selectedQuote.projectName}</p>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quote Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quote Summary</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quote Number:</span>
                    <span className="font-medium">{selectedQuote.quoteNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{selectedQuote.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-green-600">{formatCurrency(selectedQuote.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedQuote.status)}`}>
                      {selectedQuote.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valid Until:</span>
                    <span className="font-medium">{selectedQuote.validUntil.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Product Configurations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Configurations</h3>
                <div className="space-y-4">
                  {selectedQuote.configurations.map((config, index) => (
                    <div key={index} className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">{config.productType}</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-blue-700">Model:</span>
                          <span className="ml-2 text-blue-900">{config.model}</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Capacity:</span>
                          <span className="ml-2 text-blue-900">{config.capacity}</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Efficiency:</span>
                          <span className="ml-2 text-blue-900">{config.efficiency}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-blue-700 text-sm">Options:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {config.options.map((option, optIndex) => (
                            <span key={optIndex} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Line Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedQuote.lineItems.map(item => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                          <div className="text-sm text-gray-500">{item.productCode}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{item.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(item.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => window.open(`/pricing-tool/quote/${selectedQuote.pricingToolId}`, '_blank')}
                className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200"
              >
                Edit in Pricing Tool
              </button>
              <button
                onClick={() => handleImportQuote(selectedQuote)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Import to CRM
              </button>
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
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Opportunity Selected</h3>
          <p>Please select an opportunity to view pricing tool integration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pricing Tool Integration</h1>
        <p className="text-sm text-gray-600 mt-1">
          {opportunity.jobSiteName} - {opportunity.description}
        </p>
      </div>

      {/* Connection Status */}
      {renderConnectionStatus()}

      {/* Quotes List */}
      {renderQuotesList()}

      {/* Quote Details Modal */}
      {renderQuoteDetails()}
    </div>
  );
}