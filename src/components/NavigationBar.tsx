'use client';

import { Avatar, AvatarIcon, Tooltip } from '@nextui-org/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import toast from 'react-hot-toast';
import { FaSpotify } from 'react-icons/fa6';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';

import logger from '@/lib/logger';
import { cn } from '@/lib/utils';
import useAuthModal from '@/hooks/useAuthModal';

import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const NavigationBar: React.FC = () => {
  const authModal = useAuthModal();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  // const { apiEnabled, loading, error } = useAPIStatus();

  const goBack = () => router.back();
  const goForward = () => router.forward();

  const handleSignOut = () => {
    signOut({
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
      redirect: false,
    })
      .catch((error) => {
        toast.error('Error logging out. Try again.');
        logger({ error }, 'ERROR: Error logging out');
      })
      .then(() => {
        toast.success('See ya soon!');
        router.push('/login');
      });
  };

  return (
    <div className='w-full h-fit flex items-center justify-between mb-4'>
      {status === 'authenticated' ? (
        <>
          {/* NAVIGATION ARROWS */}
          <div className={cn('flex gap-x-2 items-center')}>
            <IconButton
              variant='outline'
              icon={RxCaretLeft}
              onClick={goBack}
              className='text-xl'
            />
            <IconButton
              variant='outline'
              icon={RxCaretRight}
              onClick={goForward}
              className='text-xl'
            />
          </div>
          {/* LOG IN/LOG OUT/SIGN UP */}
          <div className='flex gap-x-4 items-center justify-end flex-1'>
            {/* <Tooltip
              shadow='md'
              size='sm'
              content={`API Status: ${apiEnabled ? 'Active' : loading ? 'Connecting' : error ? 'Error' : 'Unavailable'}`}
              classNames={{
                content: 'text-dark bg-light dark:text-light dark:bg-dark',
                base: 'max-w-xs',
              }}
              delay={1000}
              placement='left'
            >
              <div>
                <StatusIndicator
                  loading={loading}
                  color={
                    apiEnabled
                      ? 'success'
                      : loading
                        ? 'warning'
                        : error
                          ? 'danger'
                          : 'default'
                  }
                  classNames={{
                    dot: apiEnabled
                      ? 'animate-pulse ring-1 ring-dark/50 dark:ring-light/50'
                      : '',
                  }}
                />
              </div>
            </Tooltip> */}
            {pathname !== '/profile' && session?.user?.id && (
              <Tooltip
                content='View your profile'
                delay={1000}
                classNames={{
                  content: 'text-dark bg-light dark:text-light dark:bg-dark',
                  base: 'max-w-xs',
                }}
              >
                <Link
                  href='/profile/me'
                  className='rounded-full border-2 p-0.5 border-dark/80 dark:border-light/80 hover:border-brand-dark dark:hover:border-brand-primary transition'
                >
                  <Avatar
                    src={session.user.image || undefined}
                    size='md'
                    name={session.user.name || undefined}
                    fallback={<AvatarIcon />}
                    isFocusable
                    showFallback
                  />
                </Link>
              </Tooltip>
            )}
            <Button
              onClick={handleSignOut}
              className='text-xs'
              variant='outline'
            >
              Log out
            </Button>
            {/* //   : (
            //   <IconLink href='/settings' icon={TbSettings2} />
            // )} */}
            <ThemeSwitcher />
          </div>
        </>
      ) : (
        <div className='flex items-center flex-1 justify-end gap-x-4'>
          <Button
            onClick={authModal.onOpen}
            className='flex items-center gap-x-2 text-sm xl:text-base'
            rightIcon={FaSpotify}
            variant='primary'
          >
            Log In
          </Button>
        </div>
      )}
    </div>
  );
};

export default NavigationBar;
