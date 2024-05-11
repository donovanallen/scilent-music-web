'use client';

import { UserProfile } from '@spotify/web-api-ts-sdk';
import { useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa6';
import { TbMapPin, TbUserCheck, TbUserHeart } from 'react-icons/tb';

import { useFollowedArtists } from '@/hooks/useFollowedArtists';

import HeaderImage from '@/components/HeaderImage';

const ProfileInfo: React.FC<UserProfile> = (profile) => {
  const router = useRouter();
  const { total: followedCount } = useFollowedArtists();

  return (
    <div className='flex gap-x-6 items-center py-4'>
      <HeaderImage
        imageUrl={profile?.images[0].url}
        alt='Profile image'
        fallbackIcon={FaUser}
      />
      <div className='flex-1'>
        <h2 className='text-brand-primary w-full line-clamp-1 text-lg sm:h2'>
          {profile.display_name}
        </h2>
        <div
          className='flex gap-x-1 items-center cursor-pointer'
          onClick={() => router.push('/artists')}
        >
          <TbUserHeart className='text-neutral-500' />
          <p>{followedCount.toFixed(0)}</p>
          <p className='subtitle text-neutral-500'>Following</p>
        </div>
        <div className='flex gap-x-1 items-center'>
          <TbUserCheck className='text-neutral-500' />
          <p>{profile.followers.total}</p>
          <p className='subtitle text-neutral-500'>Followers</p>
        </div>
        <div className='flex gap-x-1 items-center'>
          <TbMapPin className='text-neutral-500' />
          <p>{profile.country}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
