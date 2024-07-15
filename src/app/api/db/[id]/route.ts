import { NextRequest, NextResponse } from 'next/server';

import logger from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export default async function handler(
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

export { handler as GET };
