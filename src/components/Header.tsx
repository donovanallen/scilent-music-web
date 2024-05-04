'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import toast from 'react-hot-toast';
import { BiSearch } from 'react-icons/bi';
import { FaUserAlt } from 'react-icons/fa';
import { FaSpotify } from 'react-icons/fa';
import { HiHome } from 'react-icons/hi';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { TbSettings2 } from 'react-icons/tb';

import { cn } from '@/lib/utils';
import useAuthModal from '@/hooks/useAuthModal';

import Button from '@/components/Button';

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
  style?: any;
  title?: string;
  // image?: string;
}

const Header: React.FC<HeaderProps> = ({
  children,
  className,
  title,
  // image,
  style,
}) => {
  const authModal = useAuthModal();
  const pathname = usePathname();
  const router = useRouter();
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
    <div
      style={style}
      className={cn(`h-fit p-6 border-b-2 border-b-brand-dark`, className)}
    >
      <div className='w-full flex items-center justify-between mb-4'>
        {/* NAVIGATION ARROWS */}
        <div
          className={cn(
            'hidden md:flex gap-x-2 items-center',
            pathname === '/' ? 'md:hidden' : '',
          )}
        >
          <RxCaretLeft
            onClick={goBack}
            className='text-light cursor-pointer hover:text-brand-dark bg-black/5'
            size={24}
          />

          <RxCaretRight
            onClick={goForward}
            className='text-light cursor-pointer hover:text-brand-dark bg-black/5'
            size={24}
          />
        </div>

        {/* HOME/SEARCH */}
        <div className='flex md:hidden gap-x-2 items-center'>
          <Button onClick={() => router.push('/')} className=''>
            <HiHome className='text-dark' size={20} />
          </Button>
          <Button onClick={() => router.push('/search')} className=''>
            <BiSearch className='text-dark' size={20} />
          </Button>
        </div>

        {/* LOG IN/LOG OUT/SIGN UP */}
        {status === 'authenticated' ? (
          <div className='flex gap-x-4 items-center justify-end flex-1'>
            {status === 'authenticated' && (
              <Button
                onClick={handleLogout}
                className='bg-transparent text-light'
              >
                Logout
              </Button>
            )}
            {pathname !== '/profile' ? (
              <Link href='/profile'>
                {session.user?.image ? (
                  <Image
                    src={session.user?.image}
                    alt='User Image'
                    height={48}
                    width={48}
                    className='rounded-full border p-0.5 border-light hover:border-brand-primary transition'
                  />
                ) : (
                  <FaUserAlt size={24} className='text-light' />
                )}
              </Link>
            ) : (
              <Link href='/settings'>
                <Button className=''>
                  <TbSettings2 className='text-dark' size={20} />
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className='flex items-center flex-1 justify-end gap-x-4'>
            <>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className='flex items-center gap-x-2'
                >
                  Log In
                  <FaSpotify />
                </Button>
              </div>
            </>
          </div>
        )}
      </div>
      {title && <h1 className='text-brand-light'>{title}</h1>}
      {children}
    </div>
  );
};

export default Header;
