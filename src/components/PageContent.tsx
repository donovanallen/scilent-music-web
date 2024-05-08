import {
  Album,
  Artist,
  PlayHistory,
  SimplifiedAlbum,
  SimplifiedTrack,
  Track,
} from '@spotify/web-api-ts-sdk';
import React from 'react';

import AlbumItem from '@/components/AlbumItem';
import ArtistItem from '@/components/ArtistItem';
import TrackItem from '@/components/TrackItem';

import { ScilentAlbum } from '@/constant/types';

interface PageContentProps {
  artists?: Artist[];
  history?: PlayHistory[];
  albums?: Album[] | SimplifiedAlbum[] | ScilentAlbum[];
  tracks?: Track[] | SimplifiedTrack[];
}

const PageContent: React.FC<PageContentProps> = ({
  artists,
  history,
  albums,
  tracks,
}) => {
  if (albums) {
    return albums?.length !== 0 ? (
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 my-4 overflow-y-scroll no-scrollbar'>
        {albums &&
          albums.map((album: Album | ScilentAlbum | SimplifiedAlbum | any) => (
            <AlbumItem
              key={album.id}
              name={album.title || album.name}
              image={album.images ? album.images[0]?.url : album.artwork?.url}
              timestamp={album.releaseDate || album.release_date}
              type={album.album_type || album.type}
              id={album.id}
            />
          ))}
      </div>
    ) : (
      <div className='mt-4 text-neutral-400'>No albums found</div>
    );
  }

  if (tracks) {
    return tracks?.length !== 0 ? (
      <div className='flex flex-col w-full overflow-y-scroll no-scrollbar'>
        {tracks &&
          tracks.map((track, i) => (
            <TrackItem key={i} track={track} numbered disabled />
          ))}
      </div>
    ) : (
      <div className='mt-4 text-neutral-400'>No albums found</div>
    );
  }

  if (history) {
    return history?.length !== 0 ? (
      <div className='flex flex-col w-full overflow-y-scroll no-scrollbar'>
        {history &&
          history.map((h, i) => (
            <TrackItem
              key={i}
              track={h.track}
              timestamp={new Date(h.played_at)}
            />
          ))}
      </div>
    ) : (
      <div className='mt-4 text-neutral-400'>No recent listens</div>
    );
  }

  if (artists) {
    return artists.length === 0 ? (
      <div className='mt-4 text-neutral-400'>No artists available</div>
    ) : (
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 my-4 overflow-y-scroll no-scrollbar'>
        {artists &&
          artists.map((artist) => (
            <ArtistItem
              key={artist.id}
              id={artist.id}
              name={artist.name}
              image={artist.images[0]?.url}
              type={artist.type}
            />
          ))}
      </div>
    );
  }

  return null;
};

export default PageContent;
