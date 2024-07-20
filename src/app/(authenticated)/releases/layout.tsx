'use client';

import { Tab, Tabs } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import React, { Key, useState } from 'react';
import { IconType } from 'react-icons';
import { IoGrid, IoList, IoNewspaper } from 'react-icons/io5';
import { TbCalendarEvent, TbMusicStar } from 'react-icons/tb';

import Box from '@/components/Box';
import Header from '@/components/Header';
import InfoIcon from '@/components/InfoIcon';

type ReleaseView = 'featured' | 'user' | 'upcoming';
const ReleaseViewOptions: {
  value: ReleaseView;
  label: string;
  icon: IconType;
}[] = [
  { value: 'featured', label: 'Featured', icon: IoNewspaper },
  { value: 'user', label: 'Out Now', icon: TbMusicStar },
  { value: 'upcoming', label: 'Upcoming', icon: TbCalendarEvent },
];

export default function Releases({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const page = pathname.split('/').at(-1) as ReleaseView;
  console.log('pathname', page);

  const [selectedReleaseView, setSelectedReleaseView] = useState<ReleaseView>(
    page || 'featured',
  );

  return (
    <Box className='h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <Header>
        <div className='inline-flex items-center gap-x-2'>
          <h1 className='text-brand-dark dark:text-brand-light line-clamp-1 text-2xl sm:text-3xl md:h1'>
            Releases
          </h1>
          <InfoIcon
            tooltipEnabled
            tooltip={{
              content:
                'Your Release Hub is home to all the recent and upcoming releases from your favorite artists.',
            }}
          />
        </div>
      </Header>

      <div className='flex items-center justify-between px-6 py-4 '>
        <div className='inline-flex items-center gap-x-2'>
          <h3 className='w-fit text-lg sm:text-xl md:text-2xl'>{page}</h3>
        </div>
        <div className='flex items-center gap-x-2'>
          <Tabs
            variant='bordered'
            radius='md'
            size='sm'
            aria-label='Release Tabs'
            classNames={{ base: '', tab: 'subtitle text-xs' }}
            selectedKey={page}
            defaultSelectedKey={selectedReleaseView}
            onSelectionChange={setSelectedReleaseView as (key: Key) => void}
          >
            {ReleaseViewOptions.map((o) => (
              <Tab
                key={o.value}
                title={o.label}
                href={`/releases/${o.value}`}
              ></Tab>
            ))}
          </Tabs>

          <Tabs
            aria-label='View options'
            color='default'
            variant='bordered'
            size='sm'
            radius='md'
            defaultSelectedKey='grid'
            isDisabled
            classNames={{ base: '', tab: 'subtitle text-xs' }}
          >
            <Tab
              key='grid'
              title={
                <div className='flex items-center space-x-2'>
                  <IoGrid />
                </div>
              }
            />
            <Tab
              key='list'
              title={
                <div className='flex items-center space-x-2'>
                  <IoList />
                </div>
              }
            />
          </Tabs>
        </div>
      </div>

      <div className='flex flex-col w-full p-6'>{children}</div>
    </Box>
  );
}
