import { NextRequest, NextResponse } from 'next/server';

import logger from '@/lib/logger';

import { coverArtApiClient, mbApi } from '@/app/api/mb/mbConfig';

export async function GET(req: NextRequest) {
  const artist = req.nextUrl.searchParams.get('artist');

  try {
    const releases = artist && (await getUpcomingReleaseGroups(artist));

    if (releases && releases.length > 0) {
      const releaseGroups = releases.map((r) => ({
        // const newRg = new ReleaseGroup(r.id, 'mbid');
        id: r.id,
        mbid: r.id,
        title: r.title,
        type: r['primary-type'],
        date: r['first-release-date'],
        artists: r['artist-credit'],
        releases: r.releases,
        subTypes: r['secondary-types'],
        // return newRg;
      }));

      const releaseGroupsWArtwork = await getReleases(releaseGroups);

      return NextResponse.json(releaseGroupsWArtwork, { status: 200 });
    }

    // return NextResponse.json(releases, { status: 200 });
  } catch (error) {
    logger({ error }, '--- @ /mb/artist/upcoming');
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

async function getReleases(releases: any[]) {
  try {
    // get cover art
    const result = Promise.all(
      releases.map(async (r) => {
        const mbid = r.mbid || r.id;
        const artwork = await getReleaseArtwork(mbid);
        const release = artwork ? { ...r, artwork } : r;
        return release;
      }),
    );

    return result;
  } catch (error) {
    console.error(error);
  }
}

async function getReleaseArtwork(mbid: string) {
  try {
    const artwork = (await coverArtApiClient.getReleaseGroupCovers(mbid)).images
      .filter((image) => image.front && image.approved)
      .map((image) => ({
        url: image.image,
        // id: image.id,
        // thumbnails: image.thumbnails,
        ...image,
      }))[0]; // returns a single artwork object
    return artwork;
  } catch (error) {
    console.error(error);
  }
}

async function getUpcomingReleaseGroups(artistName: string) {
  const query = {
    query: { artistname: artistName }, // Use the identifier (name or MBID) directly
    fmt: 'json', // Request JSON format
  };

  try {
    const result = await mbApi.search('release-group', query);
    const now = new Date();
    const upcomingReleaseGroups = result['release-groups'].filter((group) => {
      const releaseDate = new Date(group['first-release-date']);
      return releaseDate > now;
    });
    return upcomingReleaseGroups;
  } catch (error) {
    console.error('Error searching release groups:', error);
  }
}

// export { handler as GET };
