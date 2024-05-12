'use client';

import { useSession } from 'next-auth/react';

import logger from '@/lib/logger';
import { firstName } from '@/lib/utils';

import Box from '@/components/Box';
import Header from '@/components/Header';
import TopItems from '@/components/TopItems';

import Logo from '~/svg/Logo_Full_Gray.svg';

export default function HomePage() {
  const { data: session, status } = useSession();
  logger({ data: session, status }, 'page.tsx line 16');

  return (
    <Box className='flex flex-col h-full bg-dark overflow-y-auto overflow-x-hidden'>
      <Header
        title={
          session
            ? `Welcome ${session?.user ? firstName(session.user.name || '') : ''}`
            : ''
        }
      ></Header>

      <div className='overflow-y-auto overflow-x-hidden no-scrollbar px-6 h-full'>
        {status === 'authenticated' ? (
          <TopItems initExpanded />
        ) : (
          <div className='flex justify-center items-center w-full h-full'>
            <Logo className='w-1/2' />
          </div>
        )}
      </div>
    </Box>
  );
}
