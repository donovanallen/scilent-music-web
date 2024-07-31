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

import { cn } from '@/lib/utils';

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
  const [isUsernameLoading, setIsUsernameLoading] = useState<boolean>(false);
  const [isBioLoading, setIsBioLoading] = useState<boolean>(false);

  const handleUsernameSubmit = async () => {
    setIsUsernameLoading(true);
    const value = username;

    await fetch(`/api/db/${session?.user.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ field: 'username', value }),
    })
      .then(async (res: Response) => {
        if (res.ok) {
          const resJson = (await res.json()) as Profile;
          setUsername(resJson?.username as string);
        }
      })
      .finally(() => {
        setIsUsernameLoading(false);
        setUsernameEditable(false);
      });
  };

  const handleBioSubmit = async () => {
    setIsBioLoading(true);
    const value = bio;

    await fetch(`/api/db/${session?.user.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ field: 'bio', value }),
    })
      .then(async (res: Response) => {
        if (res.ok) {
          const resJson = (await res.json()) as Profile;
          setBio(resJson.bio as string);
        }
      })
      .finally(() => {
        setIsBioLoading(false);
        setBioEditable(false);
      });
  };

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
                    variant='flat'
                    size='sm'
                    radius='sm'
                    startContent={
                      <TbAt className='h4 text-dark/30 dark:text-light/30' />
                    }
                    fullWidth={true}
                    isClearable
                    onChange={(e) => setUsername(e.target.value)}
                    onClear={() => setUsernameEditable(false)}
                    onSubmit={handleUsernameSubmit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUsernameSubmit();
                      }
                      if (e.key === 'Escape') {
                        setUsernameEditable(false);
                      }
                    }}
                    autoFocus
                    maxLength={20}
                    minLength={0}
                    validate={(value) =>
                      value && value.length > 0 ? true : null
                    } // TODO: add usernamevalidation
                    validationBehavior='native'
                    classNames={{
                      input: cn(
                        'h4 text-dark/70 dark:text-light/70',
                        isUsernameLoading ? 'animated-underline' : '',
                      ),
                    }}
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
          <div className='inline-flex items-center'>
            {(bio || isCurrentUser) && (
              <p className='subtitle text-dark/50 dark:text-light/50'>About</p>
            )}
            {isCurrentUser && !bioEditable && (
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

          {bioEditable ? (
            <div className='flex items-center my-2 w-full lg:w-1/2 gap-x-1'>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                variant='flat'
                size='md'
                radius='sm'
                fullWidth={false}
                placeholder='Tell the commuinty about yourself'
                onClear={() => setBioEditable(false)}
                maxRows={3}
                minRows={2}
                maxLength={140}
                classNames={{
                  input: cn(
                    'p text-sm text-dark/70 dark:text-light/70 ',
                    isBioLoading ? 'animated-underline' : '',
                  ),
                }}
              />
              <div className='flex flex-col items-center gap-y-1 justify-between h-full'>
                <IconButton
                  onClick={() => setBioEditable(false)}
                  variant='ghost'
                  icon={TbX}
                  classNames={{ icon: 'subtitle' }}
                  className='self-end'
                  disabled={isBioLoading}
                  hidden={isBioLoading}
                />
                <IconButton
                  onClick={handleBioSubmit}
                  variant='outline'
                  icon={TbCaretRight}
                  classNames={{ icon: 'subtitle' }}
                  className='self-end'
                  disabled={!bio || isBioLoading}
                  isLoading={isBioLoading}
                />
              </div>
            </div>
          ) : bio ? (
            <div className='inline-flex items-center text-center justify-start w-full mb-2'>
              <p className='text-sm text-dark/70 dark:text-light/70 line-clamp-3'>
                {bio}
              </p>
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
