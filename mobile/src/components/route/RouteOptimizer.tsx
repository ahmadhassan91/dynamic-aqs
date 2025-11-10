import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Customer {
  id: string;
  name: string;
  company: string;
  address: string;
  latitude: number;
  longitude: number;
  priority: 'high' | 'medium' | 'low';
  estimatedDuration: number;
}

interface RouteOptimizerProps {
  visible: boolean;
  customers: Customer[];
  onClose: () => void;
  onOptimizeRoute: (optimizedRoute: Customer[]) => void;
}

export default function RouteOptimizer({
  visible,
  customers,
  onClose,
  onOptimizeRoute,
}: RouteOptimizerProps) {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [optimizationCriteria, setOptimizationCriteria] = useState<'distance' | 'time' | 'priority'>('distance');

  const handleCustomerToggle = (customerId: string) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map(c => c.id));
    }
  };

  const optimizeRoute = () => {
    if (selectedCustomers.length === 0) {
      Alert.alert('Error', 'Please select at least one customer for the route.');
      return;
    }

    const selectedCustomerData = customers.filter(c => selectedCustomers.includes(c.id));
    
    // Mock route optimization algorithm
    let optimizedRoute: Customer[];
    
    switch (optimizationCriteria) {
      case 'distance':
        // Simple nearest neighbor algorithm (mock)
        optimizedRoute = optimizeByDistance(selectedCustomerData);
        break;
      case 'time':
        // Optimize by estimated visit duration
        optimizedRoute = selectedCustomerData.sort((a, b) => a.estimatedDuration - b.estimatedDuration);
        break;
      case 'priority':
        // Optimize by customer priority
        optimizedRoute = selectedCustomerData.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
        break;
      default:
        optimizedRoute = selectedCustomerData;
    }

    onOptimizeRoute(optimizedRoute);
    onClose();
  };

  const optimizeByDistance = (customers: Customer[]): Customer[] => {
    if (customers.length <= 1) return customers;

    // Simple nearest neighbor starting from first customer
    const result: Customer[] = [customers[0]];
    const remaining = customers.slice(1);

    while (remaining.length > 0) {
      const current = result[result.length - 1];
      let nearestIndex = 0;
      let nearestDistance = calculateDistance(current, remaining[0]);

      for (let i = 1; i < remaining.length; i++) {
        const distance = calculateDistance(current, remaining[i]);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      result.push(remaining[nearestIndex]);
      remaining.splice(nearestIndex, 1);
    }

    return result;
  };

  const calculateDistance = (customer1: Customer, customer2: Customer): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (customer2.latitude - customer1.latitude) * Math.PI / 180;
    const dLon = (customer2.longitude - customer1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(customer1.latitude * Math.PI / 180) * Math.cos(customer2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getTotalDistance = () => {
    if (selectedCustomers.length < 2) return 0;
    
    const selectedData = customers.filter(c => selectedCustomers.includes(c.id));
    let totalDistance = 0;
    
    for (let i = 0; i < selectedData.length - 1; i++) {
      totalDistance += calculateDistance(selectedData[i], selectedData[i + 1]);
    }
    
    return totalDistance;
  };

  const getTotalDuration = () => {
    return customers
      .filter(c => selectedCustomers.includes(c.id))
      .reduce((total, customer) => total + customer.estimatedDuration, 0);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Optimize Route</Text>
          <TouchableOpacity onPress={optimizeRoute}>
            <Text style={styles.optimizeButton}>Optimize</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Selected</Text>
            <Text style={styles.summaryValue}>{selectedCustomers.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Distance</Text>
            <Text style={styles.summaryValue}>{getTotalDistance().toFixed(1)} km</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>{getTotalDuration()} min</Text>
          </View>
        </View>

        <View style={styles.criteria}>
          <Text style={styles.criteriaTitle}>Optimization Criteria</Text>
          <View style={styles.criteriaOptions}>
            {[
              { value: 'distance', label: 'Shortest Distance', icon: 'navigate-outline' },
              { value: 'time', label: 'Shortest Time', icon: 'time-outline' },
              { value: 'priority', label: 'Customer Priority', icon: 'star-outline' },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.criteriaOption,
                  optimizationCriteria === option.value && styles.criteriaOptionActive,
                ]}
                onPress={() => setOptimizationCriteria(option.value as any)}
              >
                <Ionicons
                  name={option.icon as any}
                  size={20}
                  color={optimizationCriteria === option.value ? '#2563eb' : '#6b7280'}
                />
                <Text
                  style={[
                    styles.criteriaOptionText,
                    optimizationCriteria === option.value && styles.criteriaOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.customerSelection}>
          <View style={styles.selectionHeader}>
            <Text style={styles.selectionTitle}>Select Customers</Text>
            <TouchableOpacity onPress={handleSelectAll}>
              <Text style={styles.selectAllButton}>
                {selectedCustomers.length === customers.length ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.customerList}>
            {customers.map((customer) => (
              <TouchableOpacity
                key={customer.id}
                style={[
                  styles.customerItem,
                  selectedCustomers.includes(customer.id) && styles.customerItemSelected,
                ]}
                onPress={() => handleCustomerToggle(customer.id)}
              >
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{customer.name}</Text>
                  <Text style={styles.customerCompany}>{customer.company}</Text>
                  <Text style={styles.customerAddress}>{customer.address}</Text>
                  <View style={styles.customerMeta}>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(customer.priority) }]}>
                      <Text style={styles.priorityText}>{customer.priority.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.durationText}>{customer.estimatedDuration} min</Text>
                  </View>
                </View>
                
                <View style={styles.checkbox}>
                  {selectedCustomers.includes(customer.id) && (
                    <Ionicons name="checkmark" size={20} color="#2563eb" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  optimizeButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  criteria: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  criteriaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  criteriaOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  criteriaOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  criteriaOptionActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  criteriaOptionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  criteriaOptionTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  customerSelection: {
    flex: 1,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  selectAllButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  customerList: {
    flex: 1,
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  customerItemSelected: {
    backgroundColor: '#eff6ff',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  customerCompany: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  customerAddress: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  customerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  durationText: {
    fontSize: 12,
    color: '#6b7280',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});