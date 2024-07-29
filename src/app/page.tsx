import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { firstName } from '@/lib/utils';

import Box from '@/components/Box';
import Header from '@/components/Header';

import authOptions from '@/app/api/auth/[...nextauth]/authOptions';

import Logo from '~/svg/Logo_Full_Gray.svg';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  return (
    <Box className='flex flex-col h-full overflow-y-auto overflow-x-hidden'>
      <Header
        title={`Welcome ${session?.user ? ', ' + firstName(session.user.name || '') : ''}`}
      ></Header>
      <Box className='flex flex-col items-center justify-center h-full w-full'>
        <Logo className='w-1/2' />
      </Box>
    </Box>
  );
}
