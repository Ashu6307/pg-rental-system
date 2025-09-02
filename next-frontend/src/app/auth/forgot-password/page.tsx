'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get('role');

  useEffect(() => {
    // Redirect to role-specific page if no role parameter
    if (!role) {
      router.replace('/auth/forgot-password?role=user');
      return;
    }

    // Only allow 'user' and 'owner' roles, redirect admin to admin forgot password
    if (role === 'admin') {
      router.replace('/auth/admin/forgot-password');
      return;
    }

    // Only allow valid roles
    if (role !== 'user' && role !== 'owner') {
      router.replace('/auth/forgot-password?role=user');
      return;
    }
  }, [role, router]);

  // Don't render anything during redirect
  if (!role || role === 'admin' || (role !== 'user' && role !== 'owner')) {
    return null;
  }

  return <ForgotPasswordForm />;
}
