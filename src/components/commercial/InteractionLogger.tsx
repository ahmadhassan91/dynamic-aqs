'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  EngineerContact, 
  Interaction, 
  InteractionType,
  EngineerRating 
} from '@/types/commercial';
import { commercialService } from '@/lib/services/commercialService';

interface InteractionLoggerProps {
  engineer: EngineerContact;
  onClose: () => void;
  onSave: (interaction: Interaction) => void;
  className?: string;
}

export default function InteractionLogger({ 
  engineer, 
  onClose, 
  onSave, 
  className = '' 
}: InteractionLoggerProps) {
  const [interactionType, setInteractionType] = useState<InteractionType>(InteractionType.PHONE_CALL);
  const [description, setDescription] = useState('');
  const [outcome, setOutcome] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [newRating, setNewRating] = useState<EngineerRating>(engineer.rating);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isVoiceToTextSupported, setIsVoiceToTextSupported] = useState(false);
  const [saving, setSaving] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check for voice-to-text support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsVoiceToTextSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setDescription(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startVoiceRecording = async () => {
    if (!isVoiceToTextSupported) return;

    try {
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start speech recognition
      recognitionRef.current?.start();
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting voice recording:', error);
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecordingTime(0);
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = async () => {
    if (!description.trim()) {
      alert('Please provide a description of the interaction');
      return;
    }

    setSaving(true);
    try {
      const interaction: Interaction = {
        id: `interaction_${Date.now()}`,
        type: interactionType,
        date: new Date(),
        description: description.trim(),
        outcome: outcome.trim() || undefined,
        followUpRequired,
        followUpDate: followUpRequired && followUpDate ? new Date(followUpDate) : undefined,
        createdBy: 'current_user' // This would come from auth context
      };

      // If rating changed, update engineer
      if (newRating !== engineer.rating) {
        await commercialService.updateEngineer(engineer.id, {
          rating: newRating,
          ratingHistory: [
            ...engineer.ratingHistory,
            {
              previousRating: engineer.rating,
              newRating: newRating,
              reason: `Updated during ${interactionType.toLowerCase()} interaction`,
              changedBy: 'current_user',
              changedAt: new Date()
            }
          ]
        });
      }

      onSave(interaction);
      onClose();
    } catch (error) {
      console.error('Error saving interaction:', error);
      alert('Error saving interaction. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getRatingColor = (rating: EngineerRating) => {
    const colors: Record<number, string> = {
      [EngineerRating.HOSTILE]: 'bg-red-100 text-red-800 border-red-200',
      [EngineerRating.UNFAVORABLE]: 'bg-orange-100 text-orange-800 border-orange-200',
      [EngineerRating.NEUTRAL]: 'bg-gray-100 text-gray-800 border-gray-200',
      [EngineerRating.FAVORABLE]: 'bg-blue-100 text-blue-800 border-blue-200',
      [EngineerRating.CHAMPION]: 'bg-green-100 text-green-800 border-green-200',
      [EngineerRating.LEVEL_6]: 'bg-teal-100 text-teal-800 border-teal-200',
      [EngineerRating.LEVEL_7]: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      [EngineerRating.LEVEL_8]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      [EngineerRating.LEVEL_9]: 'bg-purple-100 text-purple-800 border-purple-200',
      [EngineerRating.LEVEL_10]: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return colors[rating] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRatingLabel = (rating: EngineerRating) => {
    const labels: Record<number, string> = {
      [EngineerRating.HOSTILE]: 'Hostile (1)',
      [EngineerRating.UNFAVORABLE]: 'Unfavorable (2)',
      [EngineerRating.NEUTRAL]: 'Neutral (3)',
      [EngineerRating.FAVORABLE]: 'Favorable (4)',
      [EngineerRating.CHAMPION]: 'Champion (5)',
      [EngineerRating.LEVEL_6]: 'Level 6',
      [EngineerRating.LEVEL_7]: 'Level 7',
      [EngineerRating.LEVEL_8]: 'Level 8',
      [EngineerRating.LEVEL_9]: 'Level 9',
      [EngineerRating.LEVEL_10]: 'Level 10'
    };
    return labels[rating] || 'Unknown';
  };

  const getInteractionIcon = (type: InteractionType) => {
    const icons = {
      [InteractionType.PHONE_CALL]: '📞',
      [InteractionType.EMAIL]: '📧',
      [InteractionType.MEETING]: '🤝',
      [InteractionType.LUNCH_AND_LEARN]: '🍽️',
      [InteractionType.SITE_VISIT]: '🏗️',
      [InteractionType.TRADE_SHOW]: '🏢',
      [InteractionType.WEBINAR]: '💻'
    };
    return icons[type] || '💬';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${className}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Log Interaction</h2>
              <p className="text-gray-600">
                {engineer.personalInfo.firstName} {engineer.personalInfo.lastName} - {engineer.engineeringFirmId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Interaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interaction Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.values(InteractionType).map(type => (
                  <button
                    key={type}
                    onClick={() => setInteractionType(type)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      interactionType === type
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-lg mb-1">{getInteractionIcon(type)}</div>
                    <div>{type}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description with Voice-to-Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the interaction, key points discussed, and any important outcomes..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[120px] resize-vertical"
                  required
                />
                {isVoiceToTextSupported && (
                  <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                    {isRecording && (
                      <div className="flex items-center space-x-2 bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span>{formatRecordingTime(recordingTime)}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                      className={`p-2 rounded-full ${
                        isRecording 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                      title={isRecording ? 'Stop recording' : 'Start voice-to-text'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              {isVoiceToTextSupported && (
                <p className="text-xs text-gray-500 mt-1">
                  Click the microphone to use voice-to-text (works best in Chrome/Edge)
                </p>
              )}
            </div>

            {/* Outcome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outcome (Optional)
              </label>
              <textarea
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder="What was the result or next steps from this interaction?"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[80px] resize-vertical"
              />
            </div>

            {/* Rating Update */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Engineer Rating
              </label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Current:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRatingColor(engineer.rating)}`}>
                  {getRatingLabel(engineer.rating)}
                </span>
                <span className="text-sm text-gray-600">New:</span>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(parseInt(e.target.value) as EngineerRating)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  {Object.values(EngineerRating).filter(r => typeof r === 'number').map(rating => (
                    <option key={rating} value={rating}>{getRatingLabel(rating as EngineerRating)}</option>
                  ))}
                </select>
              </div>
              {newRating !== engineer.rating && (
                <p className="text-sm text-blue-600 mt-1">
                  Rating will be updated from {getRatingLabel(engineer.rating)} to {getRatingLabel(newRating)}
                </p>
              )}
            </div>

            {/* Follow-up */}
            <div>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="followUpRequired"
                  checked={followUpRequired}
                  onChange={(e) => setFollowUpRequired(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="followUpRequired" className="ml-2 text-sm font-medium text-gray-700">
                  Follow-up required
                </label>
              </div>
              {followUpRequired && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !description.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Interaction'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}