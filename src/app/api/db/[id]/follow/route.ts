import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import logger from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const searchParams = request.nextUrl.searchParams;
  const follower = searchParams.get('follower');

  if (!follower) {
    return NextResponse.json(
      { error: 'Follower ID is required' },
      { status: 400 },
    );
  }

  try {
    const follow: Prisma.FollowCreateInput = {
      follower: { connect: { id: follower } },
      following: { connect: { id: params.id } },
    };
    const response = await prisma.follow.create({
      data: follow,
    });
    return NextResponse.json({ follow: response }, { status: 200 });
  } catch (error) {
    logger({ error }, 'API ERROR: Error following profile' + params.id);
    return NextResponse.json(
      { error: 'API ERROR: Error following profile' + params.id },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const searchParams = request.nextUrl.searchParams;
  const follower = searchParams.get('follower');

  if (!follower) {
    return NextResponse.json(
      { error: 'Follower ID is required' },
      { status: 400 },
    );
  }

  try {
    const response = await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: follower,
          followingId: params.id,
        },
      },
    });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    logger({ error }, 'API ERROR: Error unfollowing profile' + params.id);
    return NextResponse.json(
      { error: 'API ERROR: Error unfollowing profile' + params.id },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const searchParams = request.nextUrl.searchParams;
  const follower = searchParams.get('follower');

  if (!follower) {
    return NextResponse.json(
      { error: 'Follower ID is required' },
      { status: 400 },
    );
  }

  try {
    const response = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: follower,
          followingId: params.id,
        },
      },
    });
    return NextResponse.json({ isFollowing: !!response }, { status: 200 });
  } catch (error) {
    logger({ error }, 'API ERROR: Error getting follow status' + params.id);
    return NextResponse.json(
      { error: 'API ERROR: Error getting follow status' + params.id },
      { status: 500 },
    );
  }
}
