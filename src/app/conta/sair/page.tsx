'use client';
import { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await logout();
      router.replace('/login');
    })();
  }, [logout, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Saindo...</p>
    </div>
  );
}