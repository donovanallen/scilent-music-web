'use client';

import { Input, Skeleton, Textarea, User } from '@nextui-org/react';
import { Follow, Profile, User as ScilentUser } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { Suspense, useMemo, useState } from 'react';
import { FaUser } from 'react-icons/fa6';
import {
  TbAt,
  TbCaretRight,
  TbEdit,
  TbUserHeart,
  TbUsers,
  TbX,
} from 'react-icons/tb';

import IconButton from '@/components/buttons/IconButton';

const ProfileInfo: React.FC<
  Profile & { user: ScilentUser } & { followers: Follow[] } & {
    following: Follow[];
  }
> = (profile) => {
  const { data: session } = useSession();
  const isCurrentUser = useMemo(
    () => session?.user.id === profile?.user?.id,
    [profile, session],
  );
  const [username, setUsername] = useState<string>(profile.username ?? '');
  const [bio, setBio] = useState<string>(profile.bio ?? '');
  const [usernameEditable, setUsernameEditable] = useState<boolean>(false);
  const [bioEditable, setBioEditable] = useState<boolean>(false);

  return (
    <Suspense fallback={<Skeleton />}>
      <div className='flex flex-col items-start gap-y-2 w-full'>
        <User
          name={
            <div className='flex w-full items-center justify-start gap-x-2'>
              <p>{profile?.user?.name}</p>
            </div>
          }
          description={
            <>
              <div className='inline-flex items-center text-start w-full mb-2'>
                {usernameEditable ? (
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder=''
                    variant='flat'
                    size='sm'
                    radius='sm'
                    // label='Enter a new username'
                    // description='This will be visible to other users'
                    startContent={
                      <TbAt className='h4 text-dark/30 dark:text-light/30' />
                    }
                    // endContent={<TbCaretRight className='subtitle' />}
                    fullWidth={false}
                    isClearable
                    onClear={() => setUsernameEditable(false)}
                    classNames={{
                      input: 'h4 text-dark/70 dark:text-light/70',
                    }}
                    // className='w-full subtitle p-2 placeholder:text-neutral-700 outline-none my-4 dark:caret-brand-light caret-dark bg-light dark:bg-dark rounded-sm'
                  />
                ) : (
                  username && (
                    <h4 className='text-dark dark:text-brand-dark'>
                      @{username}
                    </h4>
                  )
                )}
                {isCurrentUser && !usernameEditable && (
                  <IconButton
                    onClick={() => setUsernameEditable(true)}
                    variant='ghost'
                    icon={TbEdit}
                    classNames={{
                      icon: 'subtitle text-dark/30 dark:text-light/30',
                    }}
                  />
                )}
                {isCurrentUser && usernameEditable && (
                  <IconButton
                    // onClick={() => setUsernameEditable(false)}
                    variant='outline'
                    icon={TbCaretRight}
                    classNames={{ icon: 'subtitle' }}
                  />
                )}
              </div>
              {profile?.following && (
                <div className='flex gap-x-1 items-center'>
                  <TbUserHeart className='text-dark/50 dark:text-light/50' />
                  <p>{profile?.following.length}</p>
                  <p className='subtitle text-dark/50 dark:text-light/50'>
                    Following
                  </p>
                </div>
              )}
              {profile?.followers && (
                <div className='flex gap-x-1 items-center'>
                  <TbUsers className='text-dark/50 dark:text-light/50' />
                  <p>{profile?.followers.length}</p>
                  <p className='subtitle text-dark/50 dark:text-light/50'>
                    Followers
                  </p>
                </div>
              )}
            </>
          }
          avatarProps={{
            src: profile?.user?.image ?? '',
            fallback: <FaUser />,
            radius: 'sm',
            size: 'lg',
            classNames: {
              img: '',
              base: 'self-stretch',
            },
          }}
          classNames={{
            name: 'text-brand-dark dark:text-brand-primary w-full line-clamp-1 text-lg sm:h2',
            description: '',
            base: 'flex-1 justify-start',
            wrapper: '',
          }}
        />
        <div className='flex flex-col items-start text-start justify-start my-2 w-full'>
          {(profile?.bio || isCurrentUser) && (
            <p className='subtitle text-dark/50 dark:text-light/50'>About</p>
          )}

          {bioEditable ? (
            <div className='flex items-center my-2 w-1/2'>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                variant='flat'
                size='md'
                radius='sm'
                fullWidth={false}
                placeholder='Tell the commuinty about yourself'
                // description='This will be visible on your profile'
                onClear={() => setBioEditable(false)}
                classNames={{
                  input: 'p text-sm text-dark/70 dark:text-light/70 ',
                }}

                // label='Enter a new bio'
                // startContent={
                //   <TbAt className='h4 text-dark/30 dark:text-light/30' />
                // }
                // endContent={<TbCaretRight className='subtitle' />}
                // isClearable
                // className='w-full subtitle p-2 placeholder:text-neutral-700 outline-none my-4 dark:caret-brand-light caret-dark bg-light dark:bg-dark rounded-sm'
              />
              <div className='flex flex-col items-center justify-between h-full'>
                <IconButton
                  onClick={() => setBioEditable(false)}
                  variant='ghost'
                  icon={TbX}
                  classNames={{ icon: 'subtitle' }}
                  className='self-end'
                />
                <IconButton
                  // onClick={() => setBioEditable(false)}
                  variant='ghost'
                  icon={TbCaretRight}
                  classNames={{ icon: 'subtitle' }}
                  className='self-end'
                />
              </div>
            </div>
          ) : profile?.bio ? (
            <div className='inline-flex items-center text-center justify-start w-full mb-2'>
              <p className='text-sm text-dark/70 dark:text-light/70 line-clamp-3'>
                {profile?.bio}
              </p>
              {isCurrentUser && (
                <IconButton
                  onClick={() => setBioEditable(true)}
                  variant='ghost'
                  icon={TbEdit}
                  classNames={{
                    icon: 'subtitle text-dark/30 dark:text-light/30',
                  }}
                />
              )}
            </div>
          ) : (
            isCurrentUser && (
              <div className='inline-flex items-center text-center justify-start w-full mb-2'>
                <p className='text-sm text-dark/70 dark:text-light/70 line-clamp-1'>
                  Add a bio
                </p>

                <IconButton
                  onClick={() => setBioEditable(true)}
                  variant='ghost'
                  icon={TbEdit}
                  classNames={{
                    icon: 'subtitle text-dark/30 dark:text-light/30',
                  }}
                />
              </div>
            )
          )}

          {}
        </div>
      </div>
    </Suspense>
  );
};

export default ProfileInfo;
