import { UserProfile } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa6';
import { TbMapPin, TbUserCheck, TbUserHeart } from 'react-icons/tb';

import { useFollowedArtists } from '@/hooks/useFollowedArtists';

const ProfileInfo: React.FC<UserProfile> = (profile) => {
  const router = useRouter();
  const { total: followedCount } = useFollowedArtists();

  return (
    <div className='flex gap-x-6 items-center py-4'>
      <div className='relative aspect-square w-24 rounded-full overflow-hidden bg-neutral-700'>
        {profile.images ? (
          <Image
            src={profile.images[0].url}
            alt='profile image'
            fill
            className='aspect-square object-cover'
          />
        ) : (
          <FaUser size={36} className='m-auto h-full text-dark' />
        )}
      </div>
      <div className='flex-1'>
        <h2 className='text-brand-primary'>{profile.display_name}</h2>
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
