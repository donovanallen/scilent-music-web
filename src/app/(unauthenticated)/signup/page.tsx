'use client';

import { Input } from '@nextui-org/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import React from 'react';
import { PiAtom, PiMicrophone } from 'react-icons/pi';
import { TbMusicHeart } from 'react-icons/tb';

import { cn } from '@/lib/utils';

import Box from '@/components/Box';
import Button from '@/components/buttons/Button';
import FeatureCard from '@/components/FeatureCard';

import Logo from '~/images/Logo_3d.png';
import Wordmark from '~/svg/Logo_Wordmark_Gray.svg';

const features = [
  {
    title: 'Your Musical Universe',
    description:
      'Seamlessly aggregate your entire music history across all platforms, unlocking personalized insights and comprehensive artist discographies, including every new release.',
    icon: PiAtom,
  },
  {
    title: 'Share Your Rhythm',
    description:
      'Connect with friends and tastemakers through customizable music sharing, fostering a vibrant community of music lovers.',
    icon: TbMusicHeart,
  },
  {
    title: 'Reviews that Resonate',
    description:
      'Express your musical opinions with a tiered review system that adapts to your listening profile, featuring real-time reactions and in-depth critiques.',
    icon: PiMicrophone,
  },
];

export default function ArtsyLandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const [email, setEmail] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email submission logic here
    console.log('Email submitted:', email);
    setEmail('');
  };

  const colors = ['#f9d3b4', '#d6d6d6', '#121212', '#756456']; // Gray, Red, Green
  const [colorIndex, setColorIndex] = useState(0);
  const cycleColor = () => {
    setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
  };

  return (
    <Box className='flex flex-col items-center w-full bg-dark overflow-y-auto overflow-x-hidden relative'>
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center h-screen',
          'transition-opacity duration-2500 ease-in',
          isVisible ? 'opacity-100' : 'opacity-0',
        )}
      >
        <Image
          src={Logo}
          alt='Background Logo'
          layout='fill'
          objectFit='cover'
          quality={100}
        />
      </div>

      <div className='absolute inset-0 bg-gradient-to-b from-transparent to-dark opacity-95 h-full backdrop-invert backdrop-blur-lg' />

      {/* LANDING HERO */}
      <div className='relative z-10 h-screen w-full flex flex-col items-center'>
        {/* Wordmark SVG */}
        <div
          className={cn(
            'flex flex-col flex-1 items-center justify-center w-full',
            'transition-opacity duration-2500 ease-in',
            isVisible ? 'opacity-100' : 'opacity-0',
          )}
        >
          <Wordmark
            className='w-10/12 drop-shadow-2xl cursor-pointer'
            onClick={cycleColor}
            style={{ fill: colors[colorIndex] }}
          />
          <h3 className='text-brand-primary font-semibold drop-shadow-xl mt-4'>
            Be heard.
          </h3>
        </div>
      </div>

      {/* FEATURES */}
      <div className='relative z-10 h-screen w-full flex flex-col items-center justify-center gap-y-24 bg-gradient-to-b from-transparent to-dark '>
        <h1 className='text-brand-light drop-shadow-xl'>
          An elevated music experience
        </h1>
        {/* <div className='flex flex-1 items-center'> */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-24'>
          {features.map(({ title, description, icon }, index) => (
            <FeatureCard
              key={index}
              icon={icon}
              title={title}
              description={description}
            />
            // <Box
            //   key={index}
            //   className='flex flex-col h-full bg-dark/50 p-6 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:bg-opacity-30 hover:shadow-lg'
            // >
            //   <div className='flex text-brand-light text-4xl mb-6'>{icon}</div>
            //   <h3 className='mb-2 text-brand-primary'>{title}</h3>
            //   <p className='text-light'>{description}</p>
            // </Box>
          ))}
        </div>
        {/* </div> */}
      </div>
      <div className='relative z-10 h-screen w-full flex flex-col items-center justify-center bg-dark'>
        <div className='rounded-lg max-w-xl shadow-lg flex flex-col items-center gap-y-12'>
          <div>
            <h4 className='text-light/60 w-full text-center'>
              Beta coming 2024
            </h4>
            <h1 className='text-light w-full text-center'>
              Join the Revolution
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className='flex flex-col gap-y-4 items-center w-full'
          >
            <Input
              type='email'
              className='w-full text-light'
              radius='sm'
              size='lg'
              placeholder='Email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label='Email input'
            />
            <Button
              type='submit'
              variant='outline'
              disabled={!email}
              className={cn(
                'w-full animated-underline text-center items-center justify-center transition-all duration-300',
              )}
            >
              sign up
            </Button>
          </form>
        </div>
      </div>
    </Box>
  );
}
