'use client';

import { ScrollShadow } from '@nextui-org/react';
import React from 'react';

import Box from '@/components/Box';
import Header from '@/components/Header';

const APP_SETTINGS = [
  {
    label: 'About',
    value: 'click',
  },
  {
    label: 'Profile',
    value: 'click',
  },
  {
    label: 'Get Scilent Music Pro',
    value: 'click',
  },
  {
    label: 'Support',
    value: 'click',
  },
  {
    label: 'Contact',
    value: 'click',
  },
  {
    label: 'Logout',
    value: 'click',
  },
];

const Settings: React.FC = () => {
  return (
    <Box className='h-full flex flex-col'>
      <Header title='Settings'></Header>
      <ScrollShadow hideScrollBar>
        <div className='flex flex-col px-6 my-6 gap-y-6'>
          {APP_SETTINGS.map((s, i) => (
            <div key={i} className='flex items-start justify-between'>
              <h3 className='font-medium'>{s.label}</h3>
              <h4 className=''>{s.value}</h4>
            </div>
          ))}
        </div>
      </ScrollShadow>
    </Box>
  );
};

export default Settings;
