'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  TextInput,
  Select,
  Button,
  Stack,
  Group,
  Alert
} from '@mantine/core';
import { User, UserRole, UserStatus } from '@/types/admin';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onSave: (user: User) => void;
}

export default function UserFormModal({ isOpen, onClose, user, onSave }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    roleId: '',
    status: UserStatus.ACTIVE,
    territoryId: '',
    regionalManagerId: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = [
    { value: '1', label: 'Territory Manager' },
    { value: '2', label: 'Regional Director' },
    { value: '3', label: 'Admin' }
  ];

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roleId: user.role.id,
          status: user.status,
          territoryId: user.territoryId || '',
          regionalManagerId: user.regionalManagerId || ''
        });
      } else {
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          roleId: '',
          status: UserStatus.ACTIVE,
          territoryId: '',
          regionalManagerId: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.roleId) {
      newErrors.roleId = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Mock save operation
      const mockUser: User = {
        id: user?.id || Date.now().toString(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: { id: formData.roleId, name: roles.find(r => r.value === formData.roleId)?.label || '', permissions: [] },
        status: formData.status,
        territoryId: formData.territoryId || undefined,
        regionalManagerId: formData.regionalManagerId || undefined,
        createdAt: user?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: user?.lastLoginAt
      };

      onSave(mockUser);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      setErrors({ submit: 'Failed to save user. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={user ? 'Edit User' : 'Create New User'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Email Address"
            placeholder="user@dynamicaqs.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.currentTarget.value })}
            error={errors.email}
            required
          />

          <Group grow>
            <TextInput
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.currentTarget.value })}
              error={errors.firstName}
              required
            />
            <TextInput
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.currentTarget.value })}
              error={errors.lastName}
              required
            />
          </Group>

          <Select
            label="Role"
            placeholder="Select a role"
            value={formData.roleId}
            onChange={(value) => setFormData({ ...formData, roleId: value || '' })}
            data={roles}
            error={errors.roleId}
            required
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: (value as UserStatus) || UserStatus.ACTIVE })}
            data={Object.values(UserStatus).map(status => ({ value: status, label: status }))}
          />

          <TextInput
            label="Territory ID"
            placeholder="Optional territory assignment"
            value={formData.territoryId}
            onChange={(e) => setFormData({ ...formData, territoryId: e.currentTarget.value })}
          />

          <TextInput
            label="Regional Director ID"
            placeholder="Optional regional director assignment"
            value={formData.regionalManagerId}
            onChange={(e) => setFormData({ ...formData, regionalManagerId: e.currentTarget.value })}
          />

          {errors.submit && (
            <Alert color="red" title="Error">
              {errors.submit}
            </Alert>
          )}

          <Group justify="flex-end" gap="sm">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {user ? 'Update User' : 'Create User'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}