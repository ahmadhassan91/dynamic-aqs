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
  TextInput,
  Select,
  Pagination,
  Paper,
} from '@mantine/core';
import {
  IconReceipt,
  IconDownload,
  IconSearch,
  IconFilter,
} from '@tabler/icons-react';
import { DealerLayout } from '@/components/layout/DealerLayout';
import { useRouter } from 'next/navigation';

// Mock invoice data
const generateMockInvoices = () => {
  const invoices = [];
  const statuses = ['Paid', 'Pending', 'Overdue'];
  
  for (let i = 0; i < 25; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (i * 7));
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + 30);
    
    invoices.push({
      id: `INV-2024-${String(i + 1).padStart(3, '0')}`,
      invoiceNumber: `INV-2024-${String(i + 1).padStart(3, '0')}`,
      date: date,
      dueDate: dueDate,
      amount: Math.floor(Math.random() * 10000) + 1000,
      status: i < 20 ? 'Paid' : statuses[i % statuses.length],
      items: Math.floor(Math.random() * 10) + 1,
    });
  }
  
  return invoices;
};

export default function InvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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

    // Load invoice data
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockInvoices = generateMockInvoices();
      setInvoices(mockInvoices);
      setFilteredInvoices(mockInvoices);
      setLoading(false);
    };

    loadData();
  }, [router]);

  // Filter invoices based on search and status
  useEffect(() => {
    let filtered = invoices;

    if (searchQuery) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    setFilteredInvoices(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, invoices]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = filteredInvoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = filteredInvoices
    .filter(inv => inv.status !== 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <DealerLayout>
      <Container size="xl">
        <LoadingOverlay visible={loading} />
        
        <Stack gap="xl">
          {/* Header */}
          <Group justify="space-between">
            <Title order={2}>Invoices</Title>
            <Button leftSection={<IconDownload size={16} />}>
              Export All
            </Button>
          </Group>

          {/* Summary Cards */}
          <Grid>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Card withBorder padding="lg">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">Total Invoiced</Text>
                  <Title order={3}>${totalAmount.toLocaleString()}</Title>
                  <Text size="xs" c="dimmed">{filteredInvoices.length} invoices</Text>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Card withBorder padding="lg">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">Paid</Text>
                  <Title order={3} c="green">${paidAmount.toLocaleString()}</Title>
                  <Text size="xs" c="dimmed">
                    {filteredInvoices.filter(i => i.status === 'Paid').length} invoices
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Card withBorder padding="lg">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">Pending/Overdue</Text>
                  <Title order={3} c="orange">${pendingAmount.toLocaleString()}</Title>
                  <Text size="xs" c="dimmed">
                    {filteredInvoices.filter(i => i.status !== 'Paid').length} invoices
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Filters */}
          <Card withBorder padding="lg">
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  placeholder="Search by invoice number"
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  placeholder="Filter by status"
                  leftSection={<IconFilter size={16} />}
                  data={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'Paid', label: 'Paid' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Overdue', label: 'Overdue' },
                  ]}
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value === 'all' ? null : value)}
                  clearable
                />
              </Grid.Col>
            </Grid>
          </Card>

          {/* Invoices Table */}
          <Card withBorder padding="lg">
            <Stack gap="md">
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Invoice #</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Due Date</Table.Th>
                    <Table.Th>Items</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {paginatedInvoices.map((invoice) => (
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
                        <Text c="dimmed">{invoice.items}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={500}>${invoice.amount.toLocaleString()}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={
                            invoice.status === 'Paid' ? 'green' :
                            invoice.status === 'Overdue' ? 'red' : 'yellow'
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Button
                            variant="subtle"
                            size="xs"
                            leftSection={<IconReceipt size={14} />}
                          >
                            View
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
