import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

interface CustomerVisitModalProps {
  visible: boolean;
  customerId: string;
  customerName: string;
  onClose: () => void;
  onSave: (visitData: VisitData) => void;
}

interface VisitData {
  customerId: string;
  visitType: string;
  notes: string;
  photos: string[];
  audioNotes: string[];
  duration: number;
  timestamp: Date;
}

export default function CustomerVisitModal({
  visible,
  customerId,
  customerName,
  onClose,
  onSave,
}: CustomerVisitModalProps) {
  const [visitType, setVisitType] = useState('training');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [audioNotes, setAudioNotes] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const visitTypes = [
    { value: 'training', label: 'Training Session' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow_up', label: 'Follow-up Visit' },
    { value: 'support', label: 'Technical Support' },
    { value: 'other', label: 'Other' },
  ];

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotos(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Microphone permission is required for voice notes.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (uri) {
        setAudioNotes(prev => [...prev, uri]);
      }
      
      setRecording(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const handleRemoveAudio = (index: number) => {
    setAudioNotes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!notes.trim() && photos.length === 0 && audioNotes.length === 0) {
      Alert.alert('Error', 'Please add some notes, photos, or audio recordings.');
      return;
    }

    const visitData: VisitData = {
      customerId,
      visitType,
      notes: notes.trim(),
      photos,
      audioNotes,
      duration: 30, // Mock duration - would be calculated from actual visit time
      timestamp: new Date(),
    };

    onSave(visitData);
    handleClose();
  };

  const handleClose = () => {
    setVisitType('training');
    setNotes('');
    setPhotos([]);
    setAudioNotes([]);
    setIsRecording(false);
    if (recording) {
      recording.stopAndUnloadAsync();
      setRecording(null);
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Log Visit</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.customerName}>{customerName}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Visit Type</Text>
            <View style={styles.visitTypeContainer}>
              {visitTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.visitTypeButton,
                    visitType === type.value && styles.visitTypeButtonActive,
                  ]}
                  onPress={() => setVisitType(type.value)}
                >
                  <Text
                    style={[
                      styles.visitTypeText,
                      visitType === type.value && styles.visitTypeTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Enter visit notes..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleTakePhoto}>
              <Ionicons name="camera" size={24} color="#2563eb" />
              <Text style={styles.addButtonText}>Take Photo</Text>
            </TouchableOpacity>
            
            {photos.length > 0 && (
              <View style={styles.photoGrid}>
                {photos.map((photo, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <Image source={{ uri: photo }} style={styles.photo} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemovePhoto(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Voice Notes</Text>
            <TouchableOpacity
              style={[styles.addButton, isRecording && styles.recordingButton]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Ionicons
                name={isRecording ? "stop" : "mic"}
                size={24}
                color={isRecording ? "#ef4444" : "#2563eb"}
              />
              <Text style={[styles.addButtonText, isRecording && styles.recordingText]}>
                {isRecording ? 'Stop Recording' : 'Record Voice Note'}
              </Text>
            </TouchableOpacity>

            {audioNotes.length > 0 && (
              <View style={styles.audioList}>
                {audioNotes.map((audio, index) => (
                  <View key={index} style={styles.audioItem}>
                    <Ionicons name="musical-notes" size={20} color="#6b7280" />
                    <Text style={styles.audioText}>Voice Note {index + 1}</Text>
                    <TouchableOpacity onPress={() => handleRemoveAudio(index)}>
                      <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
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
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  visitTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  visitTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  visitTypeButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  visitTypeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  visitTypeTextActive: {
    color: '#ffffff',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginBottom: 12,
  },
  recordingButton: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  recordingText: {
    color: '#ef4444',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  audioList: {
    gap: 8,
  },
  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  audioText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#374151',
  },
});