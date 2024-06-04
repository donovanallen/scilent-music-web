'use client';

// import { Avatar, Tooltip } from '@nextui-org/react';
import { PlayHistory, Track, TrackItem } from '@spotify/web-api-ts-sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { HiHome } from 'react-icons/hi';
import { TbUserHeart } from 'react-icons/tb';

import sdk from '@/lib/spotify-sdk/ClientInstance';
import useAuthModal from '@/hooks/useAuthModal';

import Box from '@/components/Box';
import Button from '@/components/buttons/Button';
import Feed from '@/components/Feed';
import SidebarItem from '@/components/SidebarItem';

import { useStore } from '@/providers/zustand';

import Logo from '~/svg/Logo_Wordmark_Gray.svg';

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const { currentTrack, setCurrentTrack } = useStore();

  const pathname = usePathname();
  const { data: session } = useSession();
  const authModal = useAuthModal();
  const queryClient = new QueryClient();
  const [history, setHistory] = useState<PlayHistory[] | null>();

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
      // {
      //   icon: TbMusicStar,
      //   label: 'Releases',
      //   active: pathname === '/releases',
      //   href: '/releases',
      //   disabled: true,
      // },
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
      <div className='flex flex-col w-fit md:w-[300px] xl:w-[350px] gap-y-2 bg-black h-full p-2'>
        {session ? (
          <>
            <Box>
              <div className='flex flex-col items-center gap-y-4 px-5 py-4'>
                {routes.map((item) => (
                  <SidebarItem key={item.label} {...item} />
                ))}
              </div>
            </Box>
            {/* <Box className='md:hidden'>
              <Tooltip content='Currently Playing'>
                <Avatar
                  imgProps={{
                    src:
                      liveTrack && 'album' in liveTrack
                        ? liveTrack.album.images[0].url
                        : undefined,
                  }}
                />
              </Tooltip>
            </Box> */}
            <Feed
              title='Live Mix'
              cpTrack={currentTrack as Track}
              history={history as PlayHistory[]}
              className='hidden md:flex h-full overflow-y-scroll no-scrollbar'
            />
            <Box className='md:hidden flex flex-col h-[100%] w-full'>
              <Logo className='transform -rotate-90 align-middle origin-center my-auto' />
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
      <main className='h-full flex-1 overflow-y-auto py-2'>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </main>
    </div>
  );
};

export default Sidebar;
