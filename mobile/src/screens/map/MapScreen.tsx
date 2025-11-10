import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker, Region, Polyline, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../../contexts/LocationContext';
import RouteOptimizer from '../../components/route/RouteOptimizer';
import VisitCheckInOut from '../../components/route/VisitCheckInOut';

interface CustomerLocation {
  id: string;
  name: string;
  company: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive' | 'prospect';
  priority: 'high' | 'medium' | 'low';
  estimatedDuration: number;
  address: string;
}

interface RoutePoint {
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const [customers, setCustomers] = useState<CustomerLocation[]>([]);
  const [region, setRegion] = useState<Region>({
    latitude: 39.8283,
    longitude: -98.5795,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerLocation | null>(null);
  const [routeOptimizerVisible, setRouteOptimizerVisible] = useState(false);
  const [visitModalVisible, setVisitModalVisible] = useState(false);
  const [optimizedRoute, setOptimizedRoute] = useState<CustomerLocation[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<RoutePoint[]>([]);
  const [checkedInCustomer, setCheckedInCustomer] = useState<string | null>(null);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  
  const { currentLocation, requestLocationPermission, getCurrentLocation } = useLocation();

  useEffect(() => {
    loadCustomerLocations();
    handleLocationPermission();
  }, []);

  const handleLocationPermission = async () => {
    const granted = await requestLocationPermission();
    if (granted) {
      const location = await getCurrentLocation();
      if (location) {
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      }
    }
  };

  const loadCustomerLocations = () => {
    // Mock customer locations - replace with actual data
    const mockCustomers: CustomerLocation[] = [
      {
        id: '1',
        name: 'John Smith',
        company: 'Smith HVAC Services',
        latitude: 39.8283,
        longitude: -98.5795,
        status: 'active',
        priority: 'high',
        estimatedDuration: 45,
        address: '123 Main St, Anytown, ST 12345',
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        company: 'Johnson Heating & Cooling',
        latitude: 39.9283,
        longitude: -98.4795,
        status: 'active',
        priority: 'medium',
        estimatedDuration: 30,
        address: '456 Oak Ave, Somewhere, ST 67890',
      },
      {
        id: '3',
        name: 'Mike Wilson',
        company: 'Wilson Air Solutions',
        latitude: 39.7283,
        longitude: -98.6795,
        status: 'prospect',
        priority: 'low',
        estimatedDuration: 60,
        address: '789 Pine Rd, Elsewhere, ST 54321',
      },
      {
        id: '4',
        name: 'Lisa Brown',
        company: 'Brown Climate Control',
        latitude: 39.8583,
        longitude: -98.5295,
        status: 'active',
        priority: 'high',
        estimatedDuration: 40,
        address: '321 Elm St, Newtown, ST 54321',
      },
    ];
    setCustomers(mockCustomers);
  };

  const centerOnCurrentLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    } else {
      Alert.alert('Location Error', 'Unable to get current location');
    }
  };

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#ef4444';
      case 'prospect': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const handleOptimizeRoute = (route: CustomerLocation[]) => {
    setOptimizedRoute(route);
    generateRouteCoordinates(route);
  };

  const generateRouteCoordinates = (route: CustomerLocation[]) => {
    // Simple straight-line connections between points
    // In a real app, you'd use a routing service like Google Directions API
    const coordinates: RoutePoint[] = [];
    
    if (currentLocation) {
      coordinates.push({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    }
    
    route.forEach(customer => {
      coordinates.push({
        latitude: customer.latitude,
        longitude: customer.longitude,
      });
    });
    
    setRouteCoordinates(coordinates);
  };

  const handleNavigateToCustomer = (customer: CustomerLocation) => {
    const url = `maps://app?daddr=${customer.latitude},${customer.longitude}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback to Google Maps web
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${customer.latitude},${customer.longitude}`;
        Linking.openURL(googleMapsUrl);
      }
    });
  };

  const handleMarkerPress = (customer: CustomerLocation) => {
    setSelectedCustomer(customer);
  };

  const handleCheckIn = (customer: CustomerLocation, location: { latitude: number; longitude: number }) => {
    setCheckedInCustomer(customer.id);
    setCheckInTime(new Date());
    Alert.alert('Success', `Checked in at ${customer.company}`);
  };

  const handleCheckOut = (duration: number) => {
    if (checkedInCustomer) {
      setCheckedInCustomer(null);
      setCheckInTime(null);
      Alert.alert('Success', `Checked out after ${duration} minutes`);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {customers.map((customer) => (
          <Marker
            key={customer.id}
            coordinate={{
              latitude: customer.latitude,
              longitude: customer.longitude,
            }}
            pinColor={getMarkerColor(customer.status)}
            onPress={() => handleMarkerPress(customer)}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{customer.name}</Text>
                <Text style={styles.calloutSubtitle}>{customer.company}</Text>
                <Text style={styles.calloutAddress}>{customer.address}</Text>
                <View style={styles.calloutActions}>
                  <TouchableOpacity
                    style={styles.calloutButton}
                    onPress={() => handleNavigateToCustomer(customer)}
                  >
                    <Ionicons name="navigate" size={16} color="#2563eb" />
                    <Text style={styles.calloutButtonText}>Navigate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.calloutButton}
                    onPress={() => {
                      setSelectedCustomer(customer);
                      setVisitModalVisible(true);
                    }}
                  >
                    <Ionicons name="location" size={16} color="#2563eb" />
                    <Text style={styles.calloutButtonText}>
                      {checkedInCustomer === customer.id ? 'Check Out' : 'Check In'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
        
        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#2563eb"
            strokeWidth={3}
            lineDashPattern={[5, 5]}
          />
        )}
      </MapView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={centerOnCurrentLocation}
        >
          <Ionicons name="locate" size={24} color="#2563eb" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setRouteOptimizerVisible(true)}
        >
          <Ionicons name="map" size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>
          {optimizedRoute.length > 0 ? `Route (${optimizedRoute.length} stops)` : 'Customer Status'}
        </Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
            <Text style={styles.legendText}>Active</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.legendText}>Prospect</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.legendText}>Inactive</Text>
          </View>
        </View>
        {optimizedRoute.length > 0 && (
          <TouchableOpacity
            style={styles.clearRouteButton}
            onPress={() => {
              setOptimizedRoute([]);
              setRouteCoordinates([]);
            }}
          >
            <Text style={styles.clearRouteText}>Clear Route</Text>
          </TouchableOpacity>
        )}
      </View>

      <RouteOptimizer
        visible={routeOptimizerVisible}
        customers={customers}
        onClose={() => setRouteOptimizerVisible(false)}
        onOptimizeRoute={handleOptimizeRoute}
      />

      {selectedCustomer && (
        <VisitCheckInOut
          visible={visitModalVisible}
          customer={selectedCustomer}
          onClose={() => setVisitModalVisible(false)}
          onCheckIn={(location) => handleCheckIn(selectedCustomer, location)}
          onCheckOut={handleCheckOut}
          isCheckedIn={checkedInCustomer === selectedCustomer.id}
          checkInTime={checkInTime}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: 50,
    right: 16,
    gap: 12,
  },
  controlButton: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  legend: {
    position: 'absolute',
    bottom: 50,
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#6b7280',
  },
  calloutContainer: {
    width: 200,
    padding: 8,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  calloutSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  calloutAddress: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  calloutActions: {
    flexDirection: 'row',
    gap: 8,
  },
  calloutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  calloutButtonText: {
    fontSize: 12,
    color: '#2563eb',
    marginLeft: 4,
  },
  clearRouteButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  clearRouteText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
});