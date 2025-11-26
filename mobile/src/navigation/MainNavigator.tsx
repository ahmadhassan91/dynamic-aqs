import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import CustomersScreen from '../screens/customers/CustomersScreen';
import CustomerDetailScreen from '../screens/customers/CustomerDetailScreen';
import TrainingScreen from '../screens/training/TrainingScreen';
import ActivitiesScreen from '../screens/activities/ActivitiesScreen';
import MapScreen from '../screens/map/MapScreen';
import RouteScreen from '../screens/route/RouteScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SyncScreen from '../screens/sync/SyncScreen';

export type MainTabParamList = {
  Dashboard: undefined;
  CustomersTab: undefined;
  Training: undefined;
  Activities: undefined;
  Profile: undefined;
};

export type CustomersStackParamList = {
  CustomersList: undefined;
  CustomerDetail: { customerId: string };
  Sync: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const CustomersStack = createStackNavigator<CustomersStackParamList>();

function CustomersNavigator() {
  return (
    <CustomersStack.Navigator>
      <CustomersStack.Screen 
        name="CustomersList" 
        component={CustomersScreen}
        options={{ title: 'Customers' }}
      />
      <CustomersStack.Screen 
        name="CustomerDetail" 
        component={CustomerDetailScreen}
        options={{ title: 'Customer Details' }}
      />
      <CustomersStack.Screen 
        name="Sync" 
        component={SyncScreen}
        options={{ title: 'Sync Data' }}
      />
    </CustomersStack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CustomersTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Training') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'Activities') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="CustomersTab" 
        component={CustomersNavigator}
        options={{ title: 'Customers' }}
      />
      <Tab.Screen 
        name="Training" 
        component={TrainingScreen}
        options={{ title: 'Training' }}
      />
      <Tab.Screen 
        name="Activities" 
        component={ActivitiesScreen}
        options={{ title: 'Activities' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}