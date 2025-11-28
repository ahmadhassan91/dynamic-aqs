'use client';

import { useState } from 'react';
import {
    Modal,
    TextInput,
    Select,
    Textarea,
    Button,
    Group,
    Stack,
    Grid,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import type { MockCustomer } from '@/lib/mockData/generators';
import { useMockData } from '@/lib/mockData/MockDataProvider';

interface CustomerFormModalProps {
    opened: boolean;
    onClose: () => void;
    customer?: MockCustomer;
    onSave: (customer: Partial<MockCustomer>) => void;
}

export function CustomerFormModal({ opened, onClose, customer, onSave }: CustomerFormModalProps) {
    const [loading, setLoading] = useState(false);
    const isEditing = !!customer;
    const { territories, users, affinityGroups, ownershipGroups } = useMockData();

    // Get territory managers
    const territoryManagers = users.filter(user => user.role === 'territory_manager');

    const form = useForm({
        initialValues: {
            contactName: customer?.contactName || '',
            email: customer?.email || '',
            phone: customer?.phone || '',
            companyName: customer?.companyName || '',
            street: customer?.address?.street || '',
            city: customer?.address?.city || '',
            state: customer?.address?.state || '',
            zipCode: customer?.address?.zipCode || '',
            status: customer?.status || 'prospect',
            territoryManagerId: customer?.territoryManagerId || '',
            affinityGroupId: customer?.affinityGroupId || '',
            ownershipGroupId: customer?.ownershipGroupId || '',
        },
        validate: {
            contactName: (value: string) => (!value ? 'Contact name is required' : null),
            email: (value: string) => (!value ? 'Email is required' : !/^\S+@\S+$/.test(value) ? 'Invalid email' : null),
            phone: (value: string) => (!value ? 'Phone is required' : null),
            companyName: (value: string) => (!value ? 'Company name is required' : null),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const customerData: Partial<MockCustomer> = {
                id: customer?.id || `customer-${Date.now()}`,
                contactName: values.contactName,
                email: values.email,
                phone: values.phone,
                companyName: values.companyName,
                address: {
                    street: values.street,
                    city: values.city,
                    state: values.state,
                    zipCode: values.zipCode,
                },
                status: values.status as 'active' | 'inactive' | 'prospect',
                territoryManagerId: values.territoryManagerId,
                affinityGroupId: values.affinityGroupId || undefined,
                ownershipGroupId: values.ownershipGroupId || undefined,
                createdAt: customer?.createdAt || new Date(),
                updatedAt: new Date(),
            };

            onSave(customerData);

            notifications.show({
                title: 'Success',
                message: `Customer ${isEditing ? 'updated' : 'created'} successfully`,
                color: 'green',
            });

            form.reset();
            onClose();
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: `Failed to ${isEditing ? 'update' : 'create'} customer`,
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={isEditing ? 'Edit Customer' : 'Add New Customer'}
            size="lg"
        >
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
                                label="Email"
                                placeholder="customer@company.com"
                                required
                                {...form.getInputProps('email')}
                            />
                        </Grid.Col>
                    </Grid>

                    <Grid>
                        <Grid.Col span={6}>
                            <TextInput
                                label="Phone"
                                placeholder="+1 (555) 123-4567"
                                required
                                {...form.getInputProps('phone')}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="Company Name"
                                placeholder="Company name"
                                required
                                {...form.getInputProps('companyName')}
                            />
                        </Grid.Col>
                    </Grid>

                    <TextInput
                        label="Street Address"
                        placeholder="Street address"
                        {...form.getInputProps('street')}
                    />

                    <Grid>
                        <Grid.Col span={4}>
                            <TextInput
                                label="City"
                                placeholder="City"
                                {...form.getInputProps('city')}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <TextInput
                                label="State"
                                placeholder="State"
                                {...form.getInputProps('state')}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <TextInput
                                label="ZIP Code"
                                placeholder="12345"
                                {...form.getInputProps('zipCode')}
                            />
                        </Grid.Col>
                    </Grid>

                    <Select
                        label="Status"
                        placeholder="Select status"
                        data={[
                            { value: 'prospect', label: 'Prospect' },
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' },
                        ]}
                        {...form.getInputProps('status')}
                    />

                    {/* Assignment Fields */}
                    <Select
                        label="Territory Manager"
                        placeholder="Select territory manager"
                        data={territoryManagers.map(tm => ({
                            value: tm.id,
                            label: `${tm.firstName} ${tm.lastName}`
                        }))}
                        clearable
                        {...form.getInputProps('territoryManagerId')}
                    />

                    <Grid>
                        <Grid.Col span={6}>
                            <Select
                                label="Affinity Group"
                                placeholder="Select affinity group"
                                data={affinityGroups.map(ag => ({
                                    value: ag.id,
                                    label: ag.name
                                }))}
                                clearable
                                {...form.getInputProps('affinityGroupId')}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Select
                                label="Ownership Group"
                                placeholder="Select ownership group"
                                data={ownershipGroups.map(og => ({
                                    value: og.id,
                                    label: og.name
                                }))}
                                clearable
                                {...form.getInputProps('ownershipGroupId')}
                            />
                        </Grid.Col>
                    </Grid>

                    <Group justify="flex-end" mt="md">
                        <Button variant="outline" onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={loading}>
                            {isEditing ? 'Update Customer' : 'Create Customer'}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}