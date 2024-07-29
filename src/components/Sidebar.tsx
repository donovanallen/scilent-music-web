'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Tooltip } from '@nextui-org/react';
import { PlayHistory, TrackItem } from '@spotify/web-api-ts-sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMediaQuery } from '@uidotdev/usehooks';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { FaPlay } from 'react-icons/fa6';
import { HiHome } from 'react-icons/hi';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { TbMusicStar, TbUserHeart, TbUsers } from 'react-icons/tb';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import { cn } from '@/lib/utils';

import Box from '@/components/Box';
import IconButton from '@/components/buttons/IconButton';
import CurrentlyPlaying from '@/components/CurrentlyPlaying';
import Feed from '@/components/Feed';
import NextPill from '@/components/Pill';
import SidebarItem from '@/components/SidebarItem';

import TrackPlayerProvider from '@/providers/TrackPlayerProvider';
import { useStore } from '@/providers/zustand';

import Logo from '~/svg/Logo_Wordmark_Gray.svg';

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const { data: session } = useSession();
  const isSmallDevice = useMediaQuery('only screen and (max-width : 769px)');
  const pathname = usePathname();
  const queryClient = new QueryClient();
  const [parent] = useAutoAnimate();

  const { currentTrack, setCurrentTrack } = useStore();
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
      },
      {
        icon: TbUsers,
        label: 'Users',
        active: pathname === '/users',
        href: '/users',
        pill: 'New',
      },
    ],
    [pathname],
  );

  // RECENTLY PLAYED
  useEffect(() => {
    if (session?.user?.id) {
      (async () => {
        // FETCH FROM SPOTIFY
        const result = await sdk.player.getRecentlyPlayedTracks();
        const playHistory: PlayHistory[] = result.items.map((item) => item);

        // UPDATE IN DB
        const dbResponse = await fetch(`/api/db/${session?.user.id}/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tracks: playHistory }),
        });

        if (dbResponse.ok) {
          const data = await dbResponse.json();
          setHistory(data.recentlyPlayed.tracks as PlayHistory[]);
        } else {
          setHistory(playHistory);
        }
      })();
    }
  }, [session]);

  // CURRENTLY PLAYING
  useEffect(() => {
    if (session?.user?.id) {
      (async () => {
        const result = await sdk.player.getUsersQueue();
        const track: TrackItem | null = result.currently_playing;

        if (!track) return;

        // UPDATE IN DB
        await fetch(`/api/db/${session?.user.id}/cp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ track }),
        });

        setCurrentTrack(track);
      })();
    }
  }, [session, setCurrentTrack]);

  return (
    <div ref={parent} className='flex h-[100vh]'>
      <div
        className={cn(
          'flex flex-col w-fit md:w-[300px] xl:w-[350px] gap-y-2 h-full p-2 transition',
          'bg-white dark:bg-black',
          isSmallDevice ? (!sidebarOpen ? 'hidden' : '') : '',
        )}
      >
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
                          base: 'border-2 border-brand-dark',
                          content:
                            'font-medium text-dark dark:text-brand-primary',
                        }}
                      />
                    )
                  }
                />
              ))}
              <div className='flex md:hidden'>
                <Tooltip
                  classNames={{
                    base: 'ring-2 ring-brand-light/10 rounded-md z-20',
                    content: 'bg-light dark:bg-dark/90 p-4 max-w-sm',
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
                    classNames={{
                      icon: 'text-xl hover:text-brand-primary animate-pulse',
                    }}
                  />
                </Tooltip>
              </div>
              {currentTrack && (
                <div className='w-full pt-4 border-t-1 border-dark dark:border-light'>
                  <TrackPlayerProvider>
                    <CurrentlyPlaying />
                  </TrackPlayerProvider>
                </div>
              )}
            </div>
          </Box>

          <Feed
            title='Live Mix'
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
          'bg-white dark:bg-black',
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
