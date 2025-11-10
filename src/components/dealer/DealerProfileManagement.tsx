'use client';

import { useState } from 'react';
import {
  Card,
  Title,
  Text,
  TextInput,
  Button,
  Stack,
  Group,
  Tabs,
  PasswordInput,
  Switch,
  Select,
  Textarea,
  Alert,
  Divider,
  Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconUser,
  IconBuilding,
  IconBell,
  IconShield,
  IconInfoCircle,
  IconCheck,
} from '@tabler/icons-react';

interface DealerProfileManagementProps {
  dealerData: {
    personal: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      title: string;
    };
    company: {
      name: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      phone: string;
      website: string;
      businessType: string;
      taxId: string;
    };
    preferences: {
      emailNotifications: boolean;
      smsNotifications: boolean;
      orderConfirmations: boolean;
      shipmentUpdates: boolean;
      promotionalEmails: boolean;
      language: string;
      timezone: string;
    };
    account: {
      accountNumber: string;
      status: string;
      memberSince: Date;
      creditLimit: number;
      paymentTerms: string;
    };
  };
  onUpdatePersonal: (data: any) => void;
  onUpdateCompany: (data: any) => void;
  onUpdatePreferences: (data: any) => void;
  onChangePassword: (data: any) => void;
}

export function DealerProfileManagement({
  dealerData,
  onUpdatePersonal,
  onUpdateCompany,
  onUpdatePreferences,
  onChangePassword,
}: DealerProfileManagementProps) {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const personalForm = useForm({
    initialValues: dealerData.personal,
    validate: {
      firstName: (value) => (value.length < 2 ? 'First name is required' : null),
      lastName: (value) => (value.length < 2 ? 'Last name is required' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phone: (value) => (value.length < 10 ? 'Valid phone number is required' : null),
    },
  });

  const companyForm = useForm({
    initialValues: dealerData.company,
    validate: {
      name: (value) => (value.length < 2 ? 'Company name is required' : null),
      address: (value) => (value.length < 5 ? 'Address is required' : null),
      city: (value) => (value.length < 2 ? 'City is required' : null),
      state: (value) => (value.length < 2 ? 'State is required' : null),
      zipCode: (value) => (value.length < 5 ? 'ZIP code is required' : null),
    },
  });

  const preferencesForm = useForm({
    initialValues: dealerData.preferences,
  });

  const passwordForm = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      currentPassword: (value) => (value.length < 1 ? 'Current password is required' : null),
      newPassword: (value) => (value.length < 8 ? 'Password must be at least 8 characters' : null),
      confirmPassword: (value, values) =>
        value !== values.newPassword ? 'Passwords do not match' : null,
    },
  });

  const handleSubmit = async (formType: string, data: any) => {
    setLoading(true);
    setSuccess('');
    
    try {
      switch (formType) {
        case 'personal':
          await onUpdatePersonal(data);
          break;
        case 'company':
          await onUpdateCompany(data);
          break;
        case 'preferences':
          await onUpdatePreferences(data);
          break;
        case 'password':
          await onChangePassword(data);
          passwordForm.reset();
          break;
      }
      setSuccess('Changes saved successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card withBorder>
      <Title order={2} mb="lg">Profile & Settings</Title>

      {success && (
        <Alert icon={<IconCheck size="1rem" />} color="green" mb="md">
          {success}
        </Alert>
      )}

      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'profile')}>
        <Tabs.List>
          <Tabs.Tab value="personal" leftSection={<IconUser size={16} />}>
            Personal Info
          </Tabs.Tab>
          <Tabs.Tab value="company" leftSection={<IconBuilding size={16} />}>
            Company Info
          </Tabs.Tab>
          <Tabs.Tab value="preferences" leftSection={<IconBell size={16} />}>
            Preferences
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconShield size={16} />}>
            Security
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="personal" pt="lg">
          <form onSubmit={personalForm.onSubmit((values) => handleSubmit('personal', values))}>
            <Stack>
              <Group grow>
                <TextInput
                  required
                  label="First Name"
                  {...personalForm.getInputProps('firstName')}
                />
                <TextInput
                  required
                  label="Last Name"
                  {...personalForm.getInputProps('lastName')}
                />
              </Group>

              <Group grow>
                <TextInput
                  required
                  label="Email Address"
                  {...personalForm.getInputProps('email')}
                />
                <TextInput
                  required
                  label="Phone Number"
                  {...personalForm.getInputProps('phone')}
                />
              </Group>

              <TextInput
                label="Job Title"
                {...personalForm.getInputProps('title')}
              />

              <Button type="submit" loading={loading}>
                Save Personal Information
              </Button>
            </Stack>
          </form>
        </Tabs.Panel>

        <Tabs.Panel value="company" pt="lg">
          <Stack mb="lg">
            <Group>
              <Text fw={500}>Account Status:</Text>
              <Badge color={dealerData.account.status === 'active' ? 'green' : 'yellow'}>
                {dealerData.account.status}
              </Badge>
            </Group>
            <Group>
              <Text fw={500}>Account Number:</Text>
              <Text>{dealerData.account.accountNumber}</Text>
            </Group>
            <Group>
              <Text fw={500}>Member Since:</Text>
              <Text>{dealerData.account.memberSince.toLocaleDateString()}</Text>
            </Group>
          </Stack>

          <Divider mb="lg" />

          <form onSubmit={companyForm.onSubmit((values) => handleSubmit('company', values))}>
            <Stack>
              <TextInput
                required
                label="Company Name"
                {...companyForm.getInputProps('name')}
              />

              <TextInput
                required
                label="Business Address"
                {...companyForm.getInputProps('address')}
              />

              <Group grow>
                <TextInput
                  required
                  label="City"
                  {...companyForm.getInputProps('city')}
                />
                <TextInput
                  required
                  label="State"
                  {...companyForm.getInputProps('state')}
                />
                <TextInput
                  required
                  label="ZIP Code"
                  {...companyForm.getInputProps('zipCode')}
                />
              </Group>

              <Group grow>
                <TextInput
                  label="Company Phone"
                  {...companyForm.getInputProps('phone')}
                />
                <TextInput
                  label="Website"
                  {...companyForm.getInputProps('website')}
                />
              </Group>

              <Group grow>
                <Select
                  label="Business Type"
                  data={[
                    'HVAC Contractor',
                    'Plumbing Contractor',
                    'Electrical Contractor',
                    'General Contractor',
                    'Distributor',
                    'Other',
                  ]}
                  {...companyForm.getInputProps('businessType')}
                />
                <TextInput
                  label="Tax ID"
                  {...companyForm.getInputProps('taxId')}
                />
              </Group>

              <Button type="submit" loading={loading}>
                Save Company Information
              </Button>
            </Stack>
          </form>
        </Tabs.Panel>

        <Tabs.Panel value="preferences" pt="lg">
          <form onSubmit={preferencesForm.onSubmit((values) => handleSubmit('preferences', values))}>
            <Stack>
              <Title order={4}>Notification Preferences</Title>
              
              <Switch
                label="Email Notifications"
                description="Receive general notifications via email"
                {...preferencesForm.getInputProps('emailNotifications', { type: 'checkbox' })}
              />

              <Switch
                label="SMS Notifications"
                description="Receive urgent notifications via SMS"
                {...preferencesForm.getInputProps('smsNotifications', { type: 'checkbox' })}
              />

              <Switch
                label="Order Confirmations"
                description="Receive email confirmations for new orders"
                {...preferencesForm.getInputProps('orderConfirmations', { type: 'checkbox' })}
              />

              <Switch
                label="Shipment Updates"
                description="Receive notifications when orders ship"
                {...preferencesForm.getInputProps('shipmentUpdates', { type: 'checkbox' })}
              />

              <Switch
                label="Promotional Emails"
                description="Receive information about new products and promotions"
                {...preferencesForm.getInputProps('promotionalEmails', { type: 'checkbox' })}
              />

              <Divider />

              <Title order={4}>Regional Preferences</Title>

              <Group grow>
                <Select
                  label="Language"
                  data={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' },
                  ]}
                  {...preferencesForm.getInputProps('language')}
                />

                <Select
                  label="Timezone"
                  data={[
                    { value: 'EST', label: 'Eastern Time' },
                    { value: 'CST', label: 'Central Time' },
                    { value: 'MST', label: 'Mountain Time' },
                    { value: 'PST', label: 'Pacific Time' },
                  ]}
                  {...preferencesForm.getInputProps('timezone')}
                />
              </Group>

              <Button type="submit" loading={loading}>
                Save Preferences
              </Button>
            </Stack>
          </form>
        </Tabs.Panel>

        <Tabs.Panel value="security" pt="lg">
          <Alert icon={<IconInfoCircle size="1rem" />} mb="lg">
            For security reasons, you will need to enter your current password to make changes.
          </Alert>

          <form onSubmit={passwordForm.onSubmit((values) => handleSubmit('password', values))}>
            <Stack>
              <PasswordInput
                required
                label="Current Password"
                {...passwordForm.getInputProps('currentPassword')}
              />

              <PasswordInput
                required
                label="New Password"
                description="Password must be at least 8 characters long"
                {...passwordForm.getInputProps('newPassword')}
              />

              <PasswordInput
                required
                label="Confirm New Password"
                {...passwordForm.getInputProps('confirmPassword')}
              />

              <Button type="submit" loading={loading}>
                Change Password
              </Button>
            </Stack>
          </form>
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
}