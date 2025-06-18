'use client';

import { AuthForm } from '@/components/auth/auth-form';
import { Dashboard } from '@/components/dashboard/dashboard';
import { useAuthContext } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthForm />;
}
