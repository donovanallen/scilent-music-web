import { Follow, Profile, User } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import logger from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const response:
      | (Profile & { user: User } & { followers: Follow[] } & {
          following: Follow[];
        })
      | null = await prisma.profile.findFirst({
      where: { id: params.id },
      include: {
        user: { include: { accounts: true } },
        followers: true,
        following: true,
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
