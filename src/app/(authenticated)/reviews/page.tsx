'use client';

import React from 'react';
import { BiEdit } from 'react-icons/bi';

import Box from '@/components/Box';
import Button from '@/components/buttons/Button';
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

const Reviews: React.FC = () => {
  return (
    <Box className='h-full flex flex-col'>
      <Header title='Reviews'></Header>

      <div className='flex flex-col flex-auto items-center justify-center gap-6'>
        <BiEdit size={96} className='text-dark/10 dark:text-light/10' />
        <Button variant='primary'>Create a new review</Button>
      </div>
    </Box>
  );
};

export default Reviews;
