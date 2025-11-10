import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RouteOptimizer from '../../components/route/RouteOptimizer';
import VisitCheckInOut from '../../components/route/VisitCheckInOut';

interface RouteStop {
  id: string;
  customerId: string;
  customerName: string;
  company: string;
  address: string;
  estimatedTime: string;
  duration: string;
  status: 'pending' | 'completed' | 'skipped';
  notes?: string;
  latitude: number;
  longitude: number;
  priority: 'high' | 'medium' | 'low';
  estimatedDuration: number;
}

export default function RouteScreen() {
  const [routeStops, setRouteStops] = useState<RouteStop[]>([
    {
      id: '1',
      customerId: '1',
      customerName: 'John Smith',
      company: 'Smith HVAC Services',
      address: '123 Main St, Anytown, ST 12345',
      estimatedTime: '9:00 AM',
      duration: '45 min',
      status: 'pending',
      latitude: 39.8283,
      longitude: -98.5795,
      priority: 'high',
      estimatedDuration: 45,
    },
    {
      id: '2',
      customerId: '2',
      customerName: 'Sarah Johnson',
      company: 'Johnson Heating & Cooling',
      address: '456 Oak Ave, Somewhere, ST 67890',
      estimatedTime: '10:30 AM',
      duration: '30 min',
      status: 'pending',
      latitude: 39.9283,
      longitude: -98.4795,
      priority: 'medium',
      estimatedDuration: 30,
    },
    {
      id: '3',
      customerId: '3',
      customerName: 'Mike Wilson',
      company: 'Wilson Air Solutions',
      address: '789 Pine Rd, Elsewhere, ST 54321',
      estimatedTime: '12:00 PM',
      duration: '60 min',
      status: 'pending',
      latitude: 39.7283,
      longitude: -98.6795,
      priority: 'low',
      estimatedDuration: 60,
    },
  ]);
  
  const [routeOptimizerVisible, setRouteOptimizerVisible] = useState(false);
  const [visitModalVisible, setVisitModalVisible] = useState(false);
  const [selectedStop, setSelectedStop] = useState<RouteStop | null>(null);
  const [checkedInStop, setCheckedInStop] = useState<string | null>(null);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);

  const handleStartRoute = () => {
    const firstPendingStop = routeStops.find(stop => stop.status === 'pending');
    if (!firstPendingStop) {
      Alert.alert('No Stops', 'No pending stops in your route.');
      return;
    }

    Alert.alert(
      'Start Route',
      `Navigate to ${firstPendingStop.customerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Navigate', onPress: () => handleNavigateToStop(firstPendingStop) },
      ]
    );
  };

  const handleNavigateToStop = (stop: RouteStop) => {
    const url = `maps://app?daddr=${stop.latitude},${stop.longitude}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback to Google Maps web
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${stop.latitude},${stop.longitude}`;
        Linking.openURL(googleMapsUrl);
      }
    });
  };

  const handleOptimizeRoute = (optimizedCustomers: any[]) => {
    // Convert optimized customers back to route stops
    const optimizedStops = optimizedCustomers.map((customer, index) => {
      const existingStop = routeStops.find(stop => stop.customerId === customer.id);
      const baseTime = new Date();
      baseTime.setHours(9, 0, 0, 0); // Start at 9 AM
      baseTime.setMinutes(baseTime.getMinutes() + (index * 90)); // 90 minutes between stops
      
      return {
        ...existingStop,
        id: customer.id,
        customerId: customer.id,
        customerName: customer.name,
        company: customer.company,
        address: customer.address,
        estimatedTime: baseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: `${customer.estimatedDuration} min`,
        status: 'pending' as const,
        latitude: customer.latitude,
        longitude: customer.longitude,
        priority: customer.priority,
        estimatedDuration: customer.estimatedDuration,
      };
    });
    
    setRouteStops(optimizedStops);
  };

  const handleCheckIn = (stop: RouteStop, location: { latitude: number; longitude: number }) => {
    setCheckedInStop(stop.id);
    setCheckInTime(new Date());
    Alert.alert('Success', `Checked in at ${stop.company}`);
  };

  const handleCheckOut = (duration: number) => {
    if (checkedInStop) {
      handleCompleteStop(checkedInStop);
      setCheckedInStop(null);
      setCheckInTime(null);
      Alert.alert('Success', `Visit completed after ${duration} minutes`);
    }
  };

  const handleCompleteStop = (stopId: string) => {
    setRouteStops(prev =>
      prev.map(stop =>
        stop.id === stopId ? { ...stop, status: 'completed' } : stop
      )
    );
  };

  const handleSkipStop = (stopId: string) => {
    Alert.alert(
      'Skip Stop',
      'Are you sure you want to skip this customer visit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => {
            setRouteStops(prev =>
              prev.map(stop =>
                stop.id === stopId ? { ...stop, status: 'skipped' } : stop
              )
            );
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'skipped': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'skipped': return 'close-circle';
      case 'pending': return 'time';
      default: return 'help-circle';
    }
  };

  const renderRouteStop = ({ item, index }: { item: RouteStop; index: number }) => (
    <View style={styles.stopCard}>
      <View style={styles.stopHeader}>
        <View style={styles.stopNumber}>
          <Text style={styles.stopNumberText}>{index + 1}</Text>
        </View>
        <View style={styles.stopInfo}>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Text style={styles.company}>{item.company}</Text>
          <Text style={styles.address}>{item.address}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Ionicons
            name={getStatusIcon(item.status) as any}
            size={24}
            color={getStatusColor(item.status)}
          />
        </View>
      </View>

      <View style={styles.stopDetails}>
        <View style={styles.timeInfo}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={styles.timeText}>{item.estimatedTime}</Text>
          <Text style={styles.durationText}>({item.duration})</Text>
        </View>
      </View>

      {item.status === 'pending' && (
        <View style={styles.stopActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.navigateButton]}
            onPress={() => handleNavigateToStop(item)}
          >
            <Ionicons name="navigate" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Navigate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.checkInButton]}
            onPress={() => {
              setSelectedStop(item);
              setVisitModalVisible(true);
            }}
          >
            <Ionicons name="location" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>
              {checkedInStop === item.id ? 'Check Out' : 'Check In'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.skipButton]}
            onPress={() => handleSkipStop(item.id)}
          >
            <Ionicons name="close" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const completedStops = routeStops.filter(stop => stop.status === 'completed').length;
  const totalStops = routeStops.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Route</Text>
        <Text style={styles.progress}>
          {completedStops} of {totalStops} stops completed
        </Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.optimizeButton} 
            onPress={() => setRouteOptimizerVisible(true)}
          >
            <Ionicons name="analytics" size={20} color="#2563eb" />
            <Text style={styles.optimizeButtonText}>Optimize</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.startButton} onPress={handleStartRoute}>
            <Ionicons name="navigate" size={20} color="#ffffff" />
            <Text style={styles.startButtonText}>Start Route</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={routeStops}
        renderItem={renderRouteStop}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <RouteOptimizer
        visible={routeOptimizerVisible}
        customers={routeStops.map(stop => ({
          id: stop.customerId,
          name: stop.customerName,
          company: stop.company,
          address: stop.address,
          latitude: stop.latitude,
          longitude: stop.longitude,
          priority: stop.priority,
          estimatedDuration: stop.estimatedDuration,
        }))}
        onClose={() => setRouteOptimizerVisible(false)}
        onOptimizeRoute={handleOptimizeRoute}
      />

      {selectedStop && (
        <VisitCheckInOut
          visible={visitModalVisible}
          customer={{
            id: selectedStop.customerId,
            name: selectedStop.customerName,
            company: selectedStop.company,
            latitude: selectedStop.latitude,
            longitude: selectedStop.longitude,
          }}
          onClose={() => setVisitModalVisible(false)}
          onCheckIn={(location) => handleCheckIn(selectedStop, location)}
          onCheckOut={handleCheckOut}
          isCheckedIn={checkedInStop === selectedStop.id}
          checkInTime={checkInTime}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  progress: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  optimizeButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  optimizeButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  startButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  listContainer: {
    padding: 16,
  },
  stopCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stopNumber: {
    backgroundColor: '#2563eb',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stopNumberText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stopInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  company: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#9ca3af',
  },
  statusContainer: {
    marginLeft: 12,
  },
  stopDetails: {
    marginBottom: 12,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  durationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  stopActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 6,
  },
  navigateButton: {
    backgroundColor: '#2563eb',
  },
  checkInButton: {
    backgroundColor: '#10b981',
  },
  skipButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});