'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { BiEdit } from 'react-icons/bi';

import Box from '@/components/Box';
import Button from '@/components/buttons/Button';
import Header from '@/components/Header';

const Reviews: React.FC = () => {
  const router = useRouter();
  return (
    <Box className='h-full flex flex-col'>
      <Header title='Reviews'></Header>

      <div className='flex flex-col flex-auto items-center justify-center gap-6'>
        <BiEdit size={96} className='text-dark/10 dark:text-light/10' />
        <Button variant='primary' onClick={() => router.push('/reviews/new')}>
          Create a new review
        </Button>
      </div>
    </Box>
  );
};

export default Reviews;
