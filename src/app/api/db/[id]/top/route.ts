import { Prisma, TimeRange } from '@prisma/client';
import { Artist, Track } from '@spotify/web-api-ts-sdk';
import { NextRequest, NextResponse } from 'next/server';

import logger from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const profileId = params.id;
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams
    .get('filter')
    ?.toLocaleUpperCase() as TimeRange;

  const { tracks, artists }: { tracks: Track[]; artists: Artist[] } =
    await request.json();

  if (!profileId) {
    return NextResponse.json(
      { error: 'ProfileId not provided' },
      { status: 404 },
    );
  }

  try {
    if (profileId && tracks && artists) {
      const topArtists: Prisma.TopArtistsUpsertArgs = {
        where: { profileId_timeRange: { profileId, timeRange } },
        update: {
          artists: artists.map((a) => JSON.parse(JSON.stringify(a))),
          timeRange,
        },
        create: {
          profileId,
          timeRange,
          artists: artists.map((a) => JSON.parse(JSON.stringify(a))),
        },
      };

      const topTracks: Prisma.TopTracksUpsertArgs = {
        where: { profileId_timeRange: { profileId, timeRange } },
        update: {
          tracks: tracks.map((t) => JSON.parse(JSON.stringify(t))),
          timeRange,
        },
        create: {
          profileId,
          timeRange,
          tracks: tracks.map((t) => JSON.parse(JSON.stringify(t))),
        },
      };

      const [artistsUpsert, tracksUpsert] = await prisma.$transaction([
        prisma.topArtists.upsert(topArtists),
        prisma.topTracks.upsert(topTracks),
      ]);
      return NextResponse.json({
        artists: artistsUpsert,
        tracks: tracksUpsert,
      });
    }
  } catch (error) {
    logger(error, 'API ERROR: Error updating top items');
    return NextResponse.json(
      { error: 'API ERROR: Error updating top items' },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get('filter') as string;
  const profileId = params.id;

  if (!timeRange) {
    return NextResponse.json(
      { error: 'Time range is required' },
      { status: 400 },
    );
  }

  try {
    if (!profileId) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const [topArtists, topTracks] = await prisma.$transaction([
      prisma.topArtists.findUnique({
        where: {
          profileId_timeRange: {
            profileId,
            timeRange: timeRange.toLocaleUpperCase() as TimeRange,
          },
        },
      }),
      prisma.topTracks.findUnique({
        where: {
          profileId_timeRange: {
            profileId,
            timeRange: timeRange.toLocaleUpperCase() as TimeRange,
          },
        },
      }),
    ]);

    return NextResponse.json({
      artists: topArtists?.artists || [],
      tracks: topTracks?.tracks || [],
    });
  } catch (error) {
    logger(error, 'API ERROR: Error fetching top items');
    return NextResponse.json(
      { error: 'API ERROR: Error fetching top items' },
      { status: 500 },
    );
  }
}
