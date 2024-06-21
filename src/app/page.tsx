import { ScrollShadow } from '@nextui-org/react';
import { redirect } from 'next/navigation';

import { getAuthSession } from '@/lib/helper';
import { firstName } from '@/lib/utils';

import Box from '@/components/Box';
import Header from '@/components/Header';
import TopItems from '@/components/TopItems';

export default async function HomePage() {
  // const { data: session, status } = useSession();
  // logger({ data: session, status }, 'page.tsx line 16');
  // TODO Add to other pages (ensure page is async server component)
  const session = await getAuthSession();
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
