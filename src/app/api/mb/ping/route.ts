import { NextResponse } from 'next/server';

import logger from '@/lib/logger';

export default async function handler() {
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

export { handler as GET };
