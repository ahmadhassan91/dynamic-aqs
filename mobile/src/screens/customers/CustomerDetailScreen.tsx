import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomerVisitModal from './CustomerVisitModal';
import CustomerInteractionHistory from '../../components/customers/CustomerInteractionHistory';
import { useOffline } from '../../contexts/OfflineContext';

interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  lastVisit?: string;
  status: 'active' | 'inactive' | 'prospect';
  notes: string;
  trainingHistory: Array<{
    id: string;
    date: string;
    type: string;
    status: 'completed' | 'scheduled' | 'cancelled';
  }>;
}

interface Interaction {
  id: string;
  type: 'visit' | 'call' | 'email' | 'training';
  title: string;
  description: string;
  timestamp: Date;
  duration?: number;
  photos?: string[];
  audioNotes?: string[];
  status?: 'completed' | 'scheduled' | 'cancelled';
}

export default function CustomerDetailScreen() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [visitModalVisible, setVisitModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const route = useRoute();
  const navigation = useNavigation();
  const { customerId } = route.params as { customerId: string };
  const { saveOfflineData, markForSync } = useOffline();

  useEffect(() => {
    loadCustomer();
    loadInteractions();
  }, [customerId]);

  const loadCustomer = async () => {
    // Mock customer data - replace with actual data loading
    const mockCustomer: Customer = {
      id: customerId,
      name: 'John Smith',
      company: 'Smith HVAC Services',
      phone: '(555) 123-4567',
      email: 'john@smithhvac.com',
      address: '123 Main St, Anytown, ST 12345',
      lastVisit: '2024-01-15',
      status: 'active',
      notes: 'Preferred customer. Always pays on time. Interested in new energy-efficient models.',
      trainingHistory: [
        {
          id: '1',
          date: '2024-01-15',
          type: 'Product Training - Heat Pumps',
          status: 'completed',
        },
        {
          id: '2',
          date: '2024-02-01',
          type: 'Sales Training - Residential',
          status: 'scheduled',
        },
      ],
    };
    setCustomer(mockCustomer);
  };

  const loadInteractions = () => {
    // Mock interaction data - replace with actual data loading
    const mockInteractions: Interaction[] = [
      {
        id: '1',
        type: 'visit',
        title: 'Training Session Completed',
        description: 'Heat pump installation training completed successfully',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        duration: 45,
        photos: ['mock-photo-1.jpg', 'mock-photo-2.jpg'],
        audioNotes: ['mock-audio-1.m4a'],
        status: 'completed',
      },
      {
        id: '2',
        type: 'call',
        title: 'Follow-up Call',
        description: 'Discussed upcoming product launch and pricing',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
        duration: 20,
        status: 'completed',
      },
      {
        id: '3',
        type: 'email',
        title: 'Product Catalog Sent',
        description: 'Sent updated product catalog and pricing sheet',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
      },
    ];
    setInteractions(mockInteractions);
  };

  const handleCall = () => {
    if (customer?.phone) {
      Linking.openURL(`tel:${customer.phone}`);
    }
  };

  const handleEmail = () => {
    if (customer?.email) {
      Linking.openURL(`mailto:${customer.email}`);
    }
  };

  const handleDirections = () => {
    if (customer?.address) {
      const encodedAddress = encodeURIComponent(customer.address);
      Linking.openURL(`maps://app?daddr=${encodedAddress}`);
    }
  };

  const handleLogVisit = () => {
    setVisitModalVisible(true);
  };

  const handleSaveVisit = async (visitData: any) => {
    try {
      // Save visit data offline
      const visitRecord = {
        id: Date.now().toString(),
        customerId: visitData.customerId,
        ...visitData,
      };

      await saveOfflineData('activities', visitRecord);
      await markForSync('activities', visitRecord.id, 'create');

      // Add to local interactions list
      const newInteraction: Interaction = {
        id: visitRecord.id,
        type: 'visit',
        title: `${visitData.visitType.replace('_', ' ')} Visit`,
        description: visitData.notes || 'Visit logged',
        timestamp: visitData.timestamp,
        duration: visitData.duration,
        photos: visitData.photos,
        audioNotes: visitData.audioNotes,
        status: 'completed',
      };

      setInteractions(prev => [newInteraction, ...prev]);
      Alert.alert('Success', 'Visit logged successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to log visit');
    }
  };

  if (!customer) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading customer details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerCompany}>{customer.company}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(customer.status) }]}>
              <Text style={styles.statusText}>{customer.status.toUpperCase()}</Text>
            </View>
          </View>
        </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <Ionicons name="call" size={24} color="#ffffff" />
          <Text style={styles.actionButtonText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
          <Ionicons name="mail" size={24} color="#ffffff" />
          <Text style={styles.actionButtonText}>Email</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleDirections}>
          <Ionicons name="navigate" size={24} color="#ffffff" />
          <Text style={styles.actionButtonText}>Directions</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleLogVisit}>
          <Ionicons name="add-circle" size={24} color="#ffffff" />
          <Text style={styles.actionButtonText}>Log Visit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History ({interactions.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'overview' && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactInfo}>
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={20} color="#6b7280" />
                <Text style={styles.contactText}>{customer.phone}</Text>
              </View>
              <View style={styles.contactRow}>
                <Ionicons name="mail-outline" size={20} color="#6b7280" />
                <Text style={styles.contactText}>{customer.email}</Text>
              </View>
              <View style={styles.contactRow}>
                <Ionicons name="location-outline" size={20} color="#6b7280" />
                <Text style={styles.contactText}>{customer.address}</Text>
              </View>
              {customer.lastVisit && (
                <View style={styles.contactRow}>
                  <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                  <Text style={styles.contactText}>Last visit: {customer.lastVisit}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{customer.notes}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Training History</Text>
            {customer.trainingHistory.map((training) => (
              <View key={training.id} style={styles.trainingItem}>
                <View style={styles.trainingHeader}>
                  <Text style={styles.trainingType}>{training.type}</Text>
                  <View style={[styles.trainingStatus, { backgroundColor: getTrainingStatusColor(training.status) }]}>
                    <Text style={styles.trainingStatusText}>{training.status.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.trainingDate}>{training.date}</Text>
              </View>
            ))}
          </View>
        </>
      )}
      </ScrollView>

      {activeTab === 'history' && (
        <CustomerInteractionHistory
          customerId={customerId}
          interactions={interactions}
        />
      )}

      <CustomerVisitModal
        visible={visitModalVisible}
        customerId={customerId}
        customerName={customer.name}
        onClose={() => setVisitModalVisible(false)}
        onSave={handleSaveVisit}
      />
    </View>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return '#10b981';
    case 'inactive': return '#ef4444';
    case 'prospect': return '#f59e0b';
    default: return '#6b7280';
  }
};

const getTrainingStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return '#10b981';
    case 'scheduled': return '#3b82f6';
    case 'cancelled': return '#ef4444';
    default: return '#6b7280';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  customerInfo: {
    alignItems: 'center',
  },
  customerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  customerCompany: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 70,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  contactInfo: {
    gap: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  notesText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  trainingItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 12,
    marginBottom: 12,
  },
  trainingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  trainingType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  trainingStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trainingStatusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  trainingDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#2563eb',
  },
});