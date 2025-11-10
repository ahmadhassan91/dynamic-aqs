'use client';

import { useState } from 'react';
import { Container, Center } from '@mantine/core';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Logo } from '@/components/ui/Logo';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);

  const handleForgotPassword = async (values: { email: string }) => {
    setLoading(true);
    setError(undefined);

    try {
      // Mock password reset - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, always succeed
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Center mb="xl">
        <Logo />
      </Center>
      <ForgotPasswordForm 
        onSubmit={handleForgotPassword} 
        loading={loading} 
        error={error}
        success={success}
      />
    </Container>
  );
}