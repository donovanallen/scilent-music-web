import { Artist } from '@spotify/web-api-ts-sdk';
import { useRouter } from 'next/navigation';
import React from 'react';

import ArtistCard from '@/components/ArtistCard';

interface ArtistsCollectionProps {
  artists: Artist[];
  emptyText?: string;
}

const ArtistsCollection: React.FC<ArtistsCollectionProps> = ({
  artists,
  emptyText = 'No artists available',
}) => {
  const router = useRouter();

  return artists.length ? (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 my-4 overflow-y-scroll no-scrollbar'>
      {artists.map((artist) => (
        <ArtistCard
          key={artist.id}
          name={artist.name}
          image={artist.images ? artist.images[0]?.url : undefined}
          type={artist.type}
          id={artist.id}
          onClick={() => router.push(`/artist/${artist.id}`)}
        />
      ))}
    </div>
  ) : (
    <div className='mt-4 text-neutral-400'>{emptyText}</div>
  );
};

export default React.memo(ArtistsCollection);
