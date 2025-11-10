'use client';

import { useState } from 'react';
import { Container, Center } from '@mantine/core';
import { DealerRegistrationForm } from '@/components/dealer/DealerRegistrationForm';

export default function DealerRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegistration = async (values: any) => {
    setLoading(true);
    setError('');

    try {
      // Mock registration - in real app, this would call an API
      console.log('Dealer registration attempt:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful registration
      setSuccess(true);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Center>
        <div style={{ width: '100%', maxWidth: 600 }}>
          <DealerRegistrationForm
            onSubmit={handleRegistration}
            loading={loading}
            error={error}
            success={success}
          />
        </div>
      </Center>
    </Container>
  );
}