/**
 * Shipping Carrier Integration Service
 * Provides integration with major shipping carriers for tracking and delivery management
 */

export interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
  eventCode?: string;
  facilityName?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface DeliveryConfirmation {
  deliveredAt: string;
  signedBy: string;
  deliveryLocation: string;
  proofOfDeliveryUrl?: string;
  deliveryImageUrl?: string;
  recipientName?: string;
  deliveryNotes?: string;
}

export interface CarrierTrackingInfo {
  trackingNumber: string;
  carrier: string;
  status: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  events: TrackingEvent[];
  deliveryConfirmation?: DeliveryConfirmation;
  serviceType?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  lastUpdated: string;
}

export interface CarrierConfig {
  name: string;
  apiKey: string;
  apiUrl: string;
  trackingUrl: string;
  enabled: boolean;
}

export interface ShippingCarrier {
  name: string;
  code: string;
  trackingUrl: string;
  apiEndpoint?: string;
  supportedServices: string[];
}

// Supported shipping carriers
export const SHIPPING_CARRIERS: ShippingCarrier[] = [
  {
    name: 'FedEx',
    code: 'FEDEX',
    trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr=',
    apiEndpoint: 'https://apis.fedex.com/track/v1/trackingnumbers',
    supportedServices: ['FedEx Ground', 'FedEx Express', 'FedEx Freight'],
  },
  {
    name: 'UPS',
    code: 'UPS',
    trackingUrl: 'https://www.ups.com/track?tracknum=',
    apiEndpoint: 'https://onlinetools.ups.com/api/track/v1/details',
    supportedServices: ['UPS Ground', 'UPS Next Day Air', 'UPS Freight'],
  },
  {
    name: 'USPS',
    code: 'USPS',
    trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
    apiEndpoint: 'https://secure.shippingapis.com/ShippingAPI.dll',
    supportedServices: ['Priority Mail', 'Ground Advantage', 'Express Mail'],
  },
  {
    name: 'DHL',
    code: 'DHL',
    trackingUrl: 'https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id=',
    apiEndpoint: 'https://api-eu.dhl.com/track/shipments',
    supportedServices: ['DHL Express', 'DHL Ground'],
  },
];

class ShippingCarrierService {
  private carriers: Map<string, CarrierConfig> = new Map();

  constructor() {
    // Initialize with default configurations
    this.initializeCarriers();
  }

  private initializeCarriers() {
    // In a real implementation, these would come from environment variables or database
    const defaultConfigs: CarrierConfig[] = [
      {
        name: 'FedEx',
        apiKey: process.env.FEDEX_API_KEY || '',
        apiUrl: 'https://apis.fedex.com/track/v1/trackingnumbers',
        trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr=',
        enabled: !!process.env.FEDEX_API_KEY,
      },
      {
        name: 'UPS',
        apiKey: process.env.UPS_API_KEY || '',
        apiUrl: 'https://onlinetools.ups.com/api/track/v1/details',
        trackingUrl: 'https://www.ups.com/track?tracknum=',
        enabled: !!process.env.UPS_API_KEY,
      },
      {
        name: 'USPS',
        apiKey: process.env.USPS_API_KEY || '',
        apiUrl: 'https://secure.shippingapis.com/ShippingAPI.dll',
        trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
        enabled: !!process.env.USPS_API_KEY,
      },
      {
        name: 'DHL',
        apiKey: process.env.DHL_API_KEY || '',
        apiUrl: 'https://api-eu.dhl.com/track/shipments',
        trackingUrl: 'https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id=',
        enabled: !!process.env.DHL_API_KEY,
      },
    ];

    defaultConfigs.forEach(config => {
      this.carriers.set(config.name, config);
    });
  }

  /**
   * Get tracking information from carrier API
   */
  async getTrackingInfo(trackingNumber: string, carrierName: string): Promise<CarrierTrackingInfo | null> {
    const carrier = this.carriers.get(carrierName);
    if (!carrier || !carrier.enabled) {
      console.warn(`Carrier ${carrierName} not configured or disabled`);
      return this.getMockTrackingInfo(trackingNumber, carrierName);
    }

    try {
      switch (carrierName) {
        case 'FedEx':
          return await this.getFedExTracking(trackingNumber, carrier);
        case 'UPS':
          return await this.getUPSTracking(trackingNumber, carrier);
        case 'USPS':
          return await this.getUSPSTracking(trackingNumber, carrier);
        case 'DHL':
          return await this.getDHLTracking(trackingNumber, carrier);
        default:
          return this.getMockTrackingInfo(trackingNumber, carrierName);
      }
    } catch (error) {
      console.error(`Error fetching tracking info from ${carrierName}:`, error);
      return this.getMockTrackingInfo(trackingNumber, carrierName);
    }
  }

  /**
   * Get tracking information for multiple tracking numbers
   */
  async getBulkTrackingInfo(trackingNumbers: { number: string; carrier: string }[]): Promise<CarrierTrackingInfo[]> {
    const promises = trackingNumbers.map(({ number, carrier }) =>
      this.getTrackingInfo(number, carrier)
    );

    const results = await Promise.allSettled(promises);
    return results
      .filter((result): result is PromiseFulfilledResult<CarrierTrackingInfo> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
  }

  /**
   * Get delivery confirmation details
   */
  async getDeliveryConfirmation(trackingNumber: string, carrierName: string): Promise<DeliveryConfirmation | null> {
    const trackingInfo = await this.getTrackingInfo(trackingNumber, carrierName);
    return trackingInfo?.deliveryConfirmation || null;
  }

  /**
   * Get carrier tracking URL
   */
  getTrackingUrl(trackingNumber: string, carrierName: string): string {
    const carrier = SHIPPING_CARRIERS.find(c => c.name === carrierName);
    return carrier ? `${carrier.trackingUrl}${trackingNumber}` : '';
  }

  /**
   * Detect carrier from tracking number format
   */
  detectCarrier(trackingNumber: string): string | null {
    // FedEx patterns
    if (/^\d{12}$/.test(trackingNumber) || /^\d{14}$/.test(trackingNumber)) {
      return 'FedEx';
    }
    
    // UPS patterns
    if (/^1Z[0-9A-Z]{16}$/.test(trackingNumber)) {
      return 'UPS';
    }
    
    // USPS patterns
    if (/^(94|93|92|94|95)\d{20}$/.test(trackingNumber) || /^[A-Z]{2}\d{9}US$/.test(trackingNumber)) {
      return 'USPS';
    }
    
    // DHL patterns
    if (/^\d{10}$/.test(trackingNumber) || /^\d{11}$/.test(trackingNumber)) {
      return 'DHL';
    }

    return null;
  }

  /**
   * Subscribe to tracking updates (webhook setup)
   */
  async subscribeToUpdates(trackingNumber: string, carrierName: string, webhookUrl: string): Promise<boolean> {
    const carrier = this.carriers.get(carrierName);
    if (!carrier || !carrier.enabled) {
      return false;
    }

    try {
      // Implementation would depend on carrier's webhook API
      console.log(`Setting up webhook for ${trackingNumber} with ${carrierName} to ${webhookUrl}`);
      return true;
    } catch (error) {
      console.error(`Error setting up webhook for ${carrierName}:`, error);
      return false;
    }
  }

  // Private methods for carrier-specific API calls

  private async getFedExTracking(trackingNumber: string, carrier: CarrierConfig): Promise<CarrierTrackingInfo> {
    // Mock implementation - in real app, this would call FedEx API
    return this.getMockTrackingInfo(trackingNumber, 'FedEx');
  }

  private async getUPSTracking(trackingNumber: string, carrier: CarrierConfig): Promise<CarrierTrackingInfo> {
    // Mock implementation - in real app, this would call UPS API
    return this.getMockTrackingInfo(trackingNumber, 'UPS');
  }

  private async getUSPSTracking(trackingNumber: string, carrier: CarrierConfig): Promise<CarrierTrackingInfo> {
    // Mock implementation - in real app, this would call USPS API
    return this.getMockTrackingInfo(trackingNumber, 'USPS');
  }

  private async getDHLTracking(trackingNumber: string, carrier: CarrierConfig): Promise<CarrierTrackingInfo> {
    // Mock implementation - in real app, this would call DHL API
    return this.getMockTrackingInfo(trackingNumber, 'DHL');
  }

  /**
   * Mock tracking info for development/fallback
   */
  private getMockTrackingInfo(trackingNumber: string, carrierName: string): CarrierTrackingInfo {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    return {
      trackingNumber,
      carrier: carrierName,
      status: 'In Transit',
      estimatedDelivery: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      events: [
        {
          timestamp: twoDaysAgo.toISOString(),
          status: 'Package Picked Up',
          location: 'Chicago, IL',
          description: 'Package picked up by carrier',
          city: 'Chicago',
          state: 'IL',
          country: 'US',
        },
        {
          timestamp: yesterday.toISOString(),
          status: 'In Transit',
          location: 'Indianapolis, IN',
          description: 'Package in transit to destination facility',
          city: 'Indianapolis',
          state: 'IN',
          country: 'US',
        },
        {
          timestamp: now.toISOString(),
          status: 'Out for Delivery',
          location: 'Springfield, IL',
          description: 'Package is out for delivery',
          city: 'Springfield',
          state: 'IL',
          country: 'US',
        },
      ],
      serviceType: `${carrierName} Ground`,
      lastUpdated: now.toISOString(),
    };
  }

  /**
   * Get all supported carriers
   */
  getSupportedCarriers(): ShippingCarrier[] {
    return SHIPPING_CARRIERS;
  }

  /**
   * Check if carrier is configured and enabled
   */
  isCarrierEnabled(carrierName: string): boolean {
    const carrier = this.carriers.get(carrierName);
    return carrier?.enabled || false;
  }

  /**
   * Update carrier configuration
   */
  updateCarrierConfig(carrierName: string, config: Partial<CarrierConfig>): void {
    const existingConfig = this.carriers.get(carrierName);
    if (existingConfig) {
      this.carriers.set(carrierName, { ...existingConfig, ...config });
    }
  }
}

// Export singleton instance
export const shippingCarrierService = new ShippingCarrierService();
export default shippingCarrierService;