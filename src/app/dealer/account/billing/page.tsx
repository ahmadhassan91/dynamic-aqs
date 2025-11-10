'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Card,
  Text,
  Stack,
  Group,
  Badge,
  Button,
  Grid,
  ThemeIcon,
  Table,
  LoadingOverlay,
  Paper,
  Alert,
} from '@mantine/core';
import {
  IconCreditCard,
  IconReceipt,
  IconAlertCircle,
  IconCheck,
  IconDownload,
} from '@tabler/icons-react';
import { DealerLayout } from '@/components/layout/DealerLayout';
import { useRouter } from 'next/navigation';

// Mock billing data
const generateMockBillingData = () => {
  return {
    paymentMethod: {
      type: 'Credit Card',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      cardBrand: 'Visa',
    },
    billingAddress: {
      company: 'ABC HVAC Solutions',
      street: '123 Main Street',
      city: 'Atlanta',
      state: 'GA',
      zip: '30301',
      country: 'USA',
    },
    accountBalance: {
      currentBalance: 8450.00,
      creditLimit: 50000,
      availableCredit: 41550,
      pastDue: 0,
    },
    recentInvoices: [
      {
        id: '1',
        invoiceNumber: 'INV-2024-045',
        date: new Date('2024-01-15'),
        dueDate: new Date('2024-02-14'),
        amount: 4250.00,
        status: 'Paid',
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-038',
        date: new Date('2024-01-08'),
        dueDate: new Date('2024-02-07'),
        amount: 1850.00,
        status: 'Paid',
      },
      {
        id: '3',
        invoiceNumber: 'INV-2024-023',
        date: new Date('2023-12-22'),
        dueDate: new Date('2024-01-21'),
        amount: 3200.00,
        status: 'Paid',
      },
    ],
  };
};

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [billingData, setBillingData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('dealerAuth');
    if (!auth) {
      router.push('/dealer/login');
      return;
    }

    // Load billing data
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setBillingData(generateMockBillingData());
      setLoading(false);
    };

    loadData();
  }, [router]);

  if (!billingData) {
    return (
      <DealerLayout>
        <Container size="xl">
          <LoadingOverlay visible={loading} />
        </Container>
      </DealerLayout>
    );
  }

  const { paymentMethod, billingAddress, accountBalance, recentInvoices } = billingData;

  return (
    <DealerLayout>
      <Container size="xl">
        <LoadingOverlay visible={loading} />
        
        <Stack gap="xl">
          {/* Header */}
          <Group justify="space-between">
            <Title order={2}>Billing & Payments</Title>
          </Group>

          {/* Account Balance Alert */}
          {accountBalance.pastDue > 0 && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Past Due Balance"
              color="red"
            >
              You have a past due balance of ${accountBalance.pastDue.toFixed(2)}. 
              Please make a payment to avoid service interruption.
            </Alert>
          )}

          <Grid>
            {/* Account Balance */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder padding="lg" h="100%">
                <Stack gap="md">
                  <Group>
                    <ThemeIcon size="xl" variant="light" color="blue">
                      <IconReceipt size={24} />
                    </ThemeIcon>
                    <div>
                      <Text size="sm" c="dimmed">Current Balance</Text>
                      <Title order={3}>${accountBalance.currentBalance.toFixed(2)}</Title>
                    </div>
                  </Group>
                  
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Credit Limit</Text>
                      <Text fw={500}>${accountBalance.creditLimit.toLocaleString()}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Available Credit</Text>
                      <Text fw={500} c="green">${accountBalance.availableCredit.toLocaleString()}</Text>
                    </Group>
                    {accountBalance.pastDue > 0 && (
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">Past Due</Text>
                        <Text fw={500} c="red">${accountBalance.pastDue.toFixed(2)}</Text>
                      </Group>
                    )}
                  </Stack>

                  <Button fullWidth>Make a Payment</Button>
                </Stack>
              </Card>
            </Grid.Col>

            {/* Payment Method */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder padding="lg" h="100%">
                <Stack gap="md">
                  <Group>
                    <ThemeIcon size="xl" variant="light" color="green">
                      <IconCreditCard size={24} />
                    </ThemeIcon>
                    <div>
                      <Text size="sm" c="dimmed">Payment Method</Text>
                      <Title order={3}>{paymentMethod.cardBrand}</Title>
                    </div>
                  </Group>

                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Card Number</Text>
                      <Text fw={500}>•••• •••• •••• {paymentMethod.last4}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Expiry Date</Text>
                      <Text fw={500}>{paymentMethod.expiryMonth}/{paymentMethod.expiryYear}</Text>
                    </Group>
                  </Stack>

                  <Group>
                    <Button variant="outline" flex={1}>Update Card</Button>
                    <Button variant="outline" flex={1}>Add New Card</Button>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Billing Address */}
          <Card withBorder padding="lg">
            <Stack gap="md">
              <Title order={4}>Billing Address</Title>
              <Text>{billingAddress.company}</Text>
              <Text>{billingAddress.street}</Text>
              <Text>{billingAddress.city}, {billingAddress.state} {billingAddress.zip}</Text>
              <Text>{billingAddress.country}</Text>
              <Button variant="outline" style={{ alignSelf: 'flex-start' }}>Update Address</Button>
            </Stack>
          </Card>

          {/* Recent Invoices */}
          <Card withBorder padding="lg">
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={4}>Recent Invoices</Title>
                <Button variant="outline" size="sm">View All Invoices</Button>
              </Group>

              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Invoice #</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Due Date</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {recentInvoices.map((invoice: any) => (
                    <Table.Tr key={invoice.id}>
                      <Table.Td>
                        <Text fw={500}>{invoice.invoiceNumber}</Text>
                      </Table.Td>
                      <Table.Td>
                        {invoice.date.toLocaleDateString()}
                      </Table.Td>
                      <Table.Td>
                        {invoice.dueDate.toLocaleDateString()}
                      </Table.Td>
                      <Table.Td>
                        <Text fw={500}>${invoice.amount.toFixed(2)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={invoice.status === 'Paid' ? 'green' : invoice.status === 'Overdue' ? 'red' : 'yellow'}
                          leftSection={invoice.status === 'Paid' ? <IconCheck size={12} /> : undefined}
                        >
                          {invoice.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Button
                          variant="subtle"
                          size="xs"
                          leftSection={<IconDownload size={14} />}
                        >
                          Download
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </DealerLayout>
  );
}
