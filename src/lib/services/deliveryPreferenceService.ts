/**
 * Delivery Preference Service
 * Manages delivery preferences, scheduling, and special requirements
 */

import type { DeliveryPreference } from '@/components/dealer/DeliveryPreferenceManager';
import type { DeliveryWindow, ScheduledDelivery } from '@/components/dealer/DeliveryWindowScheduler';

export interface DeliveryScheduleRequest {
  orderId: string;
  trackingNumber?: string;
  preferenceId: string;
  requestedDate: string;
  requestedTimeWindow: string;
  contactInfo: {
    name: string;
    phone: string;
    email?: string;
  };
  specialRequirements?: string[];
  specialInstructions?: string;
  priority: 'standard' | 'preferred' | 'rush';
}

export interface DeliveryRescheduleRequest {
  deliveryId: string;
  newDate: string;
  newTimeWindow: string;
  reason: string;
  contactInfo?: {
    name: string;
    phone: string;
  };
}

export interface DeliveryAvailability {
  date: string;
  availableWindows: {
    startTime: string;
    endTime: string;
    available: boolean;
    capacity: number;
    currentBookings: number;
    requiresAppointment: boolean;
    additionalFee?: number;
  }[];
}

class DeliveryPreferenceService {
  private preferences: Map<string, DeliveryPreference> = new Map();
  private deliveryWindows: Map<string, DeliveryWindow> = new Map();
  private scheduledDeliveries: Map<string, ScheduledDelivery> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // This would typically load from a database or API
    // For now, we'll use mock data
  }

  /**
   * Get all delivery preferences for a dealer
   */
  async getDeliveryPreferences(dealerId: string): Promise<DeliveryPreference[]> {
    // In a real implementation, this would fetch from database
    return Array.from(this.preferences.values()).filter(pref => 
      pref.id.includes(dealerId) // Mock filtering
    );
  }

  /**
   * Create or update a delivery preference
   */
  async saveDeliveryPreference(preference: DeliveryPreference): Promise<DeliveryPreference> {
    const now = new Date().toISOString();
    const savedPreference: DeliveryPreference = {
      ...preference,
      updatedAt: now,
      createdAt: preference.createdAt || now,
    };

    this.preferences.set(preference.id, savedPreference);
    return savedPreference;
  }

  /**
   * Delete a delivery preference
   */
  async deleteDeliveryPreference(preferenceId: string): Promise<boolean> {
    return this.preferences.delete(preferenceId);
  }

  /**
   * Get available delivery windows for a date range
   */
  async getAvailableDeliveryWindows(
    startDate: string,
    endDate: string,
    preferenceId?: string
  ): Promise<DeliveryAvailability[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const availabilities: DeliveryAvailability[] = [];

    // Generate availability for each day in the range
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      
      // Get delivery preference if specified
      const preference = preferenceId ? this.preferences.get(preferenceId) : null;
      
      // Generate time windows based on preference or default schedule
      const windows = this.generateTimeWindows(dateStr, preference);
      
      availabilities.push({
        date: dateStr,
        availableWindows: windows,
      });
    }

    return availabilities;
  }

  private generateTimeWindows(date: string, preference?: DeliveryPreference | null) {
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof DeliveryPreference['deliveryWindows'];
    
    // Default time windows
    const defaultWindows = [
      { startTime: '08:00', endTime: '12:00', capacity: 5 },
      { startTime: '13:00', endTime: '17:00', capacity: 5 },
    ];

    // Use preference windows if available
    const preferenceWindow = preference?.deliveryWindows[dayOfWeek];
    if (preferenceWindow && preferenceWindow.enabled) {
      return [{
        startTime: preferenceWindow.start,
        endTime: preferenceWindow.end,
        available: true,
        capacity: 3, // Default capacity
        currentBookings: 0,
        requiresAppointment: preference.signatureRequired || false,
      }];
    }

    // Return default windows
    return defaultWindows.map(window => ({
      ...window,
      available: true,
      currentBookings: Math.floor(Math.random() * window.capacity), // Mock current bookings
      requiresAppointment: false,
    }));
  }

  /**
   * Schedule a delivery
   */
  async scheduleDelivery(request: DeliveryScheduleRequest): Promise<ScheduledDelivery> {
    const deliveryId = `sd-${Date.now()}`;
    const now = new Date().toISOString();

    const scheduledDelivery: ScheduledDelivery = {
      id: deliveryId,
      orderId: request.orderId,
      trackingNumber: request.trackingNumber || '',
      deliveryWindowId: `dw-${Date.now()}`,
      scheduledDate: request.requestedDate,
      scheduledTime: request.requestedTimeWindow.split('-')[0].trim(),
      status: 'scheduled',
      deliveryAddress: '', // Would be populated from preference
      contactName: request.contactInfo.name,
      contactPhone: request.contactInfo.phone,
      specialRequirements: request.specialRequirements,
      estimatedDuration: this.calculateEstimatedDuration(request.specialRequirements),
      createdAt: now,
      updatedAt: now,
    };

    this.scheduledDeliveries.set(deliveryId, scheduledDelivery);
    return scheduledDelivery;
  }

  private calculateEstimatedDuration(specialRequirements?: string[]): number {
    let baseDuration = 30; // 30 minutes base
    
    if (specialRequirements) {
      // Add time for special requirements
      if (specialRequirements.includes('Crane')) baseDuration += 30;
      if (specialRequirements.includes('Forklift')) baseDuration += 15;
      if (specialRequirements.includes('Inside Delivery')) baseDuration += 20;
      if (specialRequirements.includes('White Glove Service')) baseDuration += 45;
    }
    
    return baseDuration;
  }

  /**
   * Reschedule a delivery
   */
  async rescheduleDelivery(request: DeliveryRescheduleRequest): Promise<ScheduledDelivery | null> {
    const delivery = this.scheduledDeliveries.get(request.deliveryId);
    if (!delivery) return null;

    const updatedDelivery: ScheduledDelivery = {
      ...delivery,
      scheduledDate: request.newDate,
      scheduledTime: request.newTimeWindow.split('-')[0].trim(),
      status: 'rescheduled',
      updatedAt: new Date().toISOString(),
    };

    this.scheduledDeliveries.set(request.deliveryId, updatedDelivery);
    return updatedDelivery;
  }

  /**
   * Cancel a scheduled delivery
   */
  async cancelDelivery(deliveryId: string, reason: string): Promise<boolean> {
    const delivery = this.scheduledDeliveries.get(deliveryId);
    if (!delivery) return false;

    // In a real implementation, this would update the status rather than delete
    this.scheduledDeliveries.delete(deliveryId);
    return true;
  }

  /**
   * Get scheduled deliveries for a dealer
   */
  async getScheduledDeliveries(dealerId: string): Promise<ScheduledDelivery[]> {
    // In a real implementation, this would filter by dealer ID
    return Array.from(this.scheduledDeliveries.values());
  }

  /**
   * Get delivery schedule for a specific order
   */
  async getDeliveryScheduleByOrder(orderId: string): Promise<ScheduledDelivery | null> {
    const deliveries = Array.from(this.scheduledDeliveries.values());
    return deliveries.find(delivery => delivery.orderId === orderId) || null;
  }

  /**
   * Update delivery status (called by shipping carrier integration)
   */
  async updateDeliveryStatus(
    trackingNumber: string, 
    status: ScheduledDelivery['status']
  ): Promise<ScheduledDelivery | null> {
    const deliveries = Array.from(this.scheduledDeliveries.values());
    const delivery = deliveries.find(d => d.trackingNumber === trackingNumber);
    
    if (!delivery) return null;

    const updatedDelivery: ScheduledDelivery = {
      ...delivery,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.scheduledDeliveries.set(delivery.id, updatedDelivery);
    return updatedDelivery;
  }

  /**
   * Get delivery preferences by location
   */
  async getPreferencesByLocation(
    city: string, 
    state: string, 
    zipCode?: string
  ): Promise<DeliveryPreference[]> {
    const preferences = Array.from(this.preferences.values());
    return preferences.filter(pref => 
      pref.deliveryAddress.city.toLowerCase() === city.toLowerCase() &&
      pref.deliveryAddress.state.toLowerCase() === state.toLowerCase() &&
      (!zipCode || pref.deliveryAddress.zip === zipCode)
    );
  }

  /**
   * Validate delivery window availability
   */
  async validateDeliveryWindow(
    date: string, 
    timeWindow: string, 
    preferenceId?: string
  ): Promise<{ available: boolean; reason?: string }> {
    // Check if date is in the past
    if (new Date(date) < new Date()) {
      return { available: false, reason: 'Cannot schedule delivery in the past' };
    }

    // Check if it's a weekend (if not allowed)
    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      const preference = preferenceId ? this.preferences.get(preferenceId) : null;
      const sundayEnabled = preference?.deliveryWindows.sunday?.enabled;
      const saturdayEnabled = preference?.deliveryWindows.saturday?.enabled;
      
      if ((dayOfWeek === 0 && !sundayEnabled) || (dayOfWeek === 6 && !saturdayEnabled)) {
        return { available: false, reason: 'Weekend deliveries not available for this preference' };
      }
    }

    // Check capacity (mock implementation)
    const currentBookings = Math.floor(Math.random() * 5);
    const maxCapacity = 5;
    
    if (currentBookings >= maxCapacity) {
      return { available: false, reason: 'Time window is fully booked' };
    }

    return { available: true };
  }

  /**
   * Get delivery statistics
   */
  async getDeliveryStatistics(dealerId: string): Promise<{
    totalScheduled: number;
    totalDelivered: number;
    totalRescheduled: number;
    totalCancelled: number;
    averageDeliveryTime: number;
    onTimeDeliveryRate: number;
  }> {
    const deliveries = Array.from(this.scheduledDeliveries.values());
    
    return {
      totalScheduled: deliveries.filter(d => d.status === 'scheduled').length,
      totalDelivered: deliveries.filter(d => d.status === 'delivered').length,
      totalRescheduled: deliveries.filter(d => d.status === 'rescheduled').length,
      totalCancelled: 0, // Would track cancelled deliveries
      averageDeliveryTime: 35, // Mock average in minutes
      onTimeDeliveryRate: 0.92, // Mock 92% on-time rate
    };
  }
}

// Export singleton instance
export const deliveryPreferenceService = new DeliveryPreferenceService();
export default deliveryPreferenceService;