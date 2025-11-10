import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../../contexts/LocationContext';

interface Customer {
  id: string;
  name: string;
  company: string;
  latitude: number;
  longitude: number;
}

interface VisitCheckInOutProps {
  visible: boolean;
  customer: Customer;
  onClose: () => void;
  onCheckIn: (location: { latitude: number; longitude: number }) => void;
  onCheckOut: (duration: number) => void;
  isCheckedIn: boolean;
  checkInTime?: Date;
}

export default function VisitCheckInOut({
  visible,
  customer,
  onClose,
  onCheckIn,
  onCheckOut,
  isCheckedIn,
  checkInTime,
}: VisitCheckInOutProps) {
  const [isVerifyingLocation, setIsVerifyingLocation] = useState(false);
  const [visitDuration, setVisitDuration] = useState(0);
  const { getCurrentLocation } = useLocation();

  useEffect(() => {
    if (isCheckedIn && checkInTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - checkInTime.getTime()) / 1000 / 60);
        setVisitDuration(duration);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCheckedIn, checkInTime]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleCheckIn = async () => {
    setIsVerifyingLocation(true);
    
    try {
      const location = await getCurrentLocation();
      
      if (!location) {
        Alert.alert('Location Error', 'Unable to get your current location. Please ensure location services are enabled.');
        setIsVerifyingLocation(false);
        return;
      }

      const distance = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        customer.latitude,
        customer.longitude
      );

      // Allow check-in within 100 meters of customer location
      if (distance > 100) {
        Alert.alert(
          'Location Verification Failed',
          `You are ${Math.round(distance)}m away from the customer location. Please move closer to check in.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Check In Anyway', 
              onPress: () => {
                onCheckIn({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                });
                onClose();
              }
            },
          ]
        );
      } else {
        onCheckIn({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        onClose();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify location. Please try again.');
    } finally {
      setIsVerifyingLocation(false);
    }
  };

  const handleCheckOut = () => {
    Alert.alert(
      'Check Out',
      `You have been at this location for ${visitDuration} minutes. Are you ready to check out?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Check Out', 
          onPress: () => {
            onCheckOut(visitDuration);
            onClose();
          }
        },
      ]
    );
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.title}>
              {isCheckedIn ? 'Check Out' : 'Check In'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.content}>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{customer.name}</Text>
              <Text style={styles.customerCompany}>{customer.company}</Text>
            </View>

            {isCheckedIn ? (
              <View style={styles.checkedInInfo}>
                <View style={styles.statusContainer}>
                  <View style={styles.statusIndicator} />
                  <Text style={styles.statusText}>Checked In</Text>
                </View>
                
                <View style={styles.durationContainer}>
                  <Ionicons name="time" size={24} color="#2563eb" />
                  <Text style={styles.durationText}>{formatDuration(visitDuration)}</Text>
                </View>
                
                {checkInTime && (
                  <Text style={styles.checkInTime}>
                    Since {checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.checkInInfo}>
                <Ionicons name="location" size={48} color="#2563eb" />
                <Text style={styles.checkInDescription}>
                  Verify your location to check in at this customer site
                </Text>
              </View>
            )}

            <View style={styles.actions}>
              {isCheckedIn ? (
                <TouchableOpacity
                  style={[styles.actionButton, styles.checkOutButton]}
                  onPress={handleCheckOut}
                >
                  <Ionicons name="log-out" size={20} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Check Out</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.actionButton, styles.checkInButton]}
                  onPress={handleCheckIn}
                  disabled={isVerifyingLocation}
                >
                  {isVerifyingLocation ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Ionicons name="log-in" size={20} color="#ffffff" />
                  )}
                  <Text style={styles.actionButtonText}>
                    {isVerifyingLocation ? 'Verifying Location...' : 'Check In'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.locationNote}>
              <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
              <Text style={styles.locationNoteText}>
                Location verification ensures accurate visit tracking
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
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
  content: {
    padding: 24,
  },
  customerInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  customerCompany: {
    fontSize: 16,
    color: '#6b7280',
  },
  checkedInInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  durationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginLeft: 8,
  },
  checkInTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  checkInInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  checkInDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  actions: {
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  checkInButton: {
    backgroundColor: '#2563eb',
  },
  checkOutButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  locationNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationNoteText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
    textAlign: 'center',
  },
});