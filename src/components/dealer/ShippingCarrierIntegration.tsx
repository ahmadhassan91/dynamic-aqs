'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Grid,
  Card,
  Group,
  Button,
  Badge,
  Paper,
  Table,
  ActionIcon,
  Modal,
  TextInput,
  Select,
  Alert,
  Loader,
  Timeline,
  Anchor,
  CopyButton,
  Tooltip,
  Progress,
  NumberFormatter,
} from '@mantine/core';
import {
  IconTruck,
  IconPackage,
  IconExternalLink,
  IconRefresh,
  IconCheck,
  IconAlertTriangle,
  IconMapPin,
  IconClock,
  IconCopy,
  IconEye,
  IconDownload,
  IconPhone,
  IconMail,
  IconUser,
  IconFileText,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  shippingCarrierService,
  type CarrierTrackingInfo,
  type DeliveryConfirmation,
  type ShippingCarrier,
  SHIPPING_CARRIERS,
} from '@/lib/services/shippingCarrierService';

interface ShippingCarrierIntegrationProps {
  orderTrackingNumbers?: { number: string; carrier: string; orderId: string }[];
  onTrackingUpdate?: (trackingInfo: CarrierTrackingInfo) => void;
}

export function ShippingCarrierIntegration({
  orderTrackingNumbers = [],
  onTrackingUpdate,
}: ShippingCarrierIntegrationProps) {
  const [trackingInfos, setTrackingInfos] = useState<CarrierTrackingInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState<CarrierTrackingInfo | null>(null);
  const [deliveryConfirmation, setDeliveryConfirmation] = useState<DeliveryConfirmation | null>(null);
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [confirmationOpened, { open: openConfirmation, close: closeConfirmation }] = useDisclosure(false);

  // Manual tracking lookup
  const [manualTrackingNumber, setManualTrackingNumber] = useState('');
  const [manualCarrier, setManualCarrier] = useState<string>('');

  useEffect(() => {
    if (orderTrackingNumbers.length > 0) {
      fetchTrackingInfo();
    }
  }, [orderTrackingNumbers]);

  const fetchTrackingInfo = async () => {
    if (orderTrackingNumbers.length === 0) return;

    setLoading(true);
    try {
      const trackingData = await shippingCarrierService.getBulkTrackingInfo(
        orderTrackingNumbers.map(({ number, carrier }) => ({ number, carrier }))
      );
      
      setTrackingInfos(trackingData);
      
      // Notify parent component of updates
      trackingData.forEach(info => {
        onTrackingUpdate?.(info);
      });
      
      notifications.show({
        title: 'Tracking Updated',
        message: `Updated tracking information for ${trackingData.length} shipments`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      console.error('Error fetching tracking info:', error);
      notifications.show({
        title: 'Tracking Error',
        message: 'Failed to fetch tracking information from carriers',
        color: 'red',
        icon: <IconAlertTriangle size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualTracking = async () => {
    if (!manualTrackingNumber.trim()) return;

    const carrier = manualCarrier || shippingCarrierService.detectCarrier(manualTrackingNumber);
    if (!carrier) {
      notifications.show({
        title: 'Invalid Tracking Number',
        message: 'Could not detect carrier from tracking number format',
        color: 'red',
      });
      return;
    }

    setLoading(true);
    try {
      const trackingInfo = await shippingCarrierService.getTrackingInfo(manualTrackingNumber, carrier);
      if (trackingInfo) {
        setTrackingInfos(prev => [...prev, trackingInfo]);
        setManualTrackingNumber('');
        setManualCarrier('');
        
        notifications.show({
          title: 'Tracking Added',
          message: `Added tracking for ${trackingInfo.trackingNumber}`,
          color: 'green',
          icon: <IconCheck size={16} />,
        });
      }
    } catch (error) {
      console.error('Error fetching manual tracking:', error);
      notifications.show({
        title: 'Tracking Error',
        message: 'Failed to fetch tracking information',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (trackingInfo: CarrierTrackingInfo) => {
    setSelectedTracking(trackingInfo);
    openDetails();
  };

  const handleViewDeliveryConfirmation = async (trackingInfo: CarrierTrackingInfo) => {
    if (trackingInfo.deliveryConfirmation) {
      setDeliveryConfirmation(trackingInfo.deliveryConfirmation);
      openConfirmation();
    } else {
      // Try to fetch delivery confirmation
      setLoading(true);
      try {
        const confirmation = await shippingCarrierService.getDeliveryConfirmation(
          trackingInfo.trackingNumber,
          trackingInfo.carrier
        );
        if (confirmation) {
          setDeliveryConfirmation(confirmation);
          openConfirmation();
        } else {
          notifications.show({
            title: 'No Delivery Confirmation',
            message: 'Delivery confirmation not available for this shipment',
            color: 'yellow',
          });
        }
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch delivery confirmation',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'green';
      case 'out for delivery': return 'orange';
      case 'in transit': return 'blue';
      case 'exception': return 'red';
      case 'delayed': return 'red';
      default: return 'gray';
    }
  };

  const getProgressValue = (status: string) => {
    switch (status.toLowerCase()) {
      case 'label created': return 10;
      case 'picked up': return 25;
      case 'in transit': return 60;
      case 'out for delivery': return 85;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={2}>Shipping Carrier Integration</Title>
            <Text c="dimmed">
              Real-time tracking and delivery management with major carriers
            </Text>
          </div>
          <Group>
            <Button
              leftSection={<IconRefresh size={16} />}
              onClick={fetchTrackingInfo}
              loading={loading}
            >
              Refresh All
            </Button>
          </Group>
        </Group>

        {/* Manual Tracking Lookup */}
        <Paper p="md" withBorder>
          <Title order={4} mb="md">Manual Tracking Lookup</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Tracking Number"
                placeholder="Enter tracking number..."
                value={manualTrackingNumber}
                onChange={(e) => setManualTrackingNumber(e.target.value)}
                leftSection={<IconPackage size={16} />}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Carrier (Optional)"
                placeholder="Auto-detect"
                data={SHIPPING_CARRIERS.map(c => ({ value: c.name, label: c.name }))}
                value={manualCarrier}
                onChange={(value) => setManualCarrier(value || '')}
                leftSection={<IconTruck size={16} />}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2 }}>
              <Button
                fullWidth
                mt="xl"
                onClick={handleManualTracking}
                loading={loading}
                disabled={!manualTrackingNumber.trim()}
              >
                Track
              </Button>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Carrier Status */}
        <Paper p="md" withBorder>
          <Title order={4} mb="md">Carrier Integration Status</Title>
          <Grid>
            {SHIPPING_CARRIERS.map((carrier) => (
              <Grid.Col key={carrier.code} span={{ base: 12, sm: 6, md: 3 }}>
                <Card padding="md" withBorder>
                  <Stack gap="xs" align="center">
                    <IconTruck size={32} color="var(--mantine-color-blue-6)" />
                    <Text fw={600}>{carrier.name}</Text>
                    <Badge
                      color={shippingCarrierService.isCarrierEnabled(carrier.name) ? 'green' : 'gray'}
                      variant="light"
                    >
                      {shippingCarrierService.isCarrierEnabled(carrier.name) ? 'Connected' : 'Not Configured'}
                    </Badge>
                    <Text size="xs" c="dimmed" ta="center">
                      {carrier.supportedServices.join(', ')}
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>

        {/* Tracking Information */}
        {trackingInfos.length > 0 && (
          <Paper p="md" withBorder>
            <Title order={4} mb="md">Active Shipments</Title>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tracking Number</Table.Th>
                  <Table.Th>Carrier</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Progress</Table.Th>
                  <Table.Th>Est. Delivery</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {trackingInfos.map((tracking) => (
                  <Table.Tr key={tracking.trackingNumber}>
                    <Table.Td>
                      <Group gap="xs">
                        <Text ff="monospace" size="sm">{tracking.trackingNumber}</Text>
                        <CopyButton value={tracking.trackingNumber}>
                          {({ copied, copy }) => (
                            <ActionIcon size="sm" variant="subtle" onClick={copy}>
                              <IconCopy size={12} />
                            </ActionIcon>
                          )}
                        </CopyButton>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{tracking.carrier}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(tracking.status)} variant="light">
                        {tracking.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Progress
                        value={getProgressValue(tracking.status)}
                        color={getStatusColor(tracking.status)}
                        size="sm"
                        style={{ width: 100 }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {tracking.estimatedDelivery
                          ? new Date(tracking.estimatedDelivery).toLocaleDateString()
                          : 'TBD'
                        }
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="View Details">
                          <ActionIcon
                            variant="subtle"
                            onClick={() => handleViewDetails(tracking)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Track on Carrier Site">
                          <ActionIcon
                            variant="subtle"
                            component="a"
                            href={shippingCarrierService.getTrackingUrl(tracking.trackingNumber, tracking.carrier)}
                            target="_blank"
                          >
                            <IconExternalLink size={16} />
                          </ActionIcon>
                        </Tooltip>
                        {tracking.status.toLowerCase() === 'delivered' && (
                          <Tooltip label="Delivery Confirmation">
                            <ActionIcon
                              variant="subtle"
                              onClick={() => handleViewDeliveryConfirmation(tracking)}
                            >
                              <IconFileText size={16} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        )}

        {/* No Tracking Data */}
        {trackingInfos.length === 0 && !loading && (
          <Paper p="xl" withBorder>
            <Stack align="center" gap="md">
              <IconPackage size={48} color="var(--mantine-color-gray-5)" />
              <Text size="lg" fw={600}>No Tracking Information</Text>
              <Text c="dimmed" ta="center">
                Use the manual tracking lookup above to track shipments, or tracking information will appear automatically for orders with assigned tracking numbers.
              </Text>
            </Stack>
          </Paper>
        )}

        {/* Loading State */}
        {loading && (
          <Paper p="xl" withBorder>
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Text>Fetching tracking information...</Text>
            </Stack>
          </Paper>
        )}
      </Stack>

      {/* Tracking Details Modal */}
      <Modal
        opened={detailsOpened}
        onClose={closeDetails}
        title={`Tracking Details - ${selectedTracking?.trackingNumber}`}
        size="lg"
      >
        {selectedTracking && (
          <Stack gap="lg">
            {/* Summary */}
            <Paper p="md" withBorder>
              <Grid>
                <Grid.Col span={6}>
                  <Stack gap="xs">
                    <Text size="sm" c="dimmed" tt="uppercase" fw={600}>Shipment Information</Text>
                    <Group justify="space-between">
                      <Text size="sm">Carrier:</Text>
                      <Text size="sm" fw={500}>{selectedTracking.carrier}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">Service:</Text>
                      <Text size="sm" fw={500}>{selectedTracking.serviceType || 'Standard'}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">Status:</Text>
                      <Badge color={getStatusColor(selectedTracking.status)}>
                        {selectedTracking.status}
                      </Badge>
                    </Group>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Stack gap="xs">
                    <Text size="sm" c="dimmed" tt="uppercase" fw={600}>Delivery Information</Text>
                    <Group justify="space-between">
                      <Text size="sm">Estimated:</Text>
                      <Text size="sm" fw={500}>
                        {selectedTracking.estimatedDelivery
                          ? new Date(selectedTracking.estimatedDelivery).toLocaleDateString()
                          : 'TBD'
                        }
                      </Text>
                    </Group>
                    {selectedTracking.actualDelivery && (
                      <Group justify="space-between">
                        <Text size="sm">Delivered:</Text>
                        <Text size="sm" fw={500}>
                          {new Date(selectedTracking.actualDelivery).toLocaleDateString()}
                        </Text>
                      </Group>
                    )}
                    <Group justify="space-between">
                      <Text size="sm">Last Updated:</Text>
                      <Text size="sm" fw={500}>
                        {new Date(selectedTracking.lastUpdated).toLocaleString()}
                      </Text>
                    </Group>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Progress */}
            <Paper p="md" withBorder>
              <Text fw={600} mb="md">Delivery Progress</Text>
              <Progress
                value={getProgressValue(selectedTracking.status)}
                color={getStatusColor(selectedTracking.status)}
                size="lg"
                mb="xs"
              />
              <Text size="sm" c="dimmed" ta="center">
                {getProgressValue(selectedTracking.status)}% Complete
              </Text>
            </Paper>

            {/* Timeline */}
            <Paper p="md" withBorder>
              <Text fw={600} mb="md">Tracking Timeline</Text>
              <Timeline>
                {selectedTracking.events.map((event, idx) => (
                  <Timeline.Item
                    key={idx}
                    bullet={<IconMapPin size={16} />}
                    title={event.status}
                  >
                    <Text size="sm" c="dimmed" mb={4}>
                      {event.description}
                    </Text>
                    <Group gap="md">
                      <Group gap="xs">
                        <IconMapPin size={14} />
                        <Text size="xs" c="dimmed">{event.location}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconClock size={14} />
                        <Text size="xs" c="dimmed">
                          {new Date(event.timestamp).toLocaleString()}
                        </Text>
                      </Group>
                    </Group>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Paper>

            {/* Actions */}
            <Group justify="flex-end">
              <Button
                variant="outline"
                leftSection={<IconExternalLink size={16} />}
                component="a"
                href={shippingCarrierService.getTrackingUrl(selectedTracking.trackingNumber, selectedTracking.carrier)}
                target="_blank"
              >
                Track on {selectedTracking.carrier}
              </Button>
              {selectedTracking.status.toLowerCase() === 'delivered' && (
                <Button
                  variant="outline"
                  leftSection={<IconFileText size={16} />}
                  onClick={() => handleViewDeliveryConfirmation(selectedTracking)}
                >
                  Delivery Confirmation
                </Button>
              )}
              <Button onClick={closeDetails}>Close</Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Delivery Confirmation Modal */}
      <Modal
        opened={confirmationOpened}
        onClose={closeConfirmation}
        title="Delivery Confirmation"
        size="md"
      >
        {deliveryConfirmation && (
          <Stack gap="lg">
            <Paper p="md" withBorder>
              <Stack gap="md">
                <Group justify="space-between">
                  <Text size="sm">Delivered At:</Text>
                  <Text size="sm" fw={500}>
                    {new Date(deliveryConfirmation.deliveredAt).toLocaleString()}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Signed By:</Text>
                  <Text size="sm" fw={500}>{deliveryConfirmation.signedBy}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Location:</Text>
                  <Text size="sm" fw={500}>{deliveryConfirmation.deliveryLocation}</Text>
                </Group>
                {deliveryConfirmation.recipientName && (
                  <Group justify="space-between">
                    <Text size="sm">Recipient:</Text>
                    <Text size="sm" fw={500}>{deliveryConfirmation.recipientName}</Text>
                  </Group>
                )}
                {deliveryConfirmation.deliveryNotes && (
                  <div>
                    <Text size="sm" fw={500} mb="xs">Delivery Notes:</Text>
                    <Text size="sm">{deliveryConfirmation.deliveryNotes}</Text>
                  </div>
                )}
              </Stack>
            </Paper>

            {/* Proof of Delivery Links */}
            {(deliveryConfirmation.proofOfDeliveryUrl || deliveryConfirmation.deliveryImageUrl) && (
              <Paper p="md" withBorder>
                <Text fw={600} mb="md">Proof of Delivery</Text>
                <Stack gap="xs">
                  {deliveryConfirmation.proofOfDeliveryUrl && (
                    <Anchor
                      href={deliveryConfirmation.proofOfDeliveryUrl}
                      target="_blank"
                      size="sm"
                    >
                      <Group gap="xs">
                        <IconDownload size={14} />
                        Download Delivery Receipt
                      </Group>
                    </Anchor>
                  )}
                  {deliveryConfirmation.deliveryImageUrl && (
                    <Anchor
                      href={deliveryConfirmation.deliveryImageUrl}
                      target="_blank"
                      size="sm"
                    >
                      <Group gap="xs">
                        <IconEye size={14} />
                        View Delivery Photo
                      </Group>
                    </Anchor>
                  )}
                </Stack>
              </Paper>
            )}

            <Group justify="flex-end">
              <Button onClick={closeConfirmation}>Close</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}