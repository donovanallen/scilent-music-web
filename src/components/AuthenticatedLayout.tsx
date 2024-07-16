'use client';

import { useSession } from 'next-auth/react';
import React from 'react';

import Sidebar from '@/components/Sidebar';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  const { data: session } = useSession();

  return session ? <Sidebar>{children}</Sidebar> : <>{children}</>;
};

export default AuthenticatedLayout;
