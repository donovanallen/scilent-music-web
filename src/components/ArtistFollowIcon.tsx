import { Tooltip } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheck, FaPlus } from 'react-icons/fa6';

import sdk from '@/lib/spotify-sdk/ClientInstance';

import IconButton from '@/components/buttons/IconButton';

type ArtistFollowIconProps = {
  id: string;
  followEnabled?: boolean;
};

const ArtistFollowIcon: React.FC<ArtistFollowIconProps> = ({
  id,
  followEnabled = true,
}) => {
  const [userFollows, setUserFollows] = useState<boolean>();

  // SPOTIFY ARTIST/USER FOLLOW
  useEffect(() => {
    (async () => {
      const follows = await sdk.currentUser.followsArtistsOrUsers(
        [id],
        'artist',
      );
      setUserFollows(() => follows[0]);
    })();
  }, [id]);

  const followArtist = async (id: string) => {
    return await sdk.currentUser
      .followArtistsOrUsers([id], 'artist')
      .catch((e) => {
        toast.error('Error following artist: ', e);
      })
      .then(() => {
        setUserFollows(true);
      })
      .finally(() => {
        toast.success('Artist followed');
      });
  };

  return (
    // {/* ARTIST FOLLOW ICON */}
    <Tooltip
      shadow='md'
      size='sm'
      content={userFollows ? 'Artist followed' : 'Follow artist'}
      classNames={{
        content: 'text-dark bg-light',
        base: 'max-w-xs',
      }}
      delay={1000}
      showArrow
    >
      <IconButton
        onClick={() => followArtist(id)}
        icon={userFollows ? FaCheck : FaPlus}
        variant='ghost'
        disabled={userFollows}
        classNames={{ icon: userFollows ? 'text-brand-dark' : '' }}
        hidden={!followEnabled && !userFollows} // TODO: Fix this logic for review component
      />
    </Tooltip>
  );
};

export default ArtistFollowIcon;
