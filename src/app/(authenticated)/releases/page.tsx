'use client';

import React from 'react';

import Box from '@/components/Box';
import Header from '@/components/Header';

const Releases: React.FC = () => {
  // const { data: session, status } = useSession();

  // const [followedArtists, setFollowedArtists] = useState<FollowedArtists>();
  // const [releases, setReleases] = useState<SimplifiedAlbum[] | Album[]>();

  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     (async () => {
  //       const { artists } = await sdk.currentUser.followedArtists();
  //       console.log('followed artists', artists);

  //       const artistReleases = await Promise.all(
  //         artists.items.map(
  //           async (artist) =>
  //             await sdk.artists.albums(artist.id, undefined, 'US', 3),
  //         ),
  //       );
  //       setReleases(() => artistReleases.flatMap((r) => r.items));
  //     })();
  //   }
  // }, [status]);

  return (
    <Box className='h-full flex flex-col px-6'>
      <Header title='Releases'></Header>
      {/* {status === 'authenticated' && releases && (
        <PageContent
          albums={releases}
          // pageData={followedArtists.artists}
          // history={recents}
        />
      )} */}
    </Box>
  );
};

export default Releases;
