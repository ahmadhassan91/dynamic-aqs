'use client';

import { useState, useEffect } from 'react';
import {
  Stack,
  TextInput,
  Select,
  Textarea,
  Button,
  Group,
  NumberInput,
  Grid,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { MockLead } from '@/lib/mockData/generators';

interface LeadFormModalProps {
  lead?: MockLead | null;
  onSave: (lead: MockLead) => void;
  onCancel: () => void;
}

export function LeadFormModal({ lead, onSave, onCancel }: LeadFormModalProps) {
  const form = useForm({
    initialValues: {
      contactName: lead?.contactName || '',
      companyName: lead?.companyName || '',
      email: lead?.email || '',
      phone: lead?.phone || '',
      source: lead?.source || 'website',
      status: lead?.status || 'new',
      score: lead?.score || 0,
      assignedTo: lead?.assignedTo || '',
      notes: lead?.notes || '',
      discoveryCallDate: lead?.discoveryCallDate || null,
    },
    validate: {
      contactName: (value) => (value.length < 2 ? 'Contact name must have at least 2 letters' : null),
      companyName: (value) => (value.length < 2 ? 'Company name must have at least 2 letters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phone: (value) => (value.length < 10 ? 'Phone number must be at least 10 digits' : null),
      score: (value) => (value < 0 || value > 100 ? 'Score must be between 0 and 100' : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    const updatedLead: MockLead = {
      id: lead?.id || crypto.randomUUID(),
      contactName: values.contactName,
      companyName: values.companyName,
      email: values.email,
      phone: values.phone,
      source: values.source as MockLead['source'],
      status: values.status as MockLead['status'],
      score: values.score,
      assignedTo: values.assignedTo,
      notes: values.notes,
      discoveryCallDate: values.discoveryCallDate || undefined,
      cisSubmittedDate: lead?.cisSubmittedDate,
      createdAt: lead?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(updatedLead);
  };

  const sourceOptions = [
    { value: 'hubspot', label: 'HubSpot' },
    { value: 'referral', label: 'Referral' },
    { value: 'website', label: 'Website' },
    { value: 'trade_show', label: 'Trade Show' },
  ];

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'discovery', label: 'Discovery' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' },
  ];

  // Mock territory managers for assignment
  const territoryManagers = [
    { value: 'tm-1', label: 'John Smith (Northeast)' },
    { value: 'tm-2', label: 'Sarah Johnson (Southeast)' },
    { value: 'tm-3', label: 'Mike Davis (Midwest)' },
    { value: 'tm-4', label: 'Lisa Wilson (Southwest)' },
    { value: 'tm-5', label: 'David Brown (West Coast)' },
    { value: 'tm-6', label: 'Emily Taylor (Northwest)' },
  ];

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="Contact Name"
              placeholder="Enter contact name"
              required
              {...form.getInputProps('contactName')}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Company Name"
              placeholder="Enter company name"
              required
              {...form.getInputProps('companyName')}
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="Email"
              placeholder="Enter email address"
              required
              {...form.getInputProps('email')}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Phone"
              placeholder="Enter phone number"
              required
              {...form.getInputProps('phone')}
            />
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={4}>
            <Select
              label="Lead Source"
              placeholder="Select source"
              data={sourceOptions}
              required
              {...form.getInputProps('source')}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              label="Status"
              placeholder="Select status"
              data={statusOptions}
              required
              {...form.getInputProps('status')}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="Lead Score"
              placeholder="0-100"
              min={0}
              max={100}
              {...form.getInputProps('score')}
            />
          </Grid.Col>
        </Grid>

        <Select
          label="Assigned To"
          placeholder="Select territory manager"
          data={territoryManagers}
          searchable
          {...form.getInputProps('assignedTo')}
        />

        <DateTimePicker
          label="Discovery Call Date"
          placeholder="Select date and time"
          clearable
          {...form.getInputProps('discoveryCallDate')}
        />

        <Textarea
          label="Notes"
          placeholder="Enter any notes about this lead"
          minRows={3}
          {...form.getInputProps('notes')}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {lead ? 'Update Lead' : 'Create Lead'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}