import { Account, Profile, User } from '@prisma/client';
import {
  Album,
  Artist,
  PlayHistory,
  SimplifiedAlbum,
  SimplifiedTrack,
  Track,
} from '@spotify/web-api-ts-sdk';
import { useRouter } from 'next/navigation';
import React from 'react';

import { formatArtists } from '@/lib/utils';

import AlbumCard from '@/components/AlbumCard';
import ArtistCard from '@/components/ArtistCard';
import LoadingIndicator from '@/components/LoadingIndicator';
import TrackItem from '@/components/TrackItem';

import { ScilentAlbum } from '@/constant/types';

interface PageContentProps {
  artists?: Artist[];
  history?: PlayHistory[];
  albums?: Album[] | SimplifiedAlbum[] | ScilentAlbum[];
  tracks?: Track[] | SimplifiedTrack[];
  tracksNumbered?: boolean;
  albumContentProps?: {
    showArtist?: boolean;
  };
  profiles?: (Profile & { user: User & { accounts: Account[] } })[];
  loading?: boolean;
}

// const renderGrid = (
//   items: Album[] | SimplifiedAlbum[] | ScilentAlbum[] | Artist[],
//   Component: typeof AlbumItem | typeof ArtistItem,
//   noItemsText: string,
// ) =>
//   items.length ? (
//     <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 my-4 overflow-y-scroll no-scrollbar'>
//       {items.map((item, index) => (
//         <Component key={item.id || index} {...item} />
//       ))}
//     </div>
//   ) : (
//     <div className='mt-4 text-neutral-400'>
//       {noItemsText || 'Nothing to show'}
//     </div>
//   );

const PageContent: React.FC<PageContentProps> = ({
  artists,
  history,
  albums,
  albumContentProps,
  tracks,
  tracksNumbered,
  profiles,
  loading = false,
}) => {
  const router = useRouter();

  if (loading) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <LoadingIndicator className='self-center w-full' />
      </div>
    );
  } else {
    if (profiles) {
      return profiles?.length !== 0 ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 my-4 overflow-y-scroll no-scrollbar'>
          {profiles &&
            profiles.map((profile) => (
              <ArtistCard
                key={profile.id}
                name={profile.user.name ?? ''}
                image={profile.user.image ?? ''}
                type='User'
                id={profile.id}
                onClick={() => router.push(`/profile/${profile.id}`)}
              />
            ))}
        </div>
      ) : (
        <div className='mt-4 text-neutral-400'>No profiles found</div>
      );
    }

    if (albums) {
      return albums?.length !== 0 ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 my-4 overflow-y-scroll no-scrollbar'>
          {albums &&
            albums.map(
              (album: Album | ScilentAlbum | SimplifiedAlbum | any) => (
                <AlbumCard
                  key={album.id}
                  name={album.title || album.name}
                  image={
                    album.images ? album.images[0]?.url : album.artwork?.url
                  }
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
        </div>
      ) : (
        <div className='mt-4 text-neutral-400'>No albums found</div>
      );
    }

    if (artists) {
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
        <div className='mt-4 text-neutral-400'>No artists available</div>
      );
    }

    if (tracks) {
      return tracks?.length !== 0 ? (
        <div className='flex flex-col w-full overflow-y-scroll no-scrollbar'>
          {tracks &&
            tracks.map((track, i) => (
              <TrackItem
                key={i}
                track={track}
                disabled
                numbered={tracksNumbered}
              />
            ))}
        </div>
      ) : (
        <div className='mt-4 text-neutral-400'>No tracks found</div>
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
  }

  return null;
};

export default PageContent;
