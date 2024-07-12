import { ScrollShadow } from '@nextui-org/react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { firstName } from '@/lib/utils';

import Box from '@/components/Box';
import Header from '@/components/Header';
import TopItems from '@/components/TopItems';

import authOptions from '@/app/api/auth/[...nextauth]/authOptions';

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

      <ScrollShadow hideScrollBar>
        <div className='overflow-y-auto overflow-x-hidden no-scrollbar px-6 h-full'>
          <TopItems initExpanded />
        </div>
      </ScrollShadow>
    </Box>
  );
}
