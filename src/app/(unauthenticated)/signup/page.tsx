'use client';

import { Input } from '@nextui-org/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import React from 'react';
import { FaChevronDown } from 'react-icons/fa6';

import Box from '@/components/Box';
import Button from '@/components/buttons/Button';

import { cn } from '../../../lib/utils';

import Logo from '~/images/Logo_3d.png';
import Wordmark from '~/svg/Logo_Wordmark_White.svg';

export default function ArtsyLandingPage() {
  const [email, setEmail] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email submission logic here
    console.log('Email submitted:', email);
    setEmail('');
  };

  function getFeatureDescription(feature: string): string {
    switch (feature) {
      case 'Connect':
        return 'Find and connect with musicians, producers, and music lovers worldwide.';
      case 'Create':
        return 'Collaborate on tracks, share your music, and get feedback from the community.';
      case 'Collaborate':
        return 'Join virtual jam sessions, find bandmates, and grow your musical network.';
      default:
        return '';
    }
  }

  return (
    <Box className='flex flex-col w-full items-center overflow-y-auto overflow-x-hidden no-scrollbar scrollbar-hide'>
      <div className='flex flex-col items-center justify-around h-screen p-12 relative'>
        <div className='flex flex-col w-full h-fit space-y-12 items-center'>
          <Image src={Logo} alt='Logo' width={500} height={500} />
          <Wordmark className='max-w-10/12 shadow-lg' />
          <h3 className='text-brand-light'>Where Music Meets Innovation</h3>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl'>
          {['Connect', 'Create', 'Collaborate'].map((title, index) => (
            <Box
              key={index}
              className='bg-brand-dark bg-opacity-20 backdrop-filter backdrop-blur-sm p-4 rounded-lg transition-transform hover:-translate-y-1 hover:bg-opacity-30'
            >
              <h4 className='text-lg font-semibold mb-2'>{title}</h4>
              <p>{getFeatureDescription(title)}</p>{' '}
            </Box>
          ))}
        </div>
        <div className='absolute bottom-0 left-1/2 -translate-x-1/2'>
          <FaChevronDown className='text-brand-light w-8 h-8 animate-pulse' />
        </div>
      </div>

      <div className='bg-light/20 backdrop-filter backdrop-blur-md p-12 rounded-lg my-12 w-full max-w-lg shadow-lg flex flex-col items-center gap-y-4'>
        <h3 className='text-brand-primary'>Join the Musical Revolution</h3>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-y-2 items-center w-full'
        >
          <Input
            type='email'
            className='w-full'
            radius='sm'
            placeholder='Enter your email address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label='Email input'
          />
          <Button
            type='submit'
            variant='outline'
            disabled={!email}
            className={cn(
              'w-full animated-underline text-center items-center justify-center',
            )}
          >
            sign up
          </Button>
        </form>
      </div>
    </Box>
  );
}
