import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

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

interface CustomerInteractionHistoryProps {
  customerId: string;
  interactions: Interaction[];
}

export default function CustomerInteractionHistory({
  customerId,
  interactions,
}: CustomerInteractionHistoryProps) {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'visit': return 'location';
      case 'call': return 'call';
      case 'email': return 'mail';
      case 'training': return 'school';
      default: return 'document';
    }
  };

  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'visit': return '#10b981';
      case 'call': return '#3b82f6';
      case 'email': return '#f59e0b';
      case 'training': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    
    return timestamp.toLocaleDateString();
  };

  const handlePhotoPress = (photos: string[], index: number) => {
    setSelectedPhotos(photos);
    setCurrentPhotoIndex(index);
    setPhotoModalVisible(true);
  };

  const playAudio = async (audioUri: string) => {
    try {
      if (playingAudio === audioUri) {
        setPlayingAudio(null);
        return;
      }

      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      setPlayingAudio(audioUri);
      
      await sound.playAsync();
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingAudio(null);
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingAudio(null);
    }
  };

  const renderInteraction = ({ item }: { item: Interaction }) => (
    <View style={styles.interactionCard}>
      <View style={styles.interactionHeader}>
        <View style={styles.interactionIcon}>
          <Ionicons
            name={getInteractionIcon(item.type) as any}
            size={20}
            color={getInteractionColor(item.type)}
          />
        </View>
        <View style={styles.interactionInfo}>
          <Text style={styles.interactionTitle}>{item.title}</Text>
          <Text style={styles.interactionDescription}>{item.description}</Text>
          <View style={styles.interactionMeta}>
            <Text style={styles.interactionTime}>{formatTimestamp(item.timestamp)}</Text>
            {item.duration && (
              <Text style={styles.interactionDuration}> • {item.duration} min</Text>
            )}
            {item.status && (
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {item.photos && item.photos.length > 0 && (
        <View style={styles.photosContainer}>
          <Text style={styles.attachmentTitle}>Photos ({item.photos.length})</Text>
          <View style={styles.photoGrid}>
            {item.photos.slice(0, 3).map((photo, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handlePhotoPress(item.photos!, index)}
              >
                <Image source={{ uri: photo }} style={styles.thumbnail} />
                {index === 2 && item.photos!.length > 3 && (
                  <View style={styles.morePhotosOverlay}>
                    <Text style={styles.morePhotosText}>+{item.photos!.length - 3}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {item.audioNotes && item.audioNotes.length > 0 && (
        <View style={styles.audioContainer}>
          <Text style={styles.attachmentTitle}>Voice Notes ({item.audioNotes.length})</Text>
          {item.audioNotes.map((audio, index) => (
            <TouchableOpacity
              key={index}
              style={styles.audioItem}
              onPress={() => playAudio(audio)}
            >
              <Ionicons
                name={playingAudio === audio ? "pause-circle" : "play-circle"}
                size={24}
                color="#2563eb"
              />
              <Text style={styles.audioText}>Voice Note {index + 1}</Text>
              {playingAudio === audio && (
                <View style={styles.playingIndicator}>
                  <Text style={styles.playingText}>Playing...</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'scheduled': return '#3b82f6';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={interactions}
        renderItem={renderInteraction}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        visible={photoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <View style={styles.photoModalContainer}>
          <TouchableOpacity
            style={styles.photoModalClose}
            onPress={() => setPhotoModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="#ffffff" />
          </TouchableOpacity>
          
          {selectedPhotos.length > 0 && (
            <Image
              source={{ uri: selectedPhotos[currentPhotoIndex] }}
              style={styles.fullScreenPhoto}
              resizeMode="contain"
            />
          )}
          
          {selectedPhotos.length > 1 && (
            <View style={styles.photoNavigation}>
              <TouchableOpacity
                onPress={() => setCurrentPhotoIndex(Math.max(0, currentPhotoIndex - 1))}
                disabled={currentPhotoIndex === 0}
              >
                <Ionicons
                  name="chevron-back"
                  size={30}
                  color={currentPhotoIndex === 0 ? "#6b7280" : "#ffffff"}
                />
              </TouchableOpacity>
              
              <Text style={styles.photoCounter}>
                {currentPhotoIndex + 1} of {selectedPhotos.length}
              </Text>
              
              <TouchableOpacity
                onPress={() => setCurrentPhotoIndex(Math.min(selectedPhotos.length - 1, currentPhotoIndex + 1))}
                disabled={currentPhotoIndex === selectedPhotos.length - 1}
              >
                <Ionicons
                  name="chevron-forward"
                  size={30}
                  color={currentPhotoIndex === selectedPhotos.length - 1 ? "#6b7280" : "#ffffff"}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  interactionCard: {
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
  interactionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  interactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  interactionInfo: {
    flex: 1,
  },
  interactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  interactionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  interactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  interactionDuration: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statusBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  photosContainer: {
    marginTop: 12,
  },
  attachmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  morePhotosOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  morePhotosText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  audioContainer: {
    marginTop: 12,
  },
  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 4,
  },
  audioText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  playingIndicator: {
    marginLeft: 8,
  },
  playingText: {
    fontSize: 12,
    color: '#2563eb',
    fontStyle: 'italic',
  },
  photoModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoModalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  fullScreenPhoto: {
    width: '90%',
    height: '70%',
  },
  photoNavigation: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
  },
  photoCounter: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});