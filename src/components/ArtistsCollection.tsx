import { ScrollShadow } from '@nextui-org/react';
import { Artist } from '@spotify/web-api-ts-sdk';
import { useRouter } from 'next/navigation';
import React from 'react';

import ArtistCard from '@/components/ArtistCard';
import ArtistListItem from '@/components/ArtistListItem';
import GridLayout from '@/components/layouts/GridLayout';
import ListLayout from '@/components/layouts/ListLayout';
import { ViewType } from '@/components/ViewToggle';
interface ArtistsCollectionProps {
  artists: Artist[];
  emptyText?: string;
  layout?: ViewType;
}

const ArtistsCollection: React.FC<ArtistsCollectionProps> = ({
  artists,
  emptyText = 'No artists available',
  layout = 'grid',
}) => {
  const router = useRouter();
  // const [view, setView] = useState<ViewType>('grid');

  const handleArtistClick = (artistId: string) => {
    router.push(`/artist/${artistId}`);
  };

  if (artists.length === 0) {
    return <div className='p-6 text-neutral-400'>{emptyText}</div>;
  }

  return (
    <div className='flex flex-col gap-y-4 overflow-hidden'>
      {/* <div className='w-full flex items-center justify-end'>
        <ViewToggle view={view} onViewChange={setView} className='' />
      </div> */}

      <ScrollShadow hideScrollBar className='overflow-y-auto overflow-x-hidden'>
        {layout === 'grid' ? (
          <GridLayout>
            {artists.map((artist) => (
              <ArtistCard
                key={artist.id}
                name={artist.name}
                image={artist.images ? artist.images[0]?.url : undefined}
                type={artist.type}
                id={artist.id}
                onClick={() => handleArtistClick(artist.id)}
              />
            ))}
          </GridLayout>
        ) : (
          <ListLayout>
            {artists.map((artist) => (
              <ArtistListItem
                key={artist.id}
                name={artist.name}
                image={artist.images ? artist.images[0]?.url : undefined}
                type={artist.type}
                id={artist.id}
                onClick={() => handleArtistClick(artist.id)}
              />
            ))}
          </ListLayout>
        )}
      </ScrollShadow>
    </div>
  );
};

export default React.memo(ArtistsCollection);
