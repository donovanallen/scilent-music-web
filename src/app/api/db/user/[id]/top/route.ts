import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = params.id;
  const { tracks, artists, timeRange } = await request.json();

  console.log('TOP ITEMS POST REQUEST:', {
    userId,
    tracks,
    artists,
    timeRange,
  });

  // if (userId) {
  //   const res = await prisma.topArtists.upsert({
  //     where: { userId: userId, range: timeRange },
  //     update: {
  //       artists: artists,
  //     },
  //     create: {
  //       artists: artists,
  //     },
  //   });
  // }

  return NextResponse.json(request.body, { status: 200 });
  // try {
  //   if (userId) {
  //     await prisma.topArtists.upsert({
  //       where: { userId: params.id },
  //       create: {
  //         artists,
  //       }
  //     });
  //   }
  // return NextResponse.json({artists: artistResponse, tracks: trackResponse}, { status: 200 });
  // } catch (error) {
  //   logger({ error }, 'API ERROR: Error fetching profile from database');
  //   return NextResponse.json(
  //     { error: 'API ERROR: Error fetching profile from database' },
  //     { status: 500 },
  //   );
  // }
}
