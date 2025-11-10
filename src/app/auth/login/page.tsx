'use client';

import { useState } from 'react';
import { Container, Center, Box } from '@mantine/core';
import { LoginForm } from '@/components/auth/LoginForm';
import { Logo } from '@/components/ui/Logo';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();

  const handleLogin = async (values: { email: string; password: string; rememberMe: boolean }) => {
    setLoading(true);
    setError(undefined);

    try {
      // Mock authentication - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password
      if (values.email && values.password) {
        router.push('/');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Center mb="xl">
        <Logo />
      </Center>
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </Container>
  );
}