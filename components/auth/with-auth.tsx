"use client";

import { useAuthContext } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ComponentType } from 'react';

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function WithAuth(props: P) {
    const { user, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Carregando...</div>; // Ou um componente de spinner
    }

    if (!user) {
      return null; // Ou um fallback, enquanto redireciona
    }

    return <Component {...props} />;
  };
}
