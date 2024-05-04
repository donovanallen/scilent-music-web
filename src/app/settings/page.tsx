'use client';

import React from 'react';

import Box from '@/components/Box';
import Header from '@/components/Header';

interface SettingsProps {
  onClick?: (id: string) => void;
}

const Settings: React.FC<SettingsProps> = () => {
  return (
    <Box className='h-full flex flex-col'>
      <Header title='Settings' className=''></Header>
    </Box>
  );
};

export default Settings;
