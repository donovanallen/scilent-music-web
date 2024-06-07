'use client';

// import { Avatar, Tooltip } from '@nextui-org/react';
import { Tooltip } from '@nextui-org/react';
import { PlayHistory, Track, TrackItem } from '@spotify/web-api-ts-sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMediaQuery } from '@uidotdev/usehooks';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { FaPlay } from 'react-icons/fa6';
import { HiHome } from 'react-icons/hi';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { TbMusicStar, TbUserHeart } from 'react-icons/tb';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import { cn } from '@/lib/utils';
import useAuthModal from '@/hooks/useAuthModal';

import Box from '@/components/Box';
import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import CurrentlyPlaying from '@/components/CurrentlyPlaying';
import Feed from '@/components/Feed';
import NextPill from '@/components/Pill';
import SidebarItem from '@/components/SidebarItem';

import { useStore } from '@/providers/zustand';

import Logo from '~/svg/Logo_Wordmark_Gray.svg';

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 769px)');

  const { currentTrack, setCurrentTrack } = useStore();

  const pathname = usePathname();
  const { data: session } = useSession();
  const authModal = useAuthModal();
  const queryClient = new QueryClient();
  const [history, setHistory] = useState<PlayHistory[] | null>();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>();

  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: 'Home',
        active: pathname === '/',
        href: '/',
      },
      {
        icon: BiSearch,
        label: 'Search',
        active: pathname === '/search',
        href: '/search',
      },
      {
        icon: TbUserHeart,
        label: 'Artists',
        active: pathname === '/artists',
        href: '/artists',
      },
      {
        icon: TbMusicStar,
        label: 'Releases',
        active: pathname === '/releases',
        href: '/releases',
        disabled: false,
        pill: 'New',
      },
    ],
    [pathname],
  );

  useEffect(() => {
    if (session) {
      (async () => {
        const result = await sdk.player.getRecentlyPlayedTracks();
        setHistory(() => result.items.map((item) => item));
      })();
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      (async () => {
        const result = await sdk.player.getUsersQueue();
        setCurrentTrack(result.currently_playing as TrackItem);
      })();
    }
  }, [session, setCurrentTrack]);

  return (
    <div className='flex h-[100vh]'>
      <div
        className={cn(
          'flex flex-col w-fit md:w-[300px] xl:w-[350px] gap-y-2 bg-black h-full p-2 transition',
          isSmallDevice ? (!sidebarOpen ? 'hidden' : '') : '',
        )}
      >
        {session ? (
          <>
            <Box>
              <div className='flex flex-col items-center gap-y-4 px-5 py-4'>
                {routes.map((item) => (
                  <SidebarItem
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
                            base: 'border-brand-dark',
                            content: 'font-medium text-brand-primary',
                          }}
                          disabled={item.disabled}
                        />
                      )
                    }
                  />
                ))}
                <div className='flex md:hidden'>
                  <Tooltip
                    classNames={{
                      base: 'ring-2 ring-brand-light/10 rounded-md z-20',
                      content: 'bg-dark/90 p-4 max-w-sm',
                    }}
                    shadow='lg'
                    placement='right'
                    content={
                      <Box>
                        <CurrentlyPlaying />
                      </Box>
                    }
                  >
                    <IconButton
                      variant='ghost'
                      icon={FaPlay}
                      classNames={{ icon: 'text-xl hover:text-brand-primary' }}
                    />
                  </Tooltip>
                </div>
              </div>
            </Box>
            <Feed
              title='Live Mix'
              cpTrack={currentTrack as Track}
              history={history as PlayHistory[]}
              className='hidden md:flex h-full overflow-y-scroll no-scrollbar'
            />
            <Box className='md:hidden flex flex-col h-[100%] w-full'>
              <Logo className='transform -rotate-90 align-middle origin-center my-auto' />
            </Box>
            <Box className='md:hidden flex flex-col h-fit w-full'>
              <IconButton
                variant='primary'
                icon={RxCaretLeft}
                classNames={{ icon: 'text-3xl' }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
              />
            </Box>
          </>
        ) : (
          <Box className='h-full flex items-center justify-center '>
            <Button
              onClick={authModal.onOpen}
              className='flex text-center justify-center'
            >
              Get Started
            </Button>
          </Box>
        )}
      </div>
      {isSmallDevice && (
        <div
          className={cn(
            'h-full w-0 relative transition z-20',
            !sidebarOpen
              ? 'absolute left-0 z-10 hover:border-r-4 hover:border-brand-primary/70'
              : 'hidden',
          )}
        >
          <IconButton
            variant='primary'
            icon={RxCaretRight}
            className='absolute bottom-12 left-[8px] z-10 transition'
            classNames={{ icon: 'text-3xl transition' }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
      )}
      <main
        className={cn(
          'h-full flex-1 overflow-y-auto py-2',
          !sidebarOpen ? 'relative' : '',
        )}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </main>
    </div>
  );
};

export default Sidebar;
