import { PlayHistory } from '@spotify/web-api-ts-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import logger from '@/lib/logger';
import { prisma } from '@/lib/prisma';

import authOptions from '@/app/api/auth/[...nextauth]/authOptions';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.id !== params.id) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }
  const profileId = params.id;

  const profile = await prisma.profile.findUnique({ where: { id: profileId } });

  if (!profile) {
    return new NextResponse(JSON.stringify({ error: 'Not found' }), {
      status: 404,
    });
  }

  try {
    const body = await request.json();
    const { tracks }: { tracks: PlayHistory[] } = body;

    const updatedRecentlyPlayed = await prisma.profile.update({
      where: { id: profileId },
      data: {
        recentlyPlayed: {
          upsert: {
            create: {
              tracks: {
                create: tracks.map((track: any) => ({
                  played_at: new Date(track.played_at),
                  track: track.track,
                  context: track.context || {},
                })),
              },
            },
            update: {
              tracks: {
                deleteMany: {},
                create: tracks.map((track: any) => ({
                  played_at: new Date(track.played_at),
                  track: track.track,
                  context: track.context || {},
                })),
              },
            },
          },
        },
      },
      include: { recentlyPlayed: { include: { tracks: true } } },
    });

    return NextResponse.json(updatedRecentlyPlayed);
  } catch (e) {
    logger({ errorMessage: 'Error updating recently played:', error: e });
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
      },
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.id !== params.id) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }
  try {
    const recentlyPlayed = await prisma.recentlyPlayed.findUnique({
      where: { profileId: params.id },
      include: { tracks: true },
    });

    if (!recentlyPlayed) {
      return new NextResponse(JSON.stringify({ error: 'Not found' }), {
        status: 404,
      });
    }

    return NextResponse.json(recentlyPlayed);
  } catch (e) {
    logger({ errorMessage: 'Error fetching recently played:', error: e });

    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
      },
    );
  }
}
