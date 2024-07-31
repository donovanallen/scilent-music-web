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

import logger from '@/lib/logger';
import useAuthModal from '@/hooks/useAuthModal';

import Button from '@/components/buttons/Button';

import { Route, routes } from '@/constant/routes';

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
      });
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className='md:hidden' justify='start'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      <NavbarContent justify='end'>
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
        {routes.map((item: Route, index: number) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            {/* <SidebarItem
              key={item.label}
              {...item}
              pill={
                item.pill && (
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
                )
              }
            /> */}
            <Link className='w-full' href={item.href} size='lg'>
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
