'use client';

import { ScrollShadow } from '@nextui-org/react';
import { Account, Follow, Profile, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import Box from '@/components/Box';
import Header from '@/components/Header';
import InfoIcon from '@/components/InfoIcon';

const Users = () => {
  const { data: session } = useSession();
  const [followedUsers, setFollowedUsers] =
    useState<(Profile & { user: User } & { accounts: Account[] })[]>();

  useEffect(() => {
    (async () => {
      const profile = await fetch(`/api/db/user/${session?.user.id}`, {
        method: 'GET',
      }).then((res) => {
        const result = res.json();
        return result;
      });
      const followed: Follow[] = profile.followers; // TODO: update this to following when fixed
      const fetchedUsers: (Profile & { user: User } & {
        accounts: Account[];
      })[] = await Promise.all(
        followed.map(async (u: Follow) => {
          const res = await fetch(`/api/db/${u.followingId}`);
          return res.json();
        }),
      );
      setFollowedUsers(fetchedUsers);
    })();
  }, [session]);

  // useEffect(() => {
  //   (async () => {
  //     if (followedUsers && followedUsers?.length > 0) {
  //       const fetchedUsers: User[] = await Promise.all(followedUsers.map(async (u: Follow) => {
  //         const res = await fetch(`/api/db/${u.followingId}`);
  //         return res.json();
  //       }));
  //       // setUsers(fetchedUsers);
  //       console.log('User profiles', fetchedUsers);
  //     }
  //   })();
  // }, [followedUsers]);

  // const getFollowedArtists = async ({
  //   pageParam = '',
  // }: {
  //   pageParam: string;
  // }) => {
  //   const result = await sdk.currentUser.followedArtists(pageParam, 20);
  //   return {
  //     items: result.artists.items,
  //     nextPage: result.artists.next ? !!pageParam : undefined,
  //   };
  // };

  // const {
  //   data: artists,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  // } = useInfiniteQuery({
  //   queryKey: ['followedArtists'],
  //   queryFn: getFollowedArtists,
  //   initialPageParam: '',
  //   getNextPageParam: (lastPage) =>
  //     lastPage.items[lastPage.items.length - 1].id,
  // });

  // useEffect(() => {
  //   if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
  //     fetchNextPage();
  //   }
  // }, [entry, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Box className='h-full flex flex-col'>
      <Header>
        {/* TITLE */}
        <div className='inline-flex items-center gap-x-2'>
          <h1 className='text-brand-dark dark:text-brand-light w-fit text-lg sm:text-xl md:text-2xl'>
            Followed Users
          </h1>

          <InfoIcon
            tooltipEnabled
            tooltip={{
              content:
                'The profiles you follow on Scilent Music. See recommended profiles or use the search function to find more.',
            }}
          />
        </div>
        <h4 className='text-dark dark:text-light self-end font-thin subtitle'>
          {followedUsers?.length} total
        </h4>
        {/* recommended profiles  */}
      </Header>

      <ScrollShadow hideScrollBar>
        <div className='overflow-y-auto overflow-x-hidden py-4 px-6'>
          {followedUsers?.map((user) => (
            <h4 key={user.id}>{user.user.name}</h4>
          ))}
          {/* <PageContent
            artists={
              followedArtists.sort((a, b) =>
                a.name.localeCompare(b.name),
              ) as Artist[]
            }
            loading={isLoading}
          /> */}
        </div>
      </ScrollShadow>
    </Box>
  );
};

export default Users;
