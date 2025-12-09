import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Alert,
  Dimensions,
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface OrderAlert {
  id: string;
  customer: string;
  type: 'new_order' | 'order_frequency' | 'no_order';
  message: string;
  orderValue?: string;
  daysInactive?: number;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

interface CalendarEvent {
  id: string;
  title: string;
  customer: string;
  type: 'training' | 'visit' | 'call';
  time: string;
  duration: string;
}

interface StatCard {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
}

interface ActivityLog {
  type: 'call' | 'visit' | 'email' | 'meeting';
  customer: string;
  notes: string;
  duration?: string;
}

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [quickTrainingModalVisible, setQuickTrainingModalVisible] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  // New modal states
  const [logActivityModalVisible, setLogActivityModalVisible] = useState(false);
  const [voiceNoteModalVisible, setVoiceNoteModalVisible] = useState(false);
  const [planRouteModalVisible, setPlanRouteModalVisible] = useState(false);

  // Activity logging state
  const [selectedActivityType, setSelectedActivityType] = useState<'call' | 'visit' | 'email' | 'meeting'>('call');
  const [selectedCustomerForActivity, setSelectedCustomerForActivity] = useState<string>('');
  const [activityNotes, setActivityNotes] = useState('');
  const [activityDuration, setActivityDuration] = useState('30');

  // Voice note state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceNoteCustomer, setVoiceNoteCustomer] = useState<string>('');

  // Route planning state
  const [selectedStops, setSelectedStops] = useState<string[]>([]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  // Order Alerts
  const orderAlerts: OrderAlert[] = [
    {
      id: '1',
      customer: 'Summit HVAC',
      type: 'new_order',
      message: 'New order received',
      orderValue: '$12,450',
      timestamp: '5 min ago',
      priority: 'high',
    },
    {
      id: '2',
      customer: 'Valley Heating',
      type: 'order_frequency',
      message: 'Order frequency dropped 40%',
      daysInactive: 15,
      timestamp: '1 hour ago',
      priority: 'medium',
    },
    {
      id: '3',
      customer: 'Peak Distributors',
      type: 'no_order',
      message: 'No orders in 45 days',
      daysInactive: 45,
      timestamp: '2 hours ago',
      priority: 'high',
    },
    {
      id: '4',
      customer: 'Mountain Air Co',
      type: 'new_order',
      message: 'New order received',
      orderValue: '$8,200',
      timestamp: '3 hours ago',
      priority: 'medium',
    },
  ];

  // Today's Calendar
  const todayCalendar: CalendarEvent[] = [
    { id: '1', title: 'Product Training', customer: 'Summit HVAC', type: 'training', time: '9:00 AM', duration: '2 hrs' },
    { id: '2', title: 'Site Visit', customer: 'Valley Heating', type: 'visit', time: '11:30 AM', duration: '1 hr' },
    { id: '3', title: 'Follow-up Call', customer: 'Peak Distributors', type: 'call', time: '2:00 PM', duration: '30 min' },
    { id: '4', title: 'Technical Training', customer: 'Ridge Supply', type: 'training', time: '3:30 PM', duration: '1.5 hrs' },
  ];

  // Customers needing training
  const customersNeedingTraining = [
    { id: '1', name: 'Summit HVAC', lastTraining: '45 days ago', type: 'Product Training' },
    { id: '2', name: 'Peak Distributors', lastTraining: '30 days ago', type: 'Technical Training' },
    { id: '3', name: 'Ridge Supply', lastTraining: '60 days ago', type: 'Sales Training' },
  ];

  const stats: StatCard[] = [
    { label: 'My Customers', value: '125', icon: 'people-outline', color: '#3b82f6', bgColor: '#eff6ff' },
    { label: 'Trainings (Month)', value: '12', icon: 'school-outline', color: '#10b981', bgColor: '#ecfdf5' },
    { label: 'Revenue (QTR)', value: '$245K', icon: 'trending-up-outline', color: '#f59e0b', bgColor: '#fffbeb' },
    { label: 'Activities (Week)', value: '15', icon: 'calendar-outline', color: '#8b5cf6', bgColor: '#f5f3ff' },
  ];

  const upcomingTrainings = [
    { id: '1', customer: 'Summit HVAC', date: 'Tomorrow', time: '10:00 AM', type: 'Product Training' },
    { id: '2', customer: 'Peak Distributors', date: 'Dec 2', time: '2:00 PM', type: 'Technical Training' },
    { id: '3', customer: 'Ridge Supply', date: 'Dec 5', time: '9:00 AM', type: 'Sales Training' },
  ];

  const getAlertIcon = (type: OrderAlert['type']): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'new_order': return 'cart-outline';
      case 'order_frequency': return 'trending-down-outline';
      case 'no_order': return 'alert-circle-outline';
      default: return 'information-circle-outline';
    }
  };

  const getAlertColor = (priority: OrderAlert['priority']) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#2563eb';
      default: return '#64748b';
    }
  };

  const getCalendarIcon = (type: CalendarEvent['type']): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'training': return 'school-outline';
      case 'visit': return 'business-outline';
      case 'call': return 'call-outline';
      default: return 'calendar-outline';
    }
  };

  const getCalendarColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'training': return '#059669';
      case 'visit': return '#2563eb';
      case 'call': return '#d97706';
      default: return '#64748b';
    }
  };

  const handleQuickTrainingComplete = (customerId: string, customerName: string) => {
    Alert.alert(
      'Complete Training',
      `Mark training complete for ${customerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => {
            Alert.alert('Success', `Training for ${customerName} marked as complete!`);
            setQuickTrainingModalVisible(false);
          },
        },
      ]
    );
  };

  const handleAlertAction = (alert: OrderAlert) => {
    if (alert.type === 'new_order') {
      Alert.alert('New Order', `Order from ${alert.customer}: ${alert.orderValue}`);
    } else {
      Alert.alert('Action Needed', `Schedule a call with ${alert.customer}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Schedule', onPress: () => Alert.alert('Scheduled', 'Call scheduled for tomorrow') },
      ]);
    }
  };

  // Customer list for activities
  const customerList = [
    { id: '1', name: 'Summit HVAC', address: '123 Main St, Denver, CO' },
    { id: '2', name: 'Valley Heating', address: '456 Oak Ave, Boulder, CO' },
    { id: '3', name: 'Peak Distributors', address: '789 Pine Rd, Aurora, CO' },
    { id: '4', name: 'Mountain Air Co', address: '321 Elm St, Lakewood, CO' },
    { id: '5', name: 'Ridge Supply', address: '654 Cedar Ln, Arvada, CO' },
  ];

  // Activity types
  const activityTypes = [
    { type: 'call' as const, label: 'Phone Call', icon: 'call-outline' as const, color: '#2563eb' },
    { type: 'visit' as const, label: 'Site Visit', icon: 'business-outline' as const, color: '#059669' },
    { type: 'email' as const, label: 'Email', icon: 'mail-outline' as const, color: '#d97706' },
    { type: 'meeting' as const, label: 'Meeting', icon: 'people-outline' as const, color: '#7c3aed' },
  ];

  // Log Activity Handler
  const handleLogActivity = () => {
    if (!selectedCustomerForActivity) {
      Alert.alert('Select Customer', 'Please select a customer for this activity.');
      return;
    }
    Alert.alert(
      'Activity Logged!',
      `${activityTypes.find(a => a.type === selectedActivityType)?.label} with ${selectedCustomerForActivity} logged successfully.\n\nDuration: ${activityDuration} min\nNotes: ${activityNotes || 'No notes'}`,
      [{ text: 'OK', onPress: () => {
        setLogActivityModalVisible(false);
        setSelectedCustomerForActivity('');
        setActivityNotes('');
        setActivityDuration('30');
      }}]
    );
  };

  // Voice Note Handlers
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    // Simulate recording timer
    const interval = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 60) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    Alert.alert(
      'Voice Note Saved!',
      `Voice note (${recordingTime}s) saved${voiceNoteCustomer ? ` for ${voiceNoteCustomer}` : ''}.`,
      [{ text: 'OK', onPress: () => {
        setVoiceNoteModalVisible(false);
        setRecordingTime(0);
        setVoiceNoteCustomer('');
      }}]
    );
  };

  // Route Planning Handlers
  const toggleStopSelection = (customerId: string) => {
    setSelectedStops((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleOptimizeRoute = () => {
    if (selectedStops.length < 2) {
      Alert.alert('Select Stops', 'Please select at least 2 stops to plan a route.');
      return;
    }
    const selectedCustomers = customerList.filter(c => selectedStops.includes(c.id));
    Alert.alert(
      'Route Optimized!',
      `Your optimized route includes ${selectedStops.length} stops:\n\n${selectedCustomers.map((c, i) => `${i + 1}. ${c.name}`).join('\n')}\n\nEstimated drive time: ${selectedStops.length * 15} minutes`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open in Maps', 
          onPress: () => {
            // Open first stop in maps as demo
            const firstStop = selectedCustomers[0];
            const url = Platform.OS === 'ios' 
              ? `maps://maps.apple.com/?address=${encodeURIComponent(firstStop.address)}`
              : `geo:0,0?q=${encodeURIComponent(firstStop.address)}`;
            Linking.openURL(url).catch(() => {
              Alert.alert('Maps', 'Unable to open maps application');
            });
            setPlanRouteModalVisible(false);
            setSelectedStops([]);
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.userName}>Sarah Wilson</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#1e293b" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>4</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.territoryName}>Colorado Territory</Text>
        </View>

        {/* Order Alerts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.alertIconBg}>
                <Ionicons name="notifications" size={16} color="#dc2626" />
              </View>
              <Text style={styles.sectionTitle}>Order Alerts</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{orderAlerts.length}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setShowAllAlerts(!showAllAlerts)}>
              <Text style={styles.seeAllLink}>{showAllAlerts ? 'Show Less' : 'See All'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.alertsContainer}>
            {(showAllAlerts ? orderAlerts : orderAlerts.slice(0, 2)).map((alert) => (
              <TouchableOpacity
                key={alert.id}
                style={styles.alertCard}
                onPress={() => handleAlertAction(alert)}
                activeOpacity={0.7}
              >
                <View style={[styles.alertIconContainer, { backgroundColor: `${getAlertColor(alert.priority)}15` }]}>
                  <Ionicons name={getAlertIcon(alert.type)} size={20} color={getAlertColor(alert.priority)} />
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertCustomer}>{alert.customer}</Text>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  {alert.orderValue && (
                    <Text style={[styles.alertHighlight, { color: '#059669' }]}>{alert.orderValue}</Text>
                  )}
                  {alert.daysInactive && (
                    <Text style={[styles.alertHighlight, { color: '#dc2626' }]}>{alert.daysInactive} days inactive</Text>
                  )}
                </View>
                <View style={styles.alertMeta}>
                  <Text style={styles.alertTime}>{alert.timestamp}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Today's Schedule Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.alertIconBg, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name="calendar" size={16} color="#2563eb" />
              </View>
              <Text style={styles.sectionTitle}>Today's Schedule</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>Full Calendar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarScrollContent}
          >
            {todayCalendar.map((event, index) => (
              <TouchableOpacity
                key={event.id}
                style={[
                  styles.calendarCard,
                  index === 0 && styles.calendarCardFirst,
                ]}
                activeOpacity={0.7}
              >
                <View style={[styles.calendarCardAccent, { backgroundColor: getCalendarColor(event.type) }]} />
                <View style={styles.calendarCardContent}>
                  <View style={[styles.calendarIconContainer, { backgroundColor: `${getCalendarColor(event.type)}15` }]}>
                    <Ionicons name={getCalendarIcon(event.type)} size={18} color={getCalendarColor(event.type)} />
                  </View>
                  <Text style={styles.calendarTime}>{event.time}</Text>
                  <Text style={styles.calendarTitle}>{event.title}</Text>
                  <Text style={styles.calendarCustomer}>{event.customer}</Text>
                  <View style={styles.calendarDurationContainer}>
                    <Ionicons name="time-outline" size={12} color="#64748b" />
                    <Text style={styles.calendarDuration}>{event.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <TouchableOpacity key={index} style={styles.statCard} activeOpacity={0.7}>
                <View style={[styles.statIconContainer, { backgroundColor: stat.bgColor }]}>
                  <Ionicons name={stat.icon} size={22} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard} 
              activeOpacity={0.7}
              onPress={() => setLogActivityModalVisible(true)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name="add-circle-outline" size={24} color="#2563eb" />
              </View>
              <Text style={styles.quickActionText}>Log Activity</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionCard, styles.quickActionCardPrimary]}
              activeOpacity={0.7}
              onPress={() => setQuickTrainingModalVisible(true)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#ffffff" />
              </View>
              <Text style={[styles.quickActionText, styles.quickActionTextPrimary]}>Complete Training</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard} 
              activeOpacity={0.7}
              onPress={() => setVoiceNoteModalVisible(true)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="mic-outline" size={24} color="#d97706" />
              </View>
              <Text style={styles.quickActionText}>Voice Note</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard} 
              activeOpacity={0.7}
              onPress={() => setPlanRouteModalVisible(true)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#f3e8ff' }]}>
                <Ionicons name="navigate-outline" size={24} color="#7c3aed" />
              </View>
              <Text style={styles.quickActionText}>Plan Route</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Trainings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Trainings</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>

          {upcomingTrainings.map((training) => (
            <TouchableOpacity key={training.id} style={styles.trainingCard} activeOpacity={0.7}>
              <View style={styles.trainingIconContainer}>
                <Ionicons name="school-outline" size={20} color="#059669" />
              </View>
              <View style={styles.trainingContent}>
                <Text style={styles.trainingCustomer}>{training.customer}</Text>
                <Text style={styles.trainingType}>{training.type}</Text>
              </View>
              <View style={styles.trainingMeta}>
                <Text style={styles.trainingDate}>{training.date}</Text>
                <Text style={styles.trainingTime}>{training.time}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Quick Training Complete Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={quickTrainingModalVisible}
        onRequestClose={() => setQuickTrainingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <View style={[styles.modalIconBg, { backgroundColor: '#ecfdf5' }]}>
                  <Ionicons name="checkmark-circle" size={24} color="#059669" />
                </View>
                <Text style={styles.modalTitle}>Quick Training Complete</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setQuickTrainingModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Select a customer to mark training complete:</Text>

            <ScrollView style={styles.modalList}>
              {customersNeedingTraining.map((customer) => (
                <TouchableOpacity
                  key={customer.id}
                  style={styles.customerSelectCard}
                  onPress={() => handleQuickTrainingComplete(customer.id, customer.name)}
                  activeOpacity={0.7}
                >
                  <View style={styles.customerSelectContent}>
                    <Text style={styles.customerSelectName}>{customer.name}</Text>
                    <Text style={styles.customerSelectMeta}>
                      {customer.type} • Last: {customer.lastTraining}
                    </Text>
                  </View>
                  <View style={styles.customerSelectAction}>
                    <Ionicons name="checkmark-circle-outline" size={28} color="#059669" />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Log Activity Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={logActivityModalVisible}
        onRequestClose={() => setLogActivityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <View style={[styles.modalIconBg, { backgroundColor: '#eff6ff' }]}>
                  <Ionicons name="add-circle" size={24} color="#2563eb" />
                </View>
                <Text style={styles.modalTitle}>Log Activity</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setLogActivityModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Select activity type:</Text>
            <View style={styles.activityTypeGrid}>
              {activityTypes.map((activity) => (
                <TouchableOpacity
                  key={activity.type}
                  style={[
                    styles.activityTypeButton,
                    selectedActivityType === activity.type && styles.activityTypeButtonSelected,
                  ]}
                  onPress={() => setSelectedActivityType(activity.type)}
                >
                  <Ionicons 
                    name={activity.icon} 
                    size={24} 
                    color={selectedActivityType === activity.type ? '#ffffff' : activity.color} 
                  />
                  <Text style={[
                    styles.activityTypeLabel,
                    selectedActivityType === activity.type && styles.activityTypeLabelSelected,
                  ]}>{activity.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSubtitle}>Select customer:</Text>
            <ScrollView style={styles.customerScrollList} nestedScrollEnabled>
              {customerList.map((customer) => (
                <TouchableOpacity
                  key={customer.id}
                  style={[
                    styles.customerSelectCard,
                    selectedCustomerForActivity === customer.name && styles.customerSelectCardSelected,
                  ]}
                  onPress={() => setSelectedCustomerForActivity(customer.name)}
                >
                  <View style={styles.customerSelectContent}>
                    <Text style={styles.customerSelectName}>{customer.name}</Text>
                    <Text style={styles.customerSelectMeta}>{customer.address}</Text>
                  </View>
                  {selectedCustomerForActivity === customer.name && (
                    <Ionicons name="checkmark-circle" size={24} color="#2563eb" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.modalSubtitle}>Duration (minutes):</Text>
            <View style={styles.durationRow}>
              {['15', '30', '45', '60', '90'].map((dur) => (
                <TouchableOpacity
                  key={dur}
                  style={[
                    styles.durationButton,
                    activityDuration === dur && styles.durationButtonSelected,
                  ]}
                  onPress={() => setActivityDuration(dur)}
                >
                  <Text style={[
                    styles.durationButtonText,
                    activityDuration === dur && styles.durationButtonTextSelected,
                  ]}>{dur}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSubtitle}>Notes (optional):</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add notes about this activity..."
              placeholderTextColor="#94a3b8"
              value={activityNotes}
              onChangeText={setActivityNotes}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleLogActivity}>
              <Ionicons name="checkmark" size={20} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Log Activity</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Voice Note Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={voiceNoteModalVisible}
        onRequestClose={() => setVoiceNoteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <View style={[styles.modalIconBg, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="mic" size={24} color="#d97706" />
                </View>
                <Text style={styles.modalTitle}>Voice Note</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setVoiceNoteModalVisible(false);
                  setIsRecording(false);
                  setRecordingTime(0);
                }}
              >
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Attach to customer (optional):</Text>
            <ScrollView style={styles.customerScrollListSmall} nestedScrollEnabled horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.customerChip,
                  !voiceNoteCustomer && styles.customerChipSelected,
                ]}
                onPress={() => setVoiceNoteCustomer('')}
              >
                <Text style={[styles.customerChipText, !voiceNoteCustomer && styles.customerChipTextSelected]}>General</Text>
              </TouchableOpacity>
              {customerList.map((customer) => (
                <TouchableOpacity
                  key={customer.id}
                  style={[
                    styles.customerChip,
                    voiceNoteCustomer === customer.name && styles.customerChipSelected,
                  ]}
                  onPress={() => setVoiceNoteCustomer(customer.name)}
                >
                  <Text style={[
                    styles.customerChipText,
                    voiceNoteCustomer === customer.name && styles.customerChipTextSelected,
                  ]}>{customer.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.voiceRecordingContainer}>
              <View style={styles.recordingVisualizer}>
                {isRecording ? (
                  <>
                    <View style={[styles.soundBar, { height: 20 + Math.random() * 30 }]} />
                    <View style={[styles.soundBar, { height: 20 + Math.random() * 40 }]} />
                    <View style={[styles.soundBar, { height: 20 + Math.random() * 50 }]} />
                    <View style={[styles.soundBar, { height: 20 + Math.random() * 40 }]} />
                    <View style={[styles.soundBar, { height: 20 + Math.random() * 30 }]} />
                  </>
                ) : (
                  <Ionicons name="mic-outline" size={48} color="#94a3b8" />
                )}
              </View>
              
              <Text style={styles.recordingTime}>
                {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')}
              </Text>
              
              <Text style={styles.recordingStatus}>
                {isRecording ? 'Recording...' : 'Tap to start recording'}
              </Text>

              <TouchableOpacity
                style={[
                  styles.recordButton,
                  isRecording && styles.recordButtonActive,
                ]}
                onPress={isRecording ? handleStopRecording : handleStartRecording}
              >
                <Ionicons 
                  name={isRecording ? 'stop' : 'mic'} 
                  size={32} 
                  color="#ffffff" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Plan Route Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={planRouteModalVisible}
        onRequestClose={() => setPlanRouteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <View style={[styles.modalIconBg, { backgroundColor: '#f3e8ff' }]}>
                  <Ionicons name="navigate" size={24} color="#7c3aed" />
                </View>
                <Text style={styles.modalTitle}>Plan Route</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setPlanRouteModalVisible(false);
                  setSelectedStops([]);
                }}
              >
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Select stops for your route ({selectedStops.length} selected):
            </Text>

            <ScrollView style={styles.modalList} nestedScrollEnabled>
              {customerList.map((customer, index) => (
                <TouchableOpacity
                  key={customer.id}
                  style={[
                    styles.routeStopCard,
                    selectedStops.includes(customer.id) && styles.routeStopCardSelected,
                  ]}
                  onPress={() => toggleStopSelection(customer.id)}
                >
                  <View style={[
                    styles.stopNumber,
                    selectedStops.includes(customer.id) && styles.stopNumberSelected,
                  ]}>
                    {selectedStops.includes(customer.id) ? (
                      <Text style={styles.stopNumberText}>
                        {selectedStops.indexOf(customer.id) + 1}
                      </Text>
                    ) : (
                      <Ionicons name="add" size={16} color="#64748b" />
                    )}
                  </View>
                  <View style={styles.routeStopContent}>
                    <Text style={styles.routeStopName}>{customer.name}</Text>
                    <Text style={styles.routeStopAddress}>{customer.address}</Text>
                  </View>
                  {selectedStops.includes(customer.id) && (
                    <Ionicons name="checkmark-circle" size={24} color="#7c3aed" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {selectedStops.length >= 2 && (
              <View style={styles.routeSummary}>
                <View style={styles.routeSummaryRow}>
                  <Ionicons name="car-outline" size={18} color="#64748b" />
                  <Text style={styles.routeSummaryText}>
                    Est. drive time: {selectedStops.length * 15} min
                  </Text>
                </View>
                <View style={styles.routeSummaryRow}>
                  <Ionicons name="location-outline" size={18} color="#64748b" />
                  <Text style={styles.routeSummaryText}>
                    {selectedStops.length} stops • {(selectedStops.length - 1) * 5} miles
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={[
                styles.primaryButton,
                { backgroundColor: '#7c3aed' },
                selectedStops.length < 2 && styles.primaryButtonDisabled,
              ]} 
              onPress={handleOptimizeRoute}
              disabled={selectedStops.length < 2}
            >
              <Ionicons name="navigate" size={20} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Optimize & Navigate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  territoryName: {
    fontSize: 14,
    color: '#3b82f6',
    marginTop: 4,
    fontWeight: '500',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#dc2626',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  alertIconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadge: {
    backgroundColor: '#dc2626',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
  },
  countBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  seeAllLink: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },

  // Alert Cards
  alertsContainer: {
    gap: 12,
  },
  alertCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  alertIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertCustomer: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 2,
  },
  alertHighlight: {
    fontSize: 13,
    fontWeight: '600',
  },
  alertMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#94a3b8',
  },

  // Calendar Cards
  calendarScrollContent: {
    paddingRight: 20,
  },
  calendarCard: {
    width: 140,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  calendarCardFirst: {
    marginLeft: 0,
  },
  calendarCardAccent: {
    height: 4,
    width: '100%',
  },
  calendarCardContent: {
    padding: 14,
  },
  calendarIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  calendarTime: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  calendarTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 2,
  },
  calendarCustomer: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  calendarDurationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  calendarDuration: {
    fontSize: 11,
    color: '#64748b',
  },

  // Stats Grid
  statsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  quickActionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionCardPrimary: {
    backgroundColor: '#059669',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  quickActionTextPrimary: {
    color: '#ffffff',
  },

  // Training Cards
  trainingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  trainingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trainingContent: {
    flex: 1,
  },
  trainingCustomer: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  trainingType: {
    fontSize: 13,
    color: '#64748b',
  },
  trainingMeta: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  trainingDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  trainingTime: {
    fontSize: 12,
    color: '#64748b',
  },

  bottomSpacing: {
    height: 40,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalCloseButton: {
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  modalList: {
    maxHeight: 300,
  },
  customerSelectCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  customerSelectCardSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  customerSelectContent: {
    flex: 1,
  },
  customerSelectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  customerSelectMeta: {
    fontSize: 13,
    color: '#64748b',
  },
  customerSelectAction: {
    padding: 4,
  },

  // Activity Type Grid
  activityTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  activityTypeButton: {
    flex: 1,
    minWidth: (width - 70) / 2,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activityTypeButtonSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  activityTypeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginTop: 6,
  },
  activityTypeLabelSelected: {
    color: '#ffffff',
  },

  // Customer Scroll List
  customerScrollList: {
    maxHeight: 150,
    marginBottom: 16,
  },
  customerScrollListSmall: {
    marginBottom: 20,
  },

  // Duration Row
  durationRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  durationButton: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  durationButtonSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  durationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  durationButtonTextSelected: {
    color: '#ffffff',
  },

  // Notes Input
  notesInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },

  // Primary Button
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Customer Chip
  customerChip: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  customerChipSelected: {
    backgroundColor: '#d97706',
    borderColor: '#d97706',
  },
  customerChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
  },
  customerChipTextSelected: {
    color: '#ffffff',
  },

  // Voice Recording
  voiceRecordingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  recordingVisualizer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    gap: 6,
    marginBottom: 20,
  },
  soundBar: {
    width: 6,
    backgroundColor: '#d97706',
    borderRadius: 3,
  },
  recordingTime: {
    fontSize: 48,
    fontWeight: '300',
    color: '#0f172a',
    marginBottom: 8,
  },
  recordingStatus: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  recordButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#d97706',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  recordButtonActive: {
    backgroundColor: '#dc2626',
    shadowColor: '#dc2626',
  },

  // Route Planning
  routeStopCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  routeStopCardSelected: {
    backgroundColor: '#f3e8ff',
    borderColor: '#7c3aed',
  },
  stopNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stopNumberSelected: {
    backgroundColor: '#7c3aed',
  },
  stopNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  routeStopContent: {
    flex: 1,
  },
  routeStopName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  routeStopAddress: {
    fontSize: 12,
    color: '#64748b',
  },
  routeSummary: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  routeSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  routeSummaryText: {
    fontSize: 13,
    color: '#64748b',
  },
});
