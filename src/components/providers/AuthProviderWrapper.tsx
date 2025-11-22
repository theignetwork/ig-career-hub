'use client';

import { Suspense } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

function AuthProviderContent({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProviderContent>{children}</AuthProviderContent>
    </Suspense>
  );
}
