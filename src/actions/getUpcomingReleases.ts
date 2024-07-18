import { Album, SimplifiedArtist } from '@spotify/web-api-ts-sdk';
import { IImage, IReleaseGroup } from 'musicbrainz-api';

import logger from '@/lib/logger';

const BASE_URL = 'http://localhost:5001/mb'; // ! TODO: add env's
const NEXT_API = '/api/mb';

interface ReleaseGroup extends IReleaseGroup {
  // id: string;
  mbid: string;
  artwork?: IImage;
  // title: string;
  // type: string;
  // date: string;
  // artists: Array<{ artist?: { name: string }, name: string }>; // Simplified type
  // releases: Array<any>; // Add a more specific type if available
  // subTypes: Array<string>;
}

// interface MusicBrainzReleaseGroupResponse {
//   'release-groups': ReleaseGroup[];
// }

const getUpcomingReleases = async (
  artistName?: string,
): Promise<Album[] | undefined> => {
  try {
    const response = await fetch(
      `${NEXT_API}/artist/upcoming?artist=${artistName}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch upcoming releases');
    }

    const releases: ReleaseGroup[] = (await response.json()) as ReleaseGroup[];

    console.log('RELEASES TO TRANSFORM: ', releases);

    // return releases;
    return transformScilentReleaseGroup(releases);
  } catch (error) {
    logger(error, 'Error fetching upcoming releases: getUpcomingReleases.ts');
  }
};

// Function to fetch upcoming releases in batches
// const batchUpcomingReleases = async (artists: string[]) => {
//   const response = await fetch(`${BASE_URL}/artist/upcoming`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ artists }),
//   });

//   if (response && response.body) {
//     const reader = response.body.getReader();
//     const decoder = new TextDecoder();
//     let result: string | undefined;
//     const releaseData = [];

//     // while (true) {
//     const { done, value } = await reader.read();

//     result += decoder.decode(value, { stream: true });

//     const lines = result?.split('\n');
//     result = lines?.length ? lines.pop() : '';

//     for (const line of lines || []) {
//       const data = JSON.parse(line);
//       releaseData.push(...data);
//     }

//     // console.log({ releaseData });

//     if (done) return releaseData;
//   }
// };

const transformScilentReleaseGroup = (
  releaseGroup: ReleaseGroup[],
): Album[] | undefined => {
  if (releaseGroup.length === 0) return; // Return an empty array if no releases found

  console.log('TRANSFORM RELEASE GROUP :: ', releaseGroup);
  return releaseGroup.map(
    (release) =>
      release && {
        name: release.title,
        type: release['primary-type']?.toLowerCase(),
        album_type: release['secondary-types']
          ? release['secondary-types'][0]?.toLowerCase()
          : undefined,
        release_date: release['first-release-date'],
        images: release.artwork
          ? [{ url: release.artwork.thumbnails.large }]
          : [],
        artists: release['artist-credit'].map((artist) => ({
          id: artist.artist?.id,
          name: artist.artist?.name || artist.name,
          type: 'artist',
        })) as SimplifiedArtist[],
      },
  ) as Album[];
};

export { getUpcomingReleases };
