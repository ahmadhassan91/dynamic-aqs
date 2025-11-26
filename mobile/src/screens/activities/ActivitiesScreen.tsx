import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Activity {
  id: string;
  customer: string;
  type: 'Call' | 'Visit' | 'Email' | 'Meeting' | 'Training';
  date: string;
  notes: string;
  duration?: string;
}

export default function ActivitiesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [activityType, setActivityType] = useState<Activity['type']>('Visit');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [notes, setNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const recentActivities: Activity[] = [
    {
      id: '1',
      customer: 'ABC Supply Co',
      type: 'Training',
      date: '2 hours ago',
      notes: 'Completed product training session. Covered new HVAC line.',
      duration: '2 hours',
    },
    {
      id: '2',
      customer: 'XYZ Distributors',
      type: 'Visit',
      date: 'Today at 2:30 PM',
      notes: 'Site visit to discuss upcoming order. Positive feedback.',
      duration: '45 min',
    },
    {
      id: '3',
      customer: 'Mountain HVAC',
      type: 'Call',
      date: 'Yesterday',
      notes: 'Follow-up call regarding quote. Decision expected next week.',
      duration: '15 min',
    },
  ];

  const activityTypes = [
    { type: 'Call' as const, icon: 'call', color: '#3b82f6' },
    { type: 'Visit' as const, icon: 'business', color: '#10b981' },
    { type: 'Email' as const, icon: 'mail', color: '#f59e0b' },
    { type: 'Meeting' as const, icon: 'people', color: '#8b5cf6' },
    { type: 'Training' as const, icon: 'school', color: '#ef4444' },
  ];

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      Alert.alert('Voice Recording', 'Recording started...');
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false);
        setNotes('Demo: Visited customer site. Discussed Q1 product needs. Follow-up needed on pricing for bulk order.');
      }, 3000);
    }
  };

  const handleSubmit = () => {
    if (!selectedCustomer || !notes) {
      Alert.alert('Error', 'Please select a customer and add notes');
      return;
    }
    Alert.alert('Success', 'Activity logged successfully!');
    setModalVisible(false);
    setSelectedCustomer('');
    setNotes('');
  };

  const getActivityIcon = (type: Activity['type']) => {
    const activity = activityTypes.find(a => a.type === type);
    return activity ? activity.icon : 'document';
  };

  const getActivityColor = (type: Activity['type']) => {
    const activity = activityTypes.find(a => a.type === type);
    return activity ? activity.color : '#64748b';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activities</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle" size={28} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>15</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>67</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>234</Text>
          <Text style={styles.statLabel}>Total YTD</Text>
        </View>
      </View>

      {/* Activity Feed */}
      <ScrollView style={styles.activityFeed}>
        <Text style={styles.feedTitle}>Recent Activities</Text>
        {recentActivities.map((activity) => (
          <View key={activity.id} style={styles.activityCard}>
            <View
              style={[
                styles.activityIconContainer,
                { backgroundColor: `${getActivityColor(activity.type)}20` },
              ]}
            >
              <Ionicons
                name={getActivityIcon(activity.type) as any}
                size={24}
                color={getActivityColor(activity.type)}
              />
            </View>
            <View style={styles.activityContent}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityCustomer}>{activity.customer}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
              <View style={styles.activityTypeRow}>
                <Text
                  style={[
                    styles.activityType,
                    { color: getActivityColor(activity.type) },
                  ]}
                >
                  {activity.type}
                </Text>
                {activity.duration && (
                  <>
                    <Text style={styles.activityDot}>•</Text>
                    <Text style={styles.activityDuration}>{activity.duration}</Text>
                  </>
                )}
              </View>
              <Text style={styles.activityNotes}>{activity.notes}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Quick Log Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Activity</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Activity Type Selection */}
              <Text style={styles.sectionLabel}>Activity Type</Text>
              <View style={styles.typeSelector}>
                {activityTypes.map((type) => (
                  <TouchableOpacity
                    key={type.type}
                    style={[
                      styles.typeButton,
                      activityType === type.type && {
                        backgroundColor: type.color,
                        borderColor: type.color,
                      },
                    ]}
                    onPress={() => setActivityType(type.type)}
                  >
                    <Ionicons
                      name={type.icon as any}
                      size={20}
                      color={activityType === type.type ? '#ffffff' : type.color}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        activityType === type.type && { color: '#ffffff' },
                      ]}
                    >
                      {type.type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Customer Selection */}
              <Text style={styles.sectionLabel}>Customer</Text>
              <TouchableOpacity style={styles.customerPicker}>
                <Text style={styles.customerPickerText}>
                  {selectedCustomer || 'Select Customer'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#64748b" />
              </TouchableOpacity>

              {/* Notes */}
              <Text style={styles.sectionLabel}>Notes</Text>
              <TextInput
                style={styles.notesInput}
                multiline
                numberOfLines={6}
                placeholder="Enter activity notes..."
                value={notes}
                onChangeText={setNotes}
              />

              {/* Voice Recording Button */}
              <TouchableOpacity
                style={[
                  styles.voiceButton,
                  isRecording && styles.voiceButtonActive,
                ]}
                onPress={handleVoiceRecord}
              >
                <Ionicons
                  name={isRecording ? 'stop-circle' : 'mic'}
                  size={24}
                  color={isRecording ? '#ef4444' : '#3b82f6'}
                />
                <Text
                  style={[
                    styles.voiceButtonText,
                    isRecording && styles.voiceButtonTextActive,
                  ]}
                >
                  {isRecording ? 'Stop Recording' : 'Use Voice Note'}
                </Text>
              </TouchableOpacity>

              {isRecording && (
                <View style={styles.recordingIndicator}>
                  <View style={styles.recordingDot} />
                  <Text style={styles.recordingText}>Recording in progress...</Text>
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                <Text style={styles.submitButtonText}>Log Activity</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  addButton: {
    padding: 4,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
  },
  activityFeed: {
    flex: 1,
    padding: 16,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityCustomer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  activityDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  activityTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityType: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityDot: {
    marginHorizontal: 8,
    color: '#cbd5e1',
  },
  activityDuration: {
    fontSize: 12,
    color: '#64748b',
  },
  activityNotes: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalBody: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    marginTop: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  customerPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
  },
  customerPickerText: {
    fontSize: 14,
    color: '#475569',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 8,
    marginTop: 12,
  },
  voiceButtonActive: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  voiceButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  voiceButtonTextActive: {
    color: '#ef4444',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
