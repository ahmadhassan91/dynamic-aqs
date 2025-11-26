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

interface Training {
  id: string;
  customer: string;
  customerId: string;
  type: 'Product Training' | 'Technical Training' | 'Sales Training' | 'Safety Training';
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  location: string;
  notes?: string;
}

export default function TrainingScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [modalVisible, setModalVisible] = useState(false);
  const [completionModalVisible, setCompletionModalVisible] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');

  const trainings: Training[] = [
    {
      id: '1',
      customer: 'Summit HVAC',
      customerId: 'c1',
      type: 'Product Training',
      date: 'Tomorrow',
      time: '10:00 AM',
      status: 'Scheduled',
      location: '123 Main St, Denver, CO',
    },
    {
      id: '2',
      customer: 'Peak Distributors',
      customerId: 'c2',
      type: 'Technical Training',
      date: 'Dec 2, 2025',
      time: '2:00 PM',
      status: 'Scheduled',
      location: '456 Oak Ave, Boulder, CO',
    },
    {
      id: '3',
      customer: 'Ridge Supply',
      customerId: 'c3',
      type: 'Sales Training',
      date: 'Dec 5, 2025',
      time: '9:00 AM',
      status: 'Scheduled',
      location: '789 Pine Rd, Fort Collins, CO',
    },
  ];

  const completedTrainings: Training[] = [
    {
      id: '4',
      customer: 'ABC Supply Co',
      customerId: 'c4',
      type: 'Product Training',
      date: 'Nov 25, 2025',
      time: '10:00 AM',
      status: 'Completed',
      location: '321 Elm St, Denver, CO',
      notes: 'Great session, covered all new product features',
    },
    {
      id: '5',
      customer: 'XYZ Distributors',
      customerId: 'c5',
      type: 'Technical Training',
      date: 'Nov 23, 2025',
      time: '2:00 PM',
      status: 'Completed',
      location: '654 Maple Dr, Boulder, CO',
      notes: 'Technicians very engaged, follow-up needed on HVAC system specs',
    },
  ];

  const handleCompleteTraining = (training: Training) => {
    setSelectedTraining(training);
    setCompletionModalVisible(true);
  };

  const submitCompletion = () => {
    Alert.alert('Success', `Training for ${selectedTraining?.customer} marked as complete!`);
    setCompletionModalVisible(false);
    setCompletionNotes('');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Product Training':
        return '#3b82f6';
      case 'Technical Training':
        return '#10b981';
      case 'Sales Training':
        return '#f59e0b';
      case 'Safety Training':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const renderTrainingCard = (training: Training, isCompleted: boolean = false) => (
    <TouchableOpacity
      key={training.id}
      style={styles.trainingCard}
      onPress={() => {
        setSelectedTraining(training);
        setModalVisible(true);
      }}
    >
      <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(training.type) }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.customerName}>{training.customer}</Text>
          {!isCompleted && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => handleCompleteTraining(training)}
            >
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.typeRow}>
          <Ionicons name="school" size={16} color={getTypeColor(training.type)} />
          <Text style={[styles.trainingType, { color: getTypeColor(training.type) }]}>
            {training.type}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#64748b" />
          <Text style={styles.infoText}>
            {training.date} at {training.time}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#64748b" />
          <Text style={styles.infoText}>{training.location}</Text>
        </View>
        {isCompleted && training.notes && (
          <View style={styles.notesPreview}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText} numberOfLines={2}>
              {training.notes}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Training Management</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={28} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>156</Text>
          <Text style={styles.statLabel}>Total YTD</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming ({trainings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed ({completedTrainings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Training List */}
      <ScrollView style={styles.listContainer}>
        {activeTab === 'upcoming'
          ? trainings.map((training) => renderTrainingCard(training))
          : completedTrainings.map((training) => renderTrainingCard(training, true))}
      </ScrollView>

      {/* Training Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Training Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            {selectedTraining && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Customer</Text>
                  <Text style={styles.detailValue}>{selectedTraining.customer}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Training Type</Text>
                  <Text style={styles.detailValue}>{selectedTraining.type}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date & Time</Text>
                  <Text style={styles.detailValue}>
                    {selectedTraining.date} at {selectedTraining.time}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{selectedTraining.location}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={styles.detailValue}>{selectedTraining.status}</Text>
                </View>
                {selectedTraining.notes && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Notes</Text>
                    <Text style={styles.detailValue}>{selectedTraining.notes}</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.directionsButton}>
                  <Ionicons name="navigate" size={20} color="#ffffff" />
                  <Text style={styles.directionsButtonText}>Get Directions</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Completion Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={completionModalVisible}
        onRequestClose={() => setCompletionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Complete Training</Text>
              <TouchableOpacity onPress={() => setCompletionModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.completionCustomer}>{selectedTraining?.customer}</Text>
              <Text style={styles.completionType}>{selectedTraining?.type}</Text>
              <Text style={styles.inputLabel}>Training Notes</Text>
              <TextInput
                style={styles.notesInput}
                multiline
                numberOfLines={6}
                placeholder="Enter training notes, outcomes, follow-ups needed..."
                value={completionNotes}
                onChangeText={setCompletionNotes}
              />
              <TouchableOpacity style={styles.voiceNoteButton}>
                <Ionicons name="mic" size={20} color="#3b82f6" />
                <Text style={styles.voiceNoteText}>Use Voice Note</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={submitCompletion}>
                <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                <Text style={styles.submitButtonText}>Mark as Complete</Text>
              </TouchableOpacity>
            </View>
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  activeTabText: {
    color: '#3b82f6',
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  trainingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  typeIndicator: {
    height: 4,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  completeButton: {
    padding: 4,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trainingType: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  notesPreview: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: '#475569',
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
    maxHeight: '80%',
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
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1e293b',
  },
  directionsButton: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  directionsButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  completionCustomer: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  completionType: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
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
  voiceNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 8,
    marginTop: 12,
  },
  voiceNoteText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
