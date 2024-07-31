import { NextRequest, NextResponse } from 'next/server';

import logger from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const response = await prisma.profile.findFirst({
      where: { id: params.id },
      include: {
        user: { include: { accounts: true } },
        followers: true,
        following: true,
        topArtists: true,
        topTracks: true,
        recentlyPlayed: { include: { tracks: true } },
        currentlyPlaying: true,
      },
    });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    logger({ error }, 'API ERROR: Error fetching profile from database');
    return NextResponse.json(
      { error: 'API ERROR: Error fetching profile from database' },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { field, value } = body;

    if (!field || value === undefined) {
      return NextResponse.json(
        { error: 'Field and value are required' },
        { status: 400 },
      );
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: params.id },
      data: { [field]: value },
    });

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    logger({ error }, 'API ERROR: Error updating profile in database');
    return NextResponse.json(
      { error: 'API ERROR: Error updating profile in database' },
      { status: 500 },
    );
  }
}
