import { getServerSession } from 'next-auth';
import React from 'react';

import Sidebar from '@/components/Sidebar';

import authOptions from '@/app/api/auth/[...nextauth]/authOptions';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = async ({
  children,
}) => {
  // const { data: session } = useSession();
  const session = await getServerSession(authOptions);

  return session ? <Sidebar>{children}</Sidebar> : <>{children}</>;
};

export default AuthenticatedLayout;
