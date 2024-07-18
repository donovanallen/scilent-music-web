import { Album, SimplifiedAlbum } from '@spotify/web-api-ts-sdk';
import { useRouter } from 'next/navigation';
import React from 'react';

import { formatArtists } from '@/lib/utils';

import AlbumCard from '@/components/AlbumCard';

import { ScilentAlbum } from '@/constant/types';

interface AlbumsCollectionProps {
  albums?: Album[] | SimplifiedAlbum[] | ScilentAlbum[];
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

  return albums?.length !== 0 ? (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 my-4 overflow-y-scroll no-scrollbar'>
      {albums &&
        albums.map((album: Album | ScilentAlbum | SimplifiedAlbum | any) => (
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
        ))}
    </div>
  ) : (
    <div className='mt-4 text-neutral-400'>{emptyText}</div>
  );
};

export default AlbumsCollection;
