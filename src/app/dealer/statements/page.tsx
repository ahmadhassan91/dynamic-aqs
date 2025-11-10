'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Card,
  Text,
  Stack,
  Group,
  Button,
  Grid,
  LoadingOverlay,
  Table,
  Select,
  Pagination,
  ThemeIcon,
} from '@mantine/core';
import {
  IconFileInvoice,
  IconDownload,
  IconFilter,
  IconCalendar,
} from '@tabler/icons-react';
import { DealerLayout } from '@/components/layout/DealerLayout';
import { useRouter } from 'next/navigation';

// Mock statement data
const generateMockStatements = () => {
  const statements = [];
  const currentDate = new Date();
  
  for (let i = 0; i < 12; i++) {
    const statementDate = new Date(currentDate);
    statementDate.setMonth(statementDate.getMonth() - i);
    
    const monthName = statementDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    statements.push({
      id: `STMT-${statementDate.getFullYear()}-${String(statementDate.getMonth() + 1).padStart(2, '0')}`,
      month: monthName,
      date: statementDate,
      invoices: Math.floor(Math.random() * 8) + 1,
      totalAmount: Math.floor(Math.random() * 50000) + 10000,
      paidAmount: Math.floor(Math.random() * 40000) + 8000,
      balanceForward: Math.floor(Math.random() * 5000),
    });
  }
  
  return statements;
};

export default function StatementsPage() {
  const [loading, setLoading] = useState(true);
  const [statements, setStatements] = useState<any[]>([]);
  const [filteredStatements, setFilteredStatements] = useState<any[]>([]);
  const [yearFilter, setYearFilter] = useState<string | null>(null);
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

    // Load statement data
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockStatements = generateMockStatements();
      setStatements(mockStatements);
      setFilteredStatements(mockStatements);
      setLoading(false);
    };

    loadData();
  }, [router]);

  // Filter statements based on year
  useEffect(() => {
    let filtered = statements;

    if (yearFilter) {
      filtered = filtered.filter(statement =>
        statement.date.getFullYear().toString() === yearFilter
      );
    }

    setFilteredStatements(filtered);
    setCurrentPage(1);
  }, [yearFilter, statements]);

  const totalPages = Math.ceil(filteredStatements.length / itemsPerPage);
  const paginatedStatements = filteredStatements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique years for filter
  const years = Array.from(new Set(statements.map(s => s.date.getFullYear().toString())));
  const yearOptions = [
    { value: 'all', label: 'All Years' },
    ...years.map(year => ({ value: year, label: year })),
  ];

  const currentBalance = filteredStatements.reduce((sum, stmt) => 
    sum + (stmt.totalAmount - stmt.paidAmount), 0
  );

  return (
    <DealerLayout>
      <Container size="xl">
        <LoadingOverlay visible={loading} />
        
        <Stack gap="xl">
          {/* Header */}
          <Group justify="space-between">
            <Title order={2}>Account Statements</Title>
            <Button leftSection={<IconDownload size={16} />}>
              Export All
            </Button>
          </Group>

          {/* Summary Card */}
          <Card withBorder padding="lg">
            <Grid>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">Current Balance</Text>
                  <Title order={3}>${currentBalance.toLocaleString()}</Title>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">Total Statements</Text>
                  <Title order={3}>{filteredStatements.length}</Title>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">Latest Statement</Text>
                  <Title order={3} size="h4">
                    {filteredStatements[0]?.month || 'N/A'}
                  </Title>
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>

          {/* Filters */}
          <Card withBorder padding="lg">
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  placeholder="Filter by year"
                  leftSection={<IconFilter size={16} />}
                  data={yearOptions}
                  value={yearFilter}
                  onChange={(value) => setYearFilter(value === 'all' ? null : value)}
                  clearable
                />
              </Grid.Col>
            </Grid>
          </Card>

          {/* Statements Table */}
          <Card withBorder padding="lg">
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={4}>Monthly Statements</Title>
                <Text size="sm" c="dimmed">
                  {filteredStatements.length} statements
                </Text>
              </Group>

              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Statement Period</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Invoices</Table.Th>
                    <Table.Th>Total Amount</Table.Th>
                    <Table.Th>Paid Amount</Table.Th>
                    <Table.Th>Balance</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {paginatedStatements.map((statement) => {
                    const balance = statement.totalAmount - statement.paidAmount;
                    return (
                      <Table.Tr key={statement.id}>
                        <Table.Td>
                          <Group gap="sm">
                            <ThemeIcon size="md" variant="light" color="blue">
                              <IconCalendar size={16} />
                            </ThemeIcon>
                            <Text fw={500}>{statement.month}</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          {statement.date.toLocaleDateString()}
                        </Table.Td>
                        <Table.Td>
                          <Text c="dimmed">{statement.invoices}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={500}>${statement.totalAmount.toLocaleString()}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text c="green">${statement.paidAmount.toLocaleString()}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text 
                            fw={500}
                            c={balance > 0 ? 'orange' : 'green'}
                          >
                            ${balance.toLocaleString()}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Button
                              variant="subtle"
                              size="xs"
                              leftSection={<IconFileInvoice size={14} />}
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
                    );
                  })}
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

          {/* Help Card */}
          <Card withBorder padding="lg" bg="blue.0">
            <Stack gap="sm">
              <Title order={4}>About Account Statements</Title>
              <Text size="sm">
                Account statements provide a monthly summary of your account activity, including all invoices,
                payments, credits, and your account balance. Statements are generated on the last day of each month
                and are available for download within 3 business days.
              </Text>
              <Text size="sm">
                If you have questions about your statement or notice any discrepancies, please contact our
                accounting department at <strong>accounting@dynamicaqs.com</strong> or call <strong>1-800-DYNAMIC</strong>.
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </DealerLayout>
  );
}
