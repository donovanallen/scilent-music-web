import type { NextApiRequest, NextApiResponse } from 'next';

// import { mbApi } from '@/app/api/mb/mbConfig';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // const result = await mbApi.search('artist', { artist: 'dnvn' });
    return res.status(200); // Assuming success if we get here without errors
  } catch (error) {
    console.error('MusicBrainz API Error:', error);
    return res.status(500);
  }
}

export { handler as GET };
