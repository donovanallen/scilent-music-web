import { TrackItem } from '@spotify/web-api-ts-sdk';
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
    const { track }: { track: TrackItem } = body;

    const updatedProfile = await prisma.profile.update({
      where: { id: profileId },
      data: {
        currentlyPlaying: {
          upsert: {
            create: {
              track: JSON.parse(JSON.stringify(track)),
              isPlaying: true,
            },
            update: {
              track: JSON.parse(JSON.stringify(track)),
              isPlaying: true,
            },
          },
        },
      },
      include: { currentlyPlaying: true },
    });

    return NextResponse.json({ track: updatedProfile.currentlyPlaying?.track });
  } catch (error) {
    logger({ errorMessage: 'Error updating recently played', error });
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
      },
    );
  }
}
