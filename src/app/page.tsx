'use client';

import { useSession } from 'next-auth/react';

import { firstName } from '@/lib/utils';

import Box from '@/components/Box';
import Header from '@/components/Header';
import TopItems from '@/components/TopItems';

import Logo from '~/svg/Logo_Full_Gray.svg';

// export const revalidate = 0;
export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <Box className='flex flex-col min-h-full px-6'>
      <Header
        title={
          session
            ? `Welcome ${session?.user ? firstName(session.user.name || '') : ''}`
            : ''
        }
        className=''
      ></Header>

      {status === 'authenticated' ? (
        <TopItems initExpanded />
      ) : (
        <div className='flex flex-col items-center justify-center flex-1'>
          <Logo className='px-96' />
        </div>
      )}
    </Box>
  );
}
