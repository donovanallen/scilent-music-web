import { Album, SimplifiedAlbum } from '@spotify/web-api-ts-sdk';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { formatArtists } from '@/lib/utils';

import AlbumCard from '@/components/AlbumCard';
import AlbumListItem from '@/components/AlbumListItem';
import GridLayout from '@/components/layouts/GridLayout';
import ListLayout from '@/components/layouts/ListLayout';
import ViewToggle, { ViewType } from '@/components/ViewToggle';

import { ScilentAlbum } from '@/constant/types';

interface AlbumsCollectionProps {
  albums: Album[] | SimplifiedAlbum[] | ScilentAlbum[];
  albumContentProps?: {
    showArtist?: boolean;
  };
  emptyText?: string;
}

const AlbumsCollection: React.FC<AlbumsCollectionProps> = ({
  albums,
  albumContentProps,
  emptyText = 'No albums available',
}) => {
  const router = useRouter();
  const [view, setView] = useState<ViewType>('grid');

  if (albums?.length === 0) {
    return <div className='p-6 text-neutral-400'>{emptyText}</div>;
  }

  return (
    <div className='flex flex-col gap-y-4 overflow-hidden'>
      <div className='w-full flex items-center justify-end'>
        <ViewToggle view={view} onViewChange={setView} className='' />
      </div>
      {view === 'grid' ? (
        <GridLayout>
          {albums?.map(
            (album: Album | ScilentAlbum | SimplifiedAlbum | any) => (
              <AlbumCard
                key={album.id}
                name={album.title || album.name}
                image={album.images ? album.images[0]?.url : album.artwork?.url}
                timestamp={album.releaseDate || album.release_date}
                type={album.album_type || album.type}
                id={album.id}
                onClick={() => router.push(`/release/${album.id}`)}
                artistName={
                  album.artists &&
                  albumContentProps &&
                  albumContentProps.showArtist &&
                  (formatArtists(album.artists) as string)
                }
              />
            ),
          )}
        </GridLayout>
      ) : (
        <ListLayout>
          {albums?.map(
            (album: Album | ScilentAlbum | SimplifiedAlbum | any) => (
              <AlbumListItem
                key={album.id}
                name={album.title || album.name}
                image={album.images ? album.images[0]?.url : album.artwork?.url}
                type={album.album_type || album.type}
                id={album.id}
                onClick={() => router.push(`/release/${album.id}`)}
                artistName={
                  album.artists &&
                  albumContentProps &&
                  albumContentProps.showArtist &&
                  (formatArtists(album.artists) as string)
                }
                // timestamp={album.releaseDate || album.release_date}
              />
            ),
          )}
        </ListLayout>
      )}
    </div>
  );
};

export default AlbumsCollection;
