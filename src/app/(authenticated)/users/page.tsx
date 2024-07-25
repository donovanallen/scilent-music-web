'use client';

import { ScrollShadow } from '@nextui-org/react';
import { Account, Follow, Profile, User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import Box from '@/components/Box';
import Header from '@/components/Header';
import GridLayout from '@/components/layouts/GridLayout';
import UserCard from '@/components/UserCard';
// import PageContent from '@/components/PageContent';

const Users = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [followedUsers, setFollowedUsers] =
    useState<(Profile & { user: User & { accounts: Account[] } })[]>();
  const [suggestedUsers, setSuggestedUsers] =
    useState<(Profile & { user: User & { accounts: Account[] } })[]>();

  useEffect(() => {
    (async () => {
      const profile = await fetch(`/api/db/user/${session?.user.id}`, {
        method: 'GET',
      }).then((res) => {
        const result = res.json();
        return result;
      });
      const followed: Follow[] = profile?.followers || []; // TODO: update this to following when fixed
      const fetchedUsers: (Profile & {
        user: User & {
          accounts: Account[];
        };
      })[] = await Promise.all(
        followed.map(async (u: Follow) => {
          const res = await fetch(`/api/db/${u.followingId}`);
          return res.json();
        }),
      );
      setFollowedUsers(fetchedUsers);
    })();
  }, [session]);

  useEffect(() => {
    (async () => {
      const allProfiles: (Profile & {
        user: User & { accounts: Account[] };
      })[] = await fetch(`api/db/users`, { method: 'GET' }).then((res) => {
        const result = res.json();
        return result;
      });

      setSuggestedUsers(allProfiles);
    })();
  }, []);

  return (
    <Box className='h-full flex flex-col'>
      <Header>
        {/* TITLE */}
        <div className='inline-flex items-center gap-x-2'>
          <h1 className='text-brand-dark dark:text-brand-light w-fit text-lg sm:text-xl md:text-2xl'>
            Users
          </h1>
        </div>

        {/* recommended profiles  */}
        <h4 className='text-dark/60 dark:text-light/60 subtitle'>
          Recommended Profiles
        </h4>
        <div className='overflow-x-auto'>
          <GridLayout>
            {suggestedUsers?.map((user) => (
              <UserCard
                id={user.id}
                key={user.id}
                name={user.user.name as string}
                image={user.user.image as string}
                onClick={() => router.push(`/profile/${user.id}`)}
                className='h-40'
              />
            ))}
          </GridLayout>
        </div>
      </Header>

      {followedUsers && followedUsers.length === 0 && (
        <div className='flex flex-col items-center justify-center h-full w-full'>
          <h3 className='text-dark/50 dark:text-light/50 text-center'>
            Not currently following any profiles
          </h3>
        </div>
      )}

      {followedUsers && followedUsers.length > 0 && (
        <ScrollShadow hideScrollBar>
          <div className='overflow-y-auto overflow-x-hidden py-4 px-6'>
            <div className='flex items-center justify-between mb-4'>
              <h4 className='text-dark dark:text-light subtitle'>Following</h4>
              <h4 className='text-dark dark:text-light self-end font-thin subtitle'>
                {followedUsers?.length} total
              </h4>
            </div>
            {/* <PageContent profiles={followedUsers} /> */}
          </div>
        </ScrollShadow>
      )}
    </Box>
  );
};

export default Users;
