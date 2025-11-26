import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';

let Location: any = {
  requestForegroundPermissionsAsync: async () => ({ status: 'granted' }),
  getCurrentPositionAsync: async () => ({
    coords: { latitude: 34.0522, longitude: -118.2437 }, // Mock LA coordinates
  }),
};

if (Platform.OS !== 'web') {
  try {
    Location = require('expo-location');
  } catch (e) {
    console.warn('expo-location not available');
  }
}

interface LocationContextType {
  currentLocation: any; // Location.LocationObject | null
  isLocationEnabled: boolean;
  locationPermission: any; // Location.PermissionStatus | null
  requestLocationPermission: () => Promise<boolean>;
  startLocationTracking: () => Promise<void>;
  stopLocationTracking: () => void;
  getCurrentLocation: () => Promise<any>; // Location.LocationObject | null
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [locationPermission, setLocationPermission] = useState<any>(null);
  const [locationSubscription, setLocationSubscription] = useState<any>(null);

  useEffect(() => {
    checkLocationPermission();
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      setIsLocationEnabled(status === 'granted');
    } catch (error) {
      console.warn('Error checking location permission:', error);
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      const granted = status === 'granted';
      setIsLocationEnabled(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<any> => {
    try {
      if (!isLocationEnabled) {
        const granted = await requestLocationPermission();
        if (!granted) return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  };

  const startLocationTracking = async () => {
    try {
      if (!isLocationEnabled) {
        const granted = await requestLocationPermission();
        if (!granted) return;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: 4, // Location.Accuracy.Balanced
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location: any) => {
          setCurrentLocation(location);
        }
      );
      setLocationSubscription(subscription);
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  };

  const stopLocationTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  const value: LocationContextType = {
    currentLocation,
    isLocationEnabled,
    locationPermission,
    requestLocationPermission,
    startLocationTracking,
    stopLocationTracking,
    getCurrentLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextType {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}