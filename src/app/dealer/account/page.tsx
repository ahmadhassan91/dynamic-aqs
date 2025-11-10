'use client';

import { useState, useEffect } from 'react';
import { Container, LoadingOverlay, Title, Text, Card, Group, Stack, Grid, Badge, Button, Table, Progress } from '@mantine/core';
import { DealerLayout } from '@/components/layout/DealerLayout';
import { useRouter } from 'next/navigation';
import { IconCreditCard, IconReceipt, IconTrendingUp, IconCalendar, IconDownload } from '@tabler/icons-react';

interface AccountInfo {
  accountNumber: string;
  status: 'active' | 'suspended' | 'pending';
  memberSince: Date;
  creditLimit: number;
  availableCredit: number;
  currentBalance: number;
  paymentTerms: string;
  lastPayment: {
    amount: number;
    date: Date;
  };
  territoryManager: {
    name: string;
    email: string;
    phone: string;
  };
}

interface Statement {
  id: string;
  period: string;
  dueDate: Date;
  amount: number;
  status: 'paid' | 'overdue' | 'pending';
}

const generateMockAccountData = (): { account: AccountInfo; statements: Statement[] } => {
  const account: AccountInfo = {
    accountNumber: 'DLR-12345',
    status: 'active',
    memberSince: new Date('2020-03-15'),
    creditLimit: 50000,
    availableCredit: 35000,
    currentBalance: 15000,
    paymentTerms: 'Net 30',
    lastPayment: {
      amount: 8500,
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    territoryManager: {
      name: 'John Smith',
      email: 'john.smith@dynamicaqs.com',
      phone: '(555) 123-4567',
    },
  };

  const statements: Statement[] = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    return {
      id: `stmt-${i + 1}`,
      period: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      dueDate: new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000),
      amount: Math.floor(Math.random() * 10000) + 2000,
      status: i === 0 ? 'pending' : i === 1 ? 'overdue' : 'paid',
    };
  });

  return { account, statements };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'green';
    case 'suspended': return 'red';
    case 'pending': return 'yellow';
    case 'paid': return 'green';
    case 'overdue': return 'red';
    default: return 'gray';
  }
};

export default function DealerAccountPage() {
  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState<{ account: AccountInfo; statements: Statement[] } | null>(null);
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
      setAccountData(generateMockAccountData());
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

  const handleDownloadStatement = (statementId: string) => {
    console.log('Downloading statement:', statementId);
    // In a real app, this would download the PDF statement
    alert('Statement download would start here');
  };

  const handleMakePayment = () => {
    console.log('Redirecting to payment portal');
    // In a real app, this would redirect to a payment portal
    alert('Payment portal would open here');
  };

  if (loading || !accountData || !user) {
    return <LoadingOverlay visible />;
  }

  const { account, statements } = accountData;
  const creditUtilization = ((account.creditLimit - account.availableCredit) / account.creditLimit) * 100;

  return (
    <DealerLayout>
      <Container size="xl">
        <Stack gap="lg">
          <div>
            <Title order={2}>Account Information</Title>
            <Text c="dimmed">Manage your account details and billing information</Text>
          </div>

          {/* Account Overview */}
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card withBorder>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Title order={4}>Account Overview</Title>
                    <Badge color={getStatusColor(account.status)} variant="light">
                      {account.status}
                    </Badge>
                  </Group>

                  <Grid>
                    <Grid.Col span={6}>
                      <Stack gap="xs">
                        <Text size="sm" c="dimmed">Account Number</Text>
                        <Text fw={500}>{account.accountNumber}</Text>
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Stack gap="xs">
                        <Text size="sm" c="dimmed">Member Since</Text>
                        <Text fw={500}>{account.memberSince.toLocaleDateString()}</Text>
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Stack gap="xs">
                        <Text size="sm" c="dimmed">Payment Terms</Text>
                        <Text fw={500}>{account.paymentTerms}</Text>
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Stack gap="xs">
                        <Text size="sm" c="dimmed">Current Balance</Text>
                        <Text fw={500} c="red">${account.currentBalance.toLocaleString()}</Text>
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card withBorder>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Title order={4}>Credit Information</Title>
                    <IconCreditCard size={20} />
                  </Group>

                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="sm">Credit Limit</Text>
                      <Text fw={500}>${account.creditLimit.toLocaleString()}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">Available Credit</Text>
                      <Text fw={500} c="green">${account.availableCredit.toLocaleString()}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">Utilization</Text>
                      <Text fw={500}>{creditUtilization.toFixed(1)}%</Text>
                    </Group>
                  </Stack>

                  <Progress value={creditUtilization} color={creditUtilization > 80 ? 'red' : 'blue'} />
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Territory Manager */}
          <Card withBorder>
            <Stack gap="md">
              <Title order={4}>Territory Manager</Title>
              <Grid>
                <Grid.Col span={4}>
                  <Stack gap="xs">
                    <Text size="sm" c="dimmed">Name</Text>
                    <Text fw={500}>{account.territoryManager.name}</Text>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Stack gap="xs">
                    <Text size="sm" c="dimmed">Email</Text>
                    <Text fw={500}>{account.territoryManager.email}</Text>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Stack gap="xs">
                    <Text size="sm" c="dimmed">Phone</Text>
                    <Text fw={500}>{account.territoryManager.phone}</Text>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Stack>
          </Card>

          {/* Billing Statements */}
          <Card withBorder>
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={4}>Billing Statements</Title>
                <Button leftSection={<IconCreditCard size={16} />} onClick={handleMakePayment}>
                  Make Payment
                </Button>
              </Group>

              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Period</Table.Th>
                    <Table.Th>Due Date</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {statements.slice(0, 6).map((statement) => (
                    <Table.Tr key={statement.id}>
                      <Table.Td>
                        <Text fw={500}>{statement.period}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{statement.dueDate.toLocaleDateString()}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={500}>${statement.amount.toLocaleString()}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(statement.status)} variant="light">
                          {statement.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Button
                          variant="light"
                          size="xs"
                          leftSection={<IconDownload size={14} />}
                          onClick={() => handleDownloadStatement(statement.id)}
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