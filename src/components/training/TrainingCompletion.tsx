'use client';

import { useState, useRef } from 'react';
import {
  Card,
  Title,
  Group,
  Button,
  Text,
  Badge,
  Stack,
  Grid,
  Modal,
  Textarea,
  NumberInput,
  Rating,
  Checkbox,
  Divider,
  Alert,
  Progress,
  ThemeIcon,
  List,
} from '@mantine/core';
import {
  IconSignature,
  IconCertificate,
  IconCheck,
  IconX,
  IconClock,
  IconUsers,
  IconStar,
  IconAlertCircle,
  IconSchool,
  IconFileText,
} from '@tabler/icons-react';

interface TrainingCompletionProps {
  sessionId: string;
  onComplete?: (completionData: any) => void;
  onCancel?: () => void;
}

interface CompletionData {
  completedAt: Date;
  actualDuration: number;
  attendees: string[];
  objectives: { id: string; completed: boolean; notes?: string }[];
  feedback: {
    rating: number;
    comments: string;
    wouldRecommend: boolean;
  };
  certificationEarned: boolean;
  trainerNotes: string;
  signature: string;
}

// Mock session data
const mockSession = {
  id: '1',
  title: 'AQS Pro Series Installation Fundamentals',
  type: 'installation',
  customer: 'ABC HVAC Solutions',
  trainer: 'John Smith',
  scheduledDate: new Date(),
  duration: 240, // 4 hours
  attendees: ['Mike Johnson', 'Sarah Davis', 'Tom Wilson'],
  objectives: [
    { id: '1', text: 'Understand AQS Pro Series components and specifications', completed: false },
    { id: '2', text: 'Master proper installation procedures and best practices', completed: false },
    { id: '3', text: 'Learn troubleshooting techniques for common installation issues', completed: false },
    { id: '4', text: 'Complete hands-on installation exercise', completed: false },
  ],
  certificationOffered: true,
  certificationName: 'AQS Pro Series Installation Certified',
};

export function TrainingCompletion({ sessionId, onComplete, onCancel }: TrainingCompletionProps) {
  const [session] = useState(mockSession);
  const [completionData, setCompletionData] = useState<Partial<CompletionData>>({
    actualDuration: session.duration,
    attendees: session.attendees,
    objectives: session.objectives.map(obj => ({ id: obj.id, completed: false })),
    feedback: {
      rating: 0,
      comments: '',
      wouldRecommend: false,
    },
    certificationEarned: false,
    trainerNotes: '',
    signature: '',
  });
  
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleObjectiveChange = (objectiveId: string, completed: boolean, notes?: string) => {
    setCompletionData(prev => ({
      ...prev,
      objectives: prev.objectives?.map(obj => 
        obj.id === objectiveId ? { ...obj, completed, notes } : obj
      ),
    }));
  };

  const handleFeedbackChange = (field: string, value: any) => {
    setCompletionData(prev => ({
      ...prev,
      feedback: {
        ...prev.feedback!,
        [field]: value,
      },
    }));
  };

  const getCompletionPercentage = () => {
    const completedObjectives = completionData.objectives?.filter(obj => obj.completed).length || 0;
    return (completedObjectives / session.objectives.length) * 100;
  };

  const canEarnCertification = () => {
    const completionPercentage = getCompletionPercentage();
    const hasGoodRating = (completionData.feedback?.rating || 0) >= 4;
    return completionPercentage >= 80 && hasGoodRating;
  };

  const isFormValid = () => {
    const hasCompletedObjectives = (completionData.objectives?.filter(obj => obj.completed).length || 0) > 0;
    const hasFeedback = (completionData.feedback?.rating || 0) > 0;
    const hasSignature = completionData.signature !== '';
    return hasCompletedObjectives && hasFeedback && hasSignature;
  };

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL();
    setCompletionData(prev => ({ ...prev, signature: dataURL }));
    setShowSignatureModal(false);
  };

  const handleComplete = () => {
    if (!isFormValid()) return;
    
    const finalData: CompletionData = {
      completedAt: new Date(),
      actualDuration: completionData.actualDuration || session.duration,
      attendees: completionData.attendees || [],
      objectives: completionData.objectives || [],
      feedback: completionData.feedback!,
      certificationEarned: completionData.certificationEarned || false,
      trainerNotes: completionData.trainerNotes || '',
      signature: completionData.signature || '',
    };
    
    onComplete?.(finalData);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <Stack gap="lg">
      {/* Header */}
      <Card withBorder p="lg">
        <Group justify="space-between" mb="md">
          <div>
            <Title order={3}>{session.title}</Title>
            <Text c="dimmed" size="sm">
              {session.customer} • {session.trainer}
            </Text>
          </div>
          <Badge color="blue" variant="light" size="lg">
            {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
          </Badge>
        </Group>

        <Grid>
          <Grid.Col span={6}>
            <Group gap="xs">
              <IconClock size={16} />
              <Text size="sm">
                Scheduled: {formatDuration(session.duration)}
              </Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group gap="xs">
              <IconUsers size={16} />
              <Text size="sm">
                {session.attendees.length} attendees
              </Text>
            </Group>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Progress Overview */}
      <Card withBorder p="lg">
        <Group justify="space-between" mb="md">
          <Title order={4}>Training Progress</Title>
          <Text fw={500} c={getCompletionPercentage() >= 80 ? 'green' : 'orange'}>
            {getCompletionPercentage().toFixed(0)}% Complete
          </Text>
        </Group>
        
        <Progress 
          value={getCompletionPercentage()} 
          color={getCompletionPercentage() >= 80 ? 'green' : 'orange'}
          size="lg" 
          mb="md"
        />

        {session.certificationOffered && (
          <Alert
            icon={<IconCertificate size={16} />}
            title="Certification Available"
            color={canEarnCertification() ? 'green' : 'yellow'}
            variant="light"
          >
            {canEarnCertification() ? (
              <Text size="sm">
                This training session qualifies for certification: <strong>{session.certificationName}</strong>
              </Text>
            ) : (
              <Text size="sm">
                Complete at least 80% of objectives with a rating of 4+ stars to earn certification: <strong>{session.certificationName}</strong>
              </Text>
            )}
          </Alert>
        )}
      </Card>

      {/* Learning Objectives */}
      <Card withBorder p="lg">
        <Title order={4} mb="md">Learning Objectives</Title>
        <Stack gap="md">
          {session.objectives.map((objective, index) => {
            const completionObj = completionData.objectives?.find(obj => obj.id === objective.id);
            return (
              <Card key={objective.id} withBorder p="md">
                <Group justify="space-between" mb="sm">
                  <Group gap="sm">
                    <ThemeIcon 
                      color={completionObj?.completed ? 'green' : 'gray'} 
                      variant="light"
                      size="sm"
                    >
                      {completionObj?.completed ? <IconCheck size={14} /> : <Text size="xs">{index + 1}</Text>}
                    </ThemeIcon>
                    <Text fw={500} size="sm">
                      {objective.text}
                    </Text>
                  </Group>
                  <Checkbox
                    checked={completionObj?.completed || false}
                    onChange={(event) => 
                      handleObjectiveChange(objective.id, event.currentTarget.checked)
                    }
                  />
                </Group>
                
                {completionObj?.completed && (
                  <Textarea
                    placeholder="Add notes about this objective (optional)"
                    size="sm"
                    rows={2}
                    value={completionObj.notes || ''}
                    onChange={(event) => 
                      handleObjectiveChange(objective.id, true, event.currentTarget.value)
                    }
                  />
                )}
              </Card>
            );
          })}
        </Stack>
      </Card>

      {/* Session Details */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder p="lg" h="100%">
            <Title order={4} mb="md">Session Details</Title>
            <Stack gap="md">
              <div>
                <Text size="sm" c="dimmed" mb="xs">Actual Duration</Text>
                <NumberInput
                  value={completionData.actualDuration}
                  onChange={(value) => setCompletionData(prev => ({ ...prev, actualDuration: Number(value) }))}
                  min={30}
                  max={480}
                  suffix=" minutes"
                />
              </div>

              <div>
                <Text size="sm" c="dimmed" mb="xs">Attendees Present</Text>
                <Stack gap="xs">
                  {session.attendees.map((attendee, index) => (
                    <Checkbox
                      key={index}
                      label={attendee}
                      checked={completionData.attendees?.includes(attendee) || false}
                      onChange={(event) => {
                        const isChecked = event.currentTarget.checked;
                        setCompletionData(prev => ({
                          ...prev,
                          attendees: isChecked 
                            ? [...(prev.attendees || []), attendee]
                            : (prev.attendees || []).filter(a => a !== attendee)
                        }));
                      }}
                    />
                  ))}
                </Stack>
              </div>

              <div>
                <Text size="sm" c="dimmed" mb="xs">Trainer Notes</Text>
                <Textarea
                  placeholder="Add any additional notes about the training session"
                  rows={4}
                  value={completionData.trainerNotes}
                  onChange={(event) => 
                    setCompletionData(prev => ({ ...prev, trainerNotes: event.currentTarget.value }))
                  }
                />
              </div>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder p="lg" h="100%">
            <Title order={4} mb="md">Training Feedback</Title>
            <Stack gap="md">
              <div>
                <Text size="sm" c="dimmed" mb="xs">Overall Rating</Text>
                <Group gap="sm">
                  <Rating
                    value={completionData.feedback?.rating || 0}
                    onChange={(value) => handleFeedbackChange('rating', value)}
                    size="lg"
                  />
                  <Text size="sm" c="dimmed">
                    {completionData.feedback?.rating || 0}/5 stars
                  </Text>
                </Group>
              </div>

              <div>
                <Text size="sm" c="dimmed" mb="xs">Comments</Text>
                <Textarea
                  placeholder="What went well? What could be improved?"
                  rows={4}
                  value={completionData.feedback?.comments || ''}
                  onChange={(event) => handleFeedbackChange('comments', event.currentTarget.value)}
                />
              </div>

              <Checkbox
                label="Would recommend this training to others"
                checked={completionData.feedback?.wouldRecommend || false}
                onChange={(event) => 
                  handleFeedbackChange('wouldRecommend', event.currentTarget.checked)
                }
              />

              {session.certificationOffered && canEarnCertification() && (
                <Checkbox
                  label={`Award certification: ${session.certificationName}`}
                  checked={completionData.certificationEarned || false}
                  onChange={(event) => 
                    setCompletionData(prev => ({ ...prev, certificationEarned: event.currentTarget.checked }))
                  }
                />
              )}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Digital Signature */}
      <Card withBorder p="lg">
        <Group justify="space-between" mb="md">
          <Title order={4}>Digital Signature</Title>
          <Button 
            leftSection={<IconSignature size={16} />}
            onClick={() => setShowSignatureModal(true)}
            variant={completionData.signature ? 'light' : 'filled'}
          >
            {completionData.signature ? 'Update Signature' : 'Add Signature'}
          </Button>
        </Group>

        {completionData.signature ? (
          <div>
            <Text size="sm" c="dimmed" mb="xs">Trainer Signature</Text>
            <img 
              src={completionData.signature} 
              alt="Trainer Signature" 
              style={{ 
                border: '1px solid var(--mantine-color-gray-3)', 
                borderRadius: '4px',
                maxWidth: '300px',
                height: 'auto'
              }} 
            />
          </div>
        ) : (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Signature Required"
            color="yellow"
            variant="light"
          >
            A digital signature is required to complete the training session.
          </Alert>
        )}
      </Card>

      {/* Action Buttons */}
      <Group justify="flex-end">
        <Button variant="light" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleComplete}
          disabled={!isFormValid()}
          leftSection={<IconCheck size={16} />}
        >
          Complete Training
        </Button>
      </Group>

      {/* Signature Modal */}
      <Modal
        opened={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        title="Digital Signature"
        size="lg"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Please sign below to confirm completion of the training session.
          </Text>
          
          <div style={{ border: '2px solid var(--mantine-color-gray-3)', borderRadius: '8px' }}>
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              style={{ 
                display: 'block', 
                cursor: 'crosshair',
                backgroundColor: 'white',
                borderRadius: '6px'
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>

          <Group justify="space-between">
            <Button variant="light" onClick={clearSignature}>
              Clear
            </Button>
            <Group gap="sm">
              <Button variant="light" onClick={() => setShowSignatureModal(false)}>
                Cancel
              </Button>
              <Button onClick={saveSignature}>
                Save Signature
              </Button>
            </Group>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}