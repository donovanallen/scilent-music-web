import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { firstName } from '@/lib/utils';

import Box from '@/components/Box';
import Header from '@/components/Header';
import ScilentLogo from '@/components/ScilentLogo';

import authOptions from '@/app/api/auth/[...nextauth]/authOptions';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  return (
    <Box className='flex flex-col h-full overflow-y-auto overflow-x-hidden'>
      <Header
        title={`Welcome ${session?.user ? session.user.profile?.username || firstName(session.user.name as string) : ''}`}
      ></Header>
      <Box className='flex flex-col items-center justify-center h-full w-full'>
        <ScilentLogo />
      </Box>
    </Box>
  );
}
