'use client';

import { useState } from 'react';
import { Container, Center } from '@mantine/core';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Logo } from '@/components/ui/Logo';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();

  const handleRegister = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }) => {
    setLoading(true);
    setError(undefined);

    try {
      // Mock registration - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any valid form data
      router.push('/auth/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Center mb="xl">
        <Logo />
      </Center>
      <RegisterForm onSubmit={handleRegister} loading={loading} error={error} />
    </Container>
  );
}