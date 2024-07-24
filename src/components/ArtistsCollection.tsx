import { Tab, Tabs } from '@nextui-org/react';
import { Artist } from '@spotify/web-api-ts-sdk';
import { useRouter } from 'next/navigation';
import React from 'react';
import { IoGrid, IoList } from 'react-icons/io5';

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
    <>
      <div className='flex w-full flex-col mb-2'>
        <Tabs
          aria-label='View options'
          color='default'
          variant='bordered'
          className='self-end'
          size='sm'
          radius='lg'
          defaultSelectedKey='grid'
          isDisabled
        >
          <Tab
            key='grid'
            title={
              <div className='flex items-center space-x-2'>
                <IoGrid />
                <span>Grid</span>
              </div>
            }
          />
          <Tab
            key='list'
            title={
              <div className='flex items-center space-x-2'>
                <IoList />
                <span>List</span>
              </div>
            }
          />
        </Tabs>
      </div>
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
    </>
  ) : (
    <div className='mt-4 text-neutral-400'>{emptyText}</div>
  );
};

export default React.memo(ArtistsCollection);
