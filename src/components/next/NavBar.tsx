'use client';

import {
  Avatar,
  AvatarIcon,
  Link,
  Navbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaSpotify } from 'react-icons/fa6';
import { TbLogout } from 'react-icons/tb';

import logger from '@/lib/logger';
import { cn } from '@/lib/utils';
import useAuthModal from '@/hooks/useAuthModal';

import Button from '@/components/buttons/Button';
import NextPill from '@/components/Pill';

import { routes } from '@/constant/routes';

export const NavigationBar: React.FC = () => {
  const { data: session, status } = useSession();
  const authModal = useAuthModal();
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      })
      .finally(() => {
        setIsMenuOpen(false);
      });
  };

  return (
    <Navbar
      classNames={{
        menu: cn(
          'flex flex-col w-full h-full md:w-[300px] gap-y-2 px-10 py-12 mt-6 transition',
          'bg-white dark:bg-black',
        ),
        menuItem: cn(
          'flex flex-row h-auto items-center w-full gap-x-4 py-1 cursor-pointer transition',
          'text-dark dark:text-light',
          'hover:text-brand-dark dark:hover:text-brand-primary/80',
        ),
      }}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className='md:hidden' justify='start'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      <NavbarContent className='hidden md:flex' justify='end'>
        {status === 'authenticated' ? (
          <div className='flex gap-x-4 items-center justify-end flex-1'>
            <Button
              onClick={handleSignOut}
              className='text-xs'
              variant='outline'
            >
              Log out
            </Button>
          </div>
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
        {pathname !== '/profile' && session?.user?.id && (
          <Link
            href='/profile/me'
            className='rounded-full border-2 p-0.5 border-dark/80 dark:border-light/80 hover:border-brand-dark dark:hover:border-brand-primary transition'
          >
            <Avatar
              src={session.user.image || undefined}
              size='sm'
              name={session.user.name || undefined}
              fallback={<AvatarIcon />}
              isFocusable
              showFallback
            />
          </Link>
        )}
      </NavbarContent>

      <NavbarMenu>
        {routes.map((item) => (
          <NavbarMenuItem key={item.label} className=''>
            <item.icon size={36} />
            <div className='flex items-center gap-x-2'>
              <h1 className={cn('truncate')}>{item.label}</h1>
              {item.pill && (
                <NextPill
                  text={item.pill}
                  radius='sm'
                  variant='bordered'
                  size='sm'
                  classNames={{
                    base: 'border-2 border-brand-dark',
                    content: 'font-medium text-dark dark:text-brand-primary',
                  }}
                />
              )}
            </div>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem
          className='mt-auto text-dark/50 dark:text-light/50'
          onClick={handleSignOut}
          key='logout'
        >
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center gap-x-2'>
              <TbLogout size={36} />
              <h1>Log out</h1>
            </div>
            {pathname !== '/profile' && session?.user?.id && (
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
            )}
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};
