'use client';

import { useState, useEffect } from 'react';
import { Container, LoadingOverlay, Title, Text, Card, Group, Badge, Stack, Button, Table, ActionIcon, Tooltip, SimpleGrid, Paper, ThemeIcon } from '@mantine/core';
import { DealerNavigation } from '@/components/dealer/DealerNavigation';
import { useRouter } from 'next/navigation';
import { IconTruck, IconEye, IconMapPin, IconCalendar, IconPackage, IconClock, IconHistory, IconRefresh } from '@tabler/icons-react';

interface Shipment {
  id: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  status: 'in_transit' | 'out_for_delivery' | 'delivered' | 'delayed';
  shippedDate: Date;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  shippingAddress: {
    name: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

const generateMockShipments = (): Shipment[] => {
  const statuses: Array<'in_transit' | 'out_for_delivery' | 'delivered' | 'delayed'> = 
    ['in_transit', 'out_for_delivery', 'delivered', 'delayed'];
  const carriers = ['UPS', 'FedEx', 'USPS'];
  
  return Array.from({ length: 15 }, (_, i) => {
    const shippedDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: `ship-${i + 1}`,
      orderNumber: `ORD-2024-${String(i + 1).padStart(3, '0')}`,
      trackingNumber: `1Z${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      carrier: carriers[Math.floor(Math.random() * carriers.length)],
      status,
      shippedDate,
      estimatedDelivery: new Date(shippedDate.getTime() + (3 + Math.random() * 5) * 24 * 60 * 60 * 1000),
      actualDelivery: status === 'delivered' ? 
        new Date(shippedDate.getTime() + (2 + Math.random() * 6) * 24 * 60 * 60 * 1000) : undefined,
      items: [
        { name: 'AQS Pro Series Heat Pump', quantity: 1 },
        { name: 'AQS Smart Thermostat', quantity: 2 },
      ],
      shippingAddress: {
        name: 'Mike Johnson',
        company: 'ABC HVAC Solutions',
        address: '123 Industrial Blvd',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
      },
    };
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered': return 'green';
    case 'out_for_delivery': return 'blue';
    case 'in_transit': return 'yellow';
    case 'delayed': return 'red';
    default: return 'gray';
  }
};

export default function DealerShipmentsPage() {
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('dealerAuth');
    if (!auth) {
      router.push('/dealer/login');
      return;
    }

    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShipments(generateMockShipments());
      setUser({
        name: 'Mike Johnson',
        email: 'mike@abchvac.com',
        companyName: 'ABC HVAC Solutions',
        role: 'Owner',
      });
      setLoading(false);
    };

    loadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('dealerAuth');
    router.push('/dealer/login');
  };

  const handleTrackShipment = (trackingNumber: string, carrier: string) => {
    // In a real app, this would open the carrier's tracking page
    const trackingUrls = {
      'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
      'FedEx': `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`,
      'USPS': `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${trackingNumber}`,
    };
    
    window.open(trackingUrls[carrier as keyof typeof trackingUrls] || '#', '_blank');
  };

  if (loading || !user) {
    return <LoadingOverlay visible />;
  }

  return (
    <DealerNavigation user={user} onLogout={handleLogout}>
      <Container size="xl">
        <Stack gap="lg">
          <div>
            <Title order={2}>Shipments</Title>
            <Text c="dimmed">Track your orders and shipments</Text>
          </div>

          {/* Quick Access Cards */}
          <SimpleGrid cols={3} spacing="md">
            <Paper p="md" withBorder style={{ cursor: 'pointer' }} onClick={() => router.push('/dealer/shipments/schedule')}>
              <Group>
                <ThemeIcon size="lg" variant="light" color="blue">
                  <IconCalendar size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={500}>Schedule Shipments</Text>
                  <Text size="sm" c="dimmed">Manage delivery schedules</Text>
                </div>
              </Group>
            </Paper>
            
            <Paper p="md" withBorder style={{ cursor: 'pointer' }} onClick={() => router.push('/dealer/shipments/history')}>
              <Group>
                <ThemeIcon size="lg" variant="light" color="green">
                  <IconHistory size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={500}>Shipment History</Text>
                  <Text size="sm" c="dimmed">View past deliveries</Text>
                </div>
              </Group>
            </Paper>
            
            <Paper p="md" withBorder style={{ cursor: 'pointer' }}>
              <Group>
                <ThemeIcon size="lg" variant="light" color="orange">
                  <IconRefresh size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={500}>Reschedule Requests</Text>
                  <Text size="sm" c="dimmed">Manage reschedule requests</Text>
                </div>
              </Group>
            </Paper>
          </SimpleGrid>

          <Card withBorder>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Order</Table.Th>
                  <Table.Th>Tracking Number</Table.Th>
                  <Table.Th>Carrier</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Shipped Date</Table.Th>
                  <Table.Th>Est. Delivery</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {shipments.map((shipment) => (
                  <Table.Tr key={shipment.id}>
                    <Table.Td>
                      <Text fw={500}>{shipment.orderNumber}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" ff="monospace">{shipment.trackingNumber}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <IconTruck size={16} />
                        <Text size="sm">{shipment.carrier}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(shipment.status)} variant="light">
                        {shipment.status.replace('_', ' ')}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{shipment.shippedDate.toLocaleDateString()}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {shipment.actualDelivery?.toLocaleDateString() || 
                         shipment.estimatedDelivery.toLocaleDateString()}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="Track Package">
                          <ActionIcon
                            variant="light"
                            onClick={() => handleTrackShipment(shipment.trackingNumber, shipment.carrier)}
                          >
                            <IconMapPin size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="View Details">
                          <ActionIcon variant="light">
                            <IconEye size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Stack>
      </Container>
    </DealerNavigation>
  );
}