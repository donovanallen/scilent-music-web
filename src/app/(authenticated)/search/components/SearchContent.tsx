'use client';

import { ItemTypes, SearchResults } from '@spotify/web-api-ts-sdk';
import { useDebounce } from '@uidotdev/usehooks';
import React, { useEffect, useMemo, useState } from 'react';

import sdk from '@/lib/spotify-sdk/ClientInstance';

import AlbumsCollection from '@/components/AlbumsCollection';
import ArtistsCollection from '@/components/ArtistsCollection';
import TracksCollection from '@/components/TracksCollection';

import { SearchFilterValue } from '../../../../constant/types';
interface SearchContentProps {
  searchInput?: string;
  searchType?: SearchFilterValue | ItemTypes | string | undefined;
}

const SearchContent: React.FC<SearchContentProps> = ({
  searchInput,
  searchType,
}) => {
  // const [results, setResults] = useState<SearchResults<any>>(
  //   {} as SearchResults<any>,
  // );
  const [results, setResults] = useState<SearchResults<ItemTypes[]>>(
    {} as SearchResults<ItemTypes[]>,
  );
  const debouncedSearchInput = useDebounce(searchInput, 300);
  const memoizedSearchType: ItemTypes[] = useMemo(
    () =>
      searchType ? ([searchType] as ItemTypes[]) : ['artist', 'album', 'track'],
    [searchType],
  );

  useEffect(() => {
    (async () => {
      if (debouncedSearchInput) {
        const results = await sdk.search(
          debouncedSearchInput,
          memoizedSearchType,
        );
        setResults(() => results);
      }
    })();
  }, [debouncedSearchInput, memoizedSearchType]);

  const [totalResults, setTotalResults] = useState<number | null>();

  useEffect(() => {
    if (results.albums || results.artists || results.tracks) {
      const totalAlbums = results.albums?.total || 0;
      const totalArtists = results.artists?.total || 0;
      const totalTracks = results.tracks?.total || 0;
      setTotalResults(totalAlbums + totalArtists + totalTracks);
    }
  }, [results]);

  return (
    <div className='flex flex-col gap-y-2 w-full overflow-y-auto py-2'>
      {searchInput && (
        <>
          {results ? (
            <>
              <div className='w-full flex items-center justify-between'>
                <h3>Search Results</h3>
                <h4 className='subtitle'>Total: {totalResults}</h4>
              </div>

              {/* ARTISTS RESULTS */}
              {memoizedSearchType.includes('artist') &&
                results.artists?.total !== 0 &&
                results.artists?.items && (
                  <>
                    <h4 className='dark:text-light/80 text-dark/80'>
                      Artists ({results?.artists?.total})
                    </h4>
                    <ArtistsCollection artists={results?.artists?.items} />
                  </>
                )}

              {/* ALBUMS RESULTS */}
              {memoizedSearchType.includes('album') &&
                results.albums?.total !== 0 && (
                  <>
                    <h4 className='dark:text-light/80 text-dark/80'>
                      Albums ({results?.albums?.total})
                    </h4>
                    <AlbumsCollection albums={results?.albums?.items} />
                  </>
                )}

              {/* TRACKS RESULTS */}
              {memoizedSearchType.includes('track') &&
                results.tracks?.total !== 0 && (
                  <>
                    <h4 className='dark:text-light/80 text-dark/80'>
                      Tracks ({results?.tracks?.total})
                    </h4>
                    <TracksCollection tracks={results?.tracks?.items} />
                  </>
                )}
            </>
          ) : (
            <div className=' flex flex-col gap-y-2 w-full px-6 dark:text-light/60 text-dark/60'>
              No results found
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchContent;
