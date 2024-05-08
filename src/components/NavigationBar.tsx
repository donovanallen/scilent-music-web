'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import toast from 'react-hot-toast';
import { BiSearch } from 'react-icons/bi';
import { FaUserAlt } from 'react-icons/fa';
import { FaSpotify } from 'react-icons/fa6';
import { HiHome } from 'react-icons/hi';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { TbSettings2 } from 'react-icons/tb';

import { cn } from '@/lib/utils';
import useAuthModal from '@/hooks/useAuthModal';

import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import IconLink from '@/components/links/IconLink';
import NextImage from '@/components/NextImage';

const NavigationBar: React.FC = () => {
  const authModal = useAuthModal();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const goBack = () => router.back();
  const goForward = () => router.forward();

  const handleLogout = () => {
    // TODO: Error handling
    signOut();
    authModal.onClose();
    toast.success('Logged out');
    router.replace('/');
  };

  return (
    <div className='w-full flex items-center justify-between mb-4'>
      {/* NAVIGATION ARROWS */}
      <div
        className={cn(
          'hidden md:flex gap-x-2 items-center',
          pathname === '/' ? 'md:hidden' : '',
        )}
      >
        <IconButton
          variant='ghost'
          icon={RxCaretLeft}
          onClick={goBack}
          className='text-xl'
        />
        <IconButton
          variant='ghost'
          icon={RxCaretRight}
          onClick={goForward}
          className='text-xl'
        />
      </div>

      {/* HOME/SEARCH */}
      <div className='flex md:hidden gap-x-2 items-center'>
        <IconLink href='/' icon={HiHome} />
        <IconLink href='/search' icon={BiSearch} />
      </div>

      {/* LOG IN/LOG OUT/SIGN UP */}
      {status === 'authenticated' ? (
        <div className='flex gap-x-4 items-center justify-end flex-1'>
          <Button onClick={handleLogout} className='text-xs'>
            Log out
          </Button>

          {pathname !== '/profile' ? (
            <div className='relative aspect-square w-10 rounded-full overflow-hidden bg-neutral-700  border border-light hover:border-brand-primary hover:border-2 transition'>
              <Link href='/profile'>
                {session.user?.image ? (
                  <NextImage
                    src={session.user?.image}
                    alt='User Image'
                    layout='fill'
                    className='aspect-square object-cover'
                  />
                ) : (
                  <FaUserAlt size={24} className='text-light' />
                )}
              </Link>
            </div>
          ) : (
            <IconLink href='/settings' icon={TbSettings2} />
          )}
        </div>
      ) : (
        <div className='flex items-center flex-1 justify-end gap-x-4'>
          <Button
            onClick={authModal.onOpen}
            className='flex items-center gap-x-2'
            rightIcon={FaSpotify}
            variant='light'
          >
            Log In
          </Button>
        </div>
      )}
    </div>
  );
};

export default NavigationBar;
