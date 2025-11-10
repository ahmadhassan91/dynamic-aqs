'use client';

import { useState, useEffect } from 'react';
import { Container, LoadingOverlay } from '@mantine/core';
import { DealerProfileManagement } from '@/components/dealer/DealerProfileManagement';
import { DealerNavigation } from '@/components/dealer/DealerNavigation';
import { useRouter } from 'next/navigation';

// Mock data generator for dealer profile
const generateMockProfileData = () => {
  return {
    personal: {
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike@abchvac.com',
      phone: '(555) 987-6543',
      title: 'Owner/Manager',
    },
    company: {
      name: 'ABC HVAC Solutions',
      address: '123 Industrial Blvd',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      phone: '(555) 123-4567',
      website: 'www.abchvac.com',
      businessType: 'HVAC Contractor',
      taxId: '12-3456789',
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      orderConfirmations: true,
      shipmentUpdates: true,
      promotionalEmails: true,
      language: 'en',
      timezone: 'CST',
    },
    account: {
      accountNumber: 'DLR-12345',
      status: 'active',
      memberSince: new Date('2020-03-15'),
      creditLimit: 50000,
      paymentTerms: 'Net 30',
    },
    user: {
      name: 'Mike Johnson',
      email: 'mike@abchvac.com',
      companyName: 'ABC HVAC Solutions',
      role: 'Owner',
    },
  };
};

export default function DealerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('dealerAuth');
    if (!auth) {
      router.push('/dealer/login');
      return;
    }

    // Load profile data
    const loadData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setProfileData(generateMockProfileData());
      setLoading(false);
    };

    loadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('dealerAuth');
    router.push('/dealer/login');
  };

  const handleUpdatePersonal = async (data: any) => {
    console.log('Updating personal info:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProfileData((prev: any) => ({
      ...prev,
      personal: { ...prev.personal, ...data },
    }));
  };

  const handleUpdateCompany = async (data: any) => {
    console.log('Updating company info:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProfileData((prev: any) => ({
      ...prev,
      company: { ...prev.company, ...data },
    }));
  };

  const handleUpdatePreferences = async (data: any) => {
    console.log('Updating preferences:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProfileData((prev: any) => ({
      ...prev,
      preferences: { ...prev.preferences, ...data },
    }));
  };

  const handleChangePassword = async (data: any) => {
    console.log('Changing password:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Password change doesn't update local state
  };

  if (loading || !profileData) {
    return <LoadingOverlay visible />;
  }

  return (
    <DealerNavigation user={profileData.user} onLogout={handleLogout}>
      <Container size="lg">
        <DealerProfileManagement
          dealerData={profileData}
          onUpdatePersonal={handleUpdatePersonal}
          onUpdateCompany={handleUpdateCompany}
          onUpdatePreferences={handleUpdatePreferences}
          onChangePassword={handleChangePassword}
        />
      </Container>
    </DealerNavigation>
  );
}