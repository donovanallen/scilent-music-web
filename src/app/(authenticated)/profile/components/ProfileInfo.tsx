'use client';

import { User } from '@nextui-org/react';
import { UserProfile } from '@spotify/web-api-ts-sdk';
import { useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa6';
import { TbMapPin, TbUserCheck, TbUserHeart } from 'react-icons/tb';

interface ProfileInfoProps {
  profile: UserProfile;
  followedCount: number;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profile,
  followedCount,
}) => {
  const router = useRouter();

  return (
    <User
      name={profile.display_name}
      description={
        <>
          <div
            className='flex gap-x-1 items-center cursor-pointer'
            onClick={() => router.push('/artists')}
          >
            <TbUserHeart className='text-dark/50 dark:text-light/50' />
            <p>{followedCount.toFixed(0)}</p>
            <p className='subtitle text-dark/50 dark:text-light/50'>
              Following
            </p>
          </div>
          <div className='flex gap-x-1 items-center'>
            <TbUserCheck className='text-dark/50 dark:text-light/50' />
            <p>{profile.followers.total}</p>
            <p className='subtitle text-dark/50 dark:text-light/50'>
              Followers
            </p>
          </div>
          <div className='flex gap-x-1 items-center'>
            <TbMapPin className='text-dark/50 dark:text-light/50' />
            <p>{profile.country}</p>
          </div>
        </>
      }
      avatarProps={{
        src: profile?.images[0].url,
        fallback: <FaUser />,
        radius: 'sm',
        size: 'lg',
      }}
      classNames={{
        name: 'text-brand-dark dark:text-brand-primary w-full line-clamp-1 text-lg sm:h2',
        description: '',
        base: 'justify-start',
        wrapper: '',
      }}
    />
  );
};

export default ProfileInfo;
