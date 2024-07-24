import { compareDesc } from 'date-fns';
const BASE_URL = 'http://localhost:5001/mb'; // ! TODO: add env's
const NEXT_API = '/api/mb';

const getArtistData = async (
  artistName?: string,
  id?: string,
): Promise<any> => {
  try {
    const response = await fetch(
      `${NEXT_API}/artist?artist=${artistName}${id ? '&sourceId=' + id : ''}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch artist data');
    }

    const artistData = await response.json();

    return transformArtistData(artistData);
  } catch (error) {
    console.error('Error fetching artist:', error);
  }
};

const transformArtistData = (artist: any) => {
  return {
    id: artist.id,
    sourceId: artist.sourceId,
    name: artist.name,
    type: artist.type,
    country: artist.country,
    desc: artist.desc,
    genres: artist.genres?.map((g: any) => g.name),
    externalLinks: getExternalLinks(artist.rels),
    relationTypes: new Set(artist.rels.map((rel: any) => rel['target-type'])),
    releases: transformArtistReleases(artist.releaseGroups).map((release) =>
      parseReleaseMB(release, {
        id: artist.id,
        name: artist.name,
        sourceId: artist.sourceId,
      }),
    ),
  };
};

const getExternalLinks = (rels: any) => {
  return rels.filter(
    (r: any) => r['target-type'] === 'url' && r.ended === false,
  );
};

const transformArtistReleases = (releases: any[]) => {
  return releases
    .map((r) => ({
      releaseDate:
        new Date(r['first-release-date']) || r['first-release-date'] || null,
      type: r['primary-type'],
      subTypes: r['secondary-types'],
      title: r.title,
      id: r.id,
      genres: r.genres.map((g: any) => g.name),
      artwork: r.artwork,
    }))
    .sort((a, b) => compareDesc(a?.releaseDate, b?.releaseDate));
};

const parseReleaseMB = (album: any, artist: any) => ({
  artist,
  timestamp: album?.releaseDate
    ? new Date(album?.releaseDate)?.toISOString()
    : '',
  releaseDate: album.releaseDate,
  title: album?.title,
  type: album.type,
  subTypes: album.subTypes,
  id: album?.id,
  genres: album?.genres,
  artwork: album?.artwork,
  // externalUrl: album?.externalUrl,
  // uri: album?.uri,
});

export default getArtistData;
