import { NextResponse } from 'next/server';

import logger from '@/lib/logger';

export async function GET() {
  try {
    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    logger({ error }, '--- @ /mb/ping');
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
