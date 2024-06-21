import { EventIncludes, IArtist, IBrowseArtistsResult } from 'musicbrainz-api';
import { NextRequest, NextResponse } from 'next/server';

import logger from '@/lib/logger';

import { mbApi } from '@/app/api/mb/mbConfig';

const SUB_QUERY_OPTIONS = {
  artist: ['release-groups', 'genres', 'url-rels', 'label-rels', 'releases'],
  label: ['releases'],
  recording: ['artists', 'releases', 'release-groups', 'isrcs', 'url-rels'],
  release: ['artists', 'collections', 'release-groups', 'labels', 'recordings'],
  'release-group': ['artists', 'releases'],
  // 'release-group': [
  // 	'artist-credits',
  // 	'labels',
  // 	'recordings',
  // 	'tags',
  // 	'release-groups',
  // ],
};

export default async function handler(req: NextRequest) {
  const artist = req.nextUrl.searchParams.get('artist');
  const sourceId = req.nextUrl.searchParams.get('sourceId');

  try {
    const searchResult = artist && (await searchArtist(artist)); // MB
    if (searchResult) {
      const id = searchResult.id; // mbid
      const lookupResult = await lookup(
        'artist',
        id,
        SUB_QUERY_OPTIONS.artist as EventIncludes[],
      );
      console.log(`Artist lookup result:`, lookupResult);

      // create new Artist object
      const newArtist = {
        sourceId: sourceId,
        id: searchResult.id,
        name: searchResult.name,
        type: searchResult.type?.toLowerCase(),
        country: searchResult.country,
        ipis: searchResult.ipis,
        isnis: searchResult.isnis,
        desc: lookupResult?.disambiguation,
        rels: lookupResult?.relations,
        // genres: lookupResult?.genres,
        // releaseGroups: [],
      };

      // newArtist.releaseGroups = lookupResult && (await getReleases(lookupResult['release-groups']));

      return NextResponse.json(newArtist, { status: 200 });
    }
    return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
  } catch (error) {
    logger({ error }, '--- @ /mb/artist?artist=artistName');
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

// async function getReleases(releases: any[]) {
// 	try {
// 		// get cover art
// 		const result = Promise.all(
// 			releases.map(async (r) => {
// 				const mbid = r.mbid || r.id;
// 				const artwork = await getReleaseArtwork(mbid);
// 				const release = artwork ? { ...r, artwork } : r;
// 				return release;
// 			})
// 		);

// 		return result;
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

// async function getReleaseArtwork(mbid: string) {
// 	try {
// 		const artwork = (await coverArtApiClient.getReleaseGroupCovers(mbid)).images
// 			.filter((image) => image.front && image.approved)
// 			.map((image) => ({
// 				// id: image.id,
// 				// thumbnails: image.thumbnails,
// 				url: image.image,
// 				...image,
// 			}))[0]; // returns a single artwork object
// 		return artwork;
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

async function lookup(entity: any, mbid: string, subQuery: EventIncludes[]) {
  console.log({ entity, mbid, subQuery });
  try {
    const result = (await mbApi.lookup(entity, mbid, subQuery)) as IArtist;
    console.log('mbApi.lookup result', { result });
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function searchArtist(artistName: string) {
  try {
    const result: IBrowseArtistsResult = await mbApi.browse('artist', {
      query: artistName,
    });
    if (result['artist-count'] > 0) {
      const artist = result.artists[0];
      return artist;
    }
  } catch (error) {
    console.error(error);
  }
}

export { handler as GET };
