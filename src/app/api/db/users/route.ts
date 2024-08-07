import { NextRequest, NextResponse } from 'next/server';

import logger from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const response = await prisma.profile.findMany({
      include: {
        user: {
          include: { accounts: true },
        },
      },
    });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    logger({ error }, 'API ERROR: Error fetching profiles from database');
    return NextResponse.json(
      { error: 'API ERROR: Error fetching profiles from database' },
      { status: 500 },
    );
  }
}
