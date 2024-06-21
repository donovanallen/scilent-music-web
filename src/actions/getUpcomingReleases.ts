import { Album, SimplifiedAlbum } from '@spotify/web-api-ts-sdk';

import logger from '@/lib/logger';

const BASE_URL = 'http://localhost:5001/mb'; // ! TODO: add env's
const NEXT_API = '/api/mb';

const getUpcomingReleases = async (artistName?: string): Promise<any> => {
  try {
    const response = await fetch(
      `${NEXT_API}/artist/upcoming?artist=${artistName}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch upcoming releases');
    }

    const releases = await response.json();

    return transformScilentReleaseGroup(releases);
  } catch (error) {
    logger(error, 'Error fetching upcoming releases: getUpcomingReleases.ts');
  }
};

// Function to fetch upcoming releases in batches
const batchUpcomingReleases = async (artists: string[]) => {
  const response = await fetch(`${BASE_URL}/artist/upcoming`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ artists }),
  });

  if (response && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result: string | undefined;
    const releaseData = [];

    // while (true) {
    const { done, value } = await reader.read();

    result += decoder.decode(value, { stream: true });

    const lines = result?.split('\n');
    result = lines?.length ? lines.pop() : '';

    for (const line of lines || []) {
      const data = JSON.parse(line);
      releaseData.push(...data);
    }

    // console.log({ releaseData });

    if (done) return releaseData;
  }
};

const transformScilentReleaseGroup = (
  releaseGroup: any[],
): Album | SimplifiedAlbum | any => {
  console.log('TRANSFORM RELEASE GROUP :: ', releaseGroup);

  return releaseGroup.map((release) => ({
    sourceId: { id: release.sourceId, source: release.source || 'spotify' },
    type: release.type.toLowerCase(),
    subTypes: release.subTypes,
    releaseDate: release.date,
    ...release,
  }));
};

export { batchUpcomingReleases, getUpcomingReleases };
