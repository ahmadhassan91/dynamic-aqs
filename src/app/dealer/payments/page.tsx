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
  LoadingOverlay,
  Table,
  Select,
  Pagination,
  ThemeIcon,
  TextInput,
} from '@mantine/core';
import {
  IconCreditCard,
  IconDownload,
  IconFilter,
  IconSearch,
  IconCheck,
} from '@tabler/icons-react';
import { DealerLayout } from '@/components/layout/DealerLayout';
import { useRouter } from 'next/navigation';

// Mock payment data
const generateMockPayments = () => {
  const payments = [];
  const methods = ['Credit Card', 'ACH Transfer', 'Check', 'Wire Transfer'];
  const statuses = ['Completed', 'Processing', 'Failed'];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (i * 5));
    
    payments.push({
      id: `PAY-${String(i + 1).padStart(4, '0')}`,
      transactionId: `TXN-2024-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
      date: date,
      amount: Math.floor(Math.random() * 10000) + 500,
      method: methods[i % methods.length],
      status: i < 25 ? 'Completed' : statuses[i % statuses.length],
      invoiceNumber: `INV-2024-${String(i + 1).padStart(3, '0')}`,
      last4: i % 4 === 0 ? '4242' : i % 4 === 1 ? '5555' : i % 4 === 2 ? '1234' : null,
    });
  }
  
  return payments;
};

export default function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const itemsPerPage = 10;

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('dealerAuth');
    if (!auth) {
      router.push('/dealer/login');
      return;
    }

    // Load payment data
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockPayments = generateMockPayments();
      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
      setLoading(false);
    };

    loadData();
  }, [router]);

  // Filter payments
  useEffect(() => {
    let filtered = payments;

    if (searchQuery) {
      filtered = filtered.filter(payment =>
        payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (methodFilter) {
      filtered = filtered.filter(payment => payment.method === methodFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    setFilteredPayments(filtered);
    setCurrentPage(1);
  }, [searchQuery, methodFilter, statusFilter, payments]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalAmount = filteredPayments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = filteredPayments
    .filter(p => p.status === 'Processing')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <DealerLayout>
      <Container size="xl">
        <LoadingOverlay visible={loading} />
        
        <Stack gap="xl">
          {/* Header */}
          <Group justify="space-between">
            <Title order={2}>Payment History</Title>
            <Group>
              <Button variant="outline" leftSection={<IconCreditCard size={16} />}>
                Make Payment
              </Button>
              <Button leftSection={<IconDownload size={16} />}>
                Export
              </Button>
            </Group>
          </Group>

          {/* Summary Cards */}
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Card withBorder padding="lg">
                <Stack gap="xs">
                  <Group>
                    <ThemeIcon size="lg" variant="light" color="green">
                      <IconCheck size={20} />
                    </ThemeIcon>
                    <div>
                      <Text size="sm" c="dimmed">Total Paid</Text>
                      <Title order={3}>${totalAmount.toLocaleString()}</Title>
                    </div>
                  </Group>
                  <Text size="xs" c="dimmed">
                    {filteredPayments.filter(p => p.status === 'Completed').length} completed payments
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Card withBorder padding="lg">
                <Stack gap="xs">
                  <Group>
                    <ThemeIcon size="lg" variant="light" color="yellow">
                      <IconCreditCard size={20} />
                    </ThemeIcon>
                    <div>
                      <Text size="sm" c="dimmed">Processing</Text>
                      <Title order={3}>${pendingAmount.toLocaleString()}</Title>
                    </div>
                  </Group>
                  <Text size="xs" c="dimmed">
                    {filteredPayments.filter(p => p.status === 'Processing').length} pending payments
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Filters */}
          <Card withBorder padding="lg">
            <Grid>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <TextInput
                  placeholder="Search by transaction or invoice"
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Select
                  placeholder="Filter by method"
                  leftSection={<IconFilter size={16} />}
                  data={[
                    { value: 'all', label: 'All Methods' },
                    { value: 'Credit Card', label: 'Credit Card' },
                    { value: 'ACH Transfer', label: 'ACH Transfer' },
                    { value: 'Check', label: 'Check' },
                    { value: 'Wire Transfer', label: 'Wire Transfer' },
                  ]}
                  value={methodFilter}
                  onChange={(value) => setMethodFilter(value === 'all' ? null : value)}
                  clearable
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Select
                  placeholder="Filter by status"
                  leftSection={<IconFilter size={16} />}
                  data={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'Completed', label: 'Completed' },
                    { value: 'Processing', label: 'Processing' },
                    { value: 'Failed', label: 'Failed' },
                  ]}
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value === 'all' ? null : value)}
                  clearable
                />
              </Grid.Col>
            </Grid>
          </Card>

          {/* Payments Table */}
          <Card withBorder padding="lg">
            <Stack gap="md">
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Transaction ID</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Method</Table.Th>
                    <Table.Th>Invoice</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {paginatedPayments.map((payment) => (
                    <Table.Tr key={payment.id}>
                      <Table.Td>
                        <Text fw={500} size="sm">{payment.transactionId}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{payment.date.toLocaleDateString()}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={500}>${payment.amount.toLocaleString()}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ThemeIcon size="sm" variant="light" color="blue">
                            <IconCreditCard size={12} />
                          </ThemeIcon>
                          <Text size="sm">
                            {payment.method}
                            {payment.last4 && ` ••${payment.last4}`}
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">{payment.invoiceNumber}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={
                            payment.status === 'Completed' ? 'green' :
                            payment.status === 'Failed' ? 'red' : 'yellow'
                          }
                          leftSection={payment.status === 'Completed' ? <IconCheck size={12} /> : undefined}
                        >
                          {payment.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Button
                            variant="subtle"
                            size="xs"
                          >
                            View Receipt
                          </Button>
                          <Button
                            variant="subtle"
                            size="xs"
                            leftSection={<IconDownload size={14} />}
                          >
                            PDF
                          </Button>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              {totalPages > 1 && (
                <Group justify="center">
                  <Pagination
                    value={currentPage}
                    onChange={setCurrentPage}
                    total={totalPages}
                  />
                </Group>
              )}
            </Stack>
          </Card>
        </Stack>
      </Container>
    </DealerLayout>
  );
}
