'use client';

import { ScrollShadow, User as UserComponent } from '@nextui-org/react';
import { Account, Follow, Profile, User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import Box from '@/components/Box';
import Header from '@/components/Header';
import GridLayout from '@/components/layouts/GridLayout';
import ListLayout from '@/components/layouts/ListLayout';
import UserCard from '@/components/UserCard';
import ViewToggle, { ViewType } from '@/components/ViewToggle';

const Users = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [view, setView] = useState<ViewType>('grid');

  const [followedProfiles, setFollowedProfiles] =
    useState<(Profile & { user: User & { accounts: Account[] } })[]>();
  const [suggestedUsers, setSuggestedUsers] =
    useState<(Profile & { user: User & { accounts: Account[] } })[]>();

  useEffect(() => {
    const fetchFollowedProfiles = async () => {
      if (session?.user.id) {
        const profile = await fetch(`/api/db/user/${session.user.id}`).then(
          (res) => res.json(),
        );
        const following: Follow[] = profile?.following || [];
        const fetchedUsers = await Promise.all(
          following.map(async (f: Follow) => {
            const res = await fetch(`/api/db/${f.followingId}`);
            return res.json();
          }),
        );
        setFollowedProfiles(fetchedUsers);
        return following.map((f) => f.followingId);
      }
      return [];
    };

    const fetchSuggestedUsers = async (followingIds: string[]) => {
      const allProfiles: (Profile & {
        user: User & { accounts: Account[] };
      })[] = await fetch(`api/db/users`).then((res) => res.json());

      const filtered = allProfiles.filter(
        (p) => p.user.id !== session?.user.id && !followingIds.includes(p.id),
      );

      setSuggestedUsers(filtered);
    };

    const initializeLists = async () => {
      const followingIds = await fetchFollowedProfiles();
      await fetchSuggestedUsers(followingIds);
    };

    initializeLists();
  }, [session]);

  // useEffect(() => {
  //   (async () => {
  //     const profile = await fetch(`/api/db/user/${session?.user.id}`, {
  //       method: 'GET',
  //     }).then((res) => {
  //       const result = res.json();
  //       return result;
  //     });
  //     const followed: Follow[] = profile?.followers || []; // TODO: update this to following when fixed
  //     const fetchedUsers: (Profile & {
  //       user: User & {
  //         accounts: Account[];
  //       };
  //     })[] = await Promise.all(
  //       followed.map(async (u: Follow) => {
  //         const res = await fetch(`/api/db/${u.followingId}`);
  //         return res.json();
  //       }),
  //     );
  //     setFollowedProfiles(fetchedUsers);
  //   })();
  // }, [session]);

  // useEffect(() => {
  //   (async () => {
  //     const allProfiles: (Profile & {
  //       user: User & { accounts: Account[] };
  //     })[] = await fetch(`api/db/users`, { method: 'GET' }).then((res) => {
  //       const result = res.json();
  //       return result;
  //     });

  //     setSuggestedUsers(
  //       allProfiles.filter((p) => p.user.id !== session?.user.id),
  //     );
  //   })();
  // }, []);

  return (
    <Box className='h-full flex flex-col'>
      <Header title='Users'>
        {/* recommended profiles  */}
        {/* <h4 className='text-dark/60 dark:text-light/60 subtitle'>
          Recommended Profiles
        </h4>
        <div className='w-fit overflow-x-auto'>
          <CarouselLayout maxVisible={6}>
            {suggestedUsers?.map((user) => (
              <UserCard
                id={user.id}
                key={user.id}
                name={user.user.name as string}
                image={user.user.image as string}
                onClick={() => router.push(`/profile/${user.id}`)}
                className='h-28 w-28'
              />
            ))}
          </CarouselLayout>
        </div> */}
      </Header>

      {/* {followedProfiles && followedProfiles.length === 0 && (
        <div className='flex flex-col items-center justify-center h-full w-full'>
          <h3 className='text-dark/50 dark:text-light/50 text-center'>
            Not currently following any profiles
          </h3>
        </div>
      )} */}

      {/* {followedProfiles && followedProfiles.length > 0 && (
        <ScrollShadow hideScrollBar>
          <div className='overflow-y-auto overflow-x-hidden py-4 px-6'>
            <div className='flex items-center justify-between mb-4'>
              <h4 className='text-dark dark:text-light'>Following</h4>
              <div className='flex gap-x-2 items-center'>
                <h4 className='text-dark dark:text-light font-thin subtitle'>
                  {followedProfiles?.length} total
                </h4>
                <ViewToggle view={view} onViewChange={setView} />
              </div>
            </div>
            {view === 'grid' ? (
              <GridLayout>
                {followedProfiles.map((user) => (
                  <UserCard
                    id={user.id}
                    key={user.id}
                    name={user.user.name as string}
                    image={user.user.image as string}
                    onClick={() => router.push(`/profile/${user.id}`)}
                  />
                ))}
              </GridLayout>
            ) : (
              <ListLayout>
                {followedProfiles.map((user) => (
                  <UserComponent
                    id={user.id}
                    key={user.id}
                    name={user.user.name as string}
                    avatarProps={{
                      src: user.user.image as string,
                    }}
                    description={user.bio} // TODO: update to profile type/persona
                    onClick={() => router.push(`/profile/${user.id}`)}
                  />
                ))}
              </ListLayout>
            )}
          </div>
        </ScrollShadow>
      )} */}
      {suggestedUsers && suggestedUsers.length > 0 && (
        <ScrollShadow hideScrollBar>
          <div className='overflow-y-auto overflow-x-hidden py-4 px-6'>
            <div className='flex items-center justify-between mb-4'>
              <h4 className='text-dark/60 dark:text-light/60 subtitle'>
                Browse
              </h4>

              <div className='flex gap-x-2 items-center'>
                <h4 className='text-dark dark:text-light font-thin subtitle'>
                  {suggestedUsers?.length} total
                </h4>
                <ViewToggle view={view} onViewChange={setView} />
              </div>
            </div>
            {view === 'grid' ? (
              <GridLayout>
                {suggestedUsers.map((user) => (
                  <UserCard
                    id={user.id}
                    key={user.id}
                    name={user.user.name as string}
                    image={(user.user.image as string) || undefined}
                    onClick={() => router.push(`/profile/${user.id}`)}
                  />
                ))}
              </GridLayout>
            ) : (
              <ListLayout>
                {suggestedUsers.map((user) => (
                  <UserComponent
                    id={user.id}
                    key={user.id}
                    name={user.user.name as string}
                    avatarProps={{
                      src: user.user.image as string,
                      size: 'lg',
                      classNames: { base: 'mr-2' },
                    }}
                    description={user.bio} // TODO: update to profile type/persona
                    onClick={() => router.push(`/profile/${user.id}`)}
                    classNames={{
                      base: 'cursor-pointer hover:opacity-20',
                      wrapper: '',
                      name: 'h3 text-xl line-clamp-1',
                    }}
                  />
                ))}
              </ListLayout>
            )}
          </div>
        </ScrollShadow>
      )}
    </Box>
  );
};

export default Users;
