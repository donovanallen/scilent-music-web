import {
  ICoverInfo,
  IImage,
  IReleaseGroupList,
  IReleaseGroupMatch,
} from 'musicbrainz-api';
import { NextRequest, NextResponse } from 'next/server';

import logger from '@/lib/logger';

import { coverArtApiClient, mbApi } from '@/app/api/mb/mbConfig';

// Define appropriate types for the response objects
interface ReleaseGroup extends IReleaseGroupMatch {
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

export async function GET(req: NextRequest) {
  const artist = req.nextUrl.searchParams.get('artist');

  if (!artist) {
    return NextResponse.json(
      { error: 'Missing artist parameter' },
      { status: 400 },
    );
  }

  try {
    const releases = await getUpcomingReleaseGroups(artist);

    if (!releases || releases?.length === 0) {
      return NextResponse.json([], { status: 200 });
    } else {
      console.log('RELEASES FOUND FOR ARTIST', artist, releases.length);
      const releaseGroupsWArtwork = await addArtworkToReleases(
        releases as any[],
      );

      return NextResponse.json(releaseGroupsWArtwork, { status: 200 });
    }
  } catch (error) {
    logger({ error }, '--- @ /mb/artist/upcoming');
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

async function getUpcomingReleaseGroups(
  artistName: string,
): Promise<IReleaseGroupMatch[]> {
  const query = {
    query: { artistname: artistName }, // Use the identifier (name or MBID) directly
    fmt: 'json', // Request JSON format
  };

  try {
    const result: IReleaseGroupList = await mbApi.search(
      'release-group',
      query,
    );
    const now = new Date();

    console.log(
      'ALL ARTIST RELEASES RESULT -- IReleaseGroupList.COUNT / IReleaseGroupMatch.COUNT',
      result.count,
      result['release-groups'].length,
    );

    const futureReleases = result['release-groups'].filter((group) => {
      const releaseDate = new Date(
        'first-release-date' in group ? group['first-release-date'] : '',
      );
      return releaseDate > now;
    });
    console.log('FUTURE RELEASES RESULT -- COUNT', futureReleases.length);

    return futureReleases;
  } catch (error) {
    logger({ error }, 'Error searching release groups');
    throw new Error('Error fetching data from MusicBrainz');
  }
}

async function getReleaseArtwork(mbid: string): Promise<IImage | undefined> {
  try {
    const { images }: ICoverInfo =
      await coverArtApiClient.getReleaseGroupCovers(mbid);
    const approvedFrontImages: IImage[] = images.filter(
      (image) => image.front && image.approved,
    );
    console.log('COVER ART IMAGES FOUND', approvedFrontImages.length);
    return approvedFrontImages.length > 0 ? approvedFrontImages[0] : undefined;
  } catch (error) {
    logger({ error }, '--- Error fetching cover art');
    return undefined;
  }
}

async function addArtworkToReleases(
  releases: ReleaseGroup[],
): Promise<ReleaseGroup[]> {
  try {
    return await Promise.all(
      releases.map(async (release) => {
        const mbid = release.mbid || release.id;
        const artwork = await getReleaseArtwork(mbid);
        return artwork ? { ...release, artwork } : release;
      }),
    );
  } catch (error) {
    logger({ error }, '--- Error in addArtworkToReleases');
    return releases;
  }
}

// export { handler as GET };
