-- CreateEnum
CREATE TYPE "TimeRange" AS ENUM ('SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM');

-- CreateTable
CREATE TABLE "TopArtists" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "timeRange" "TimeRange" NOT NULL,
    "artists" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopArtists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopTracks" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "timeRange" "TimeRange" NOT NULL,
    "tracks" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopTracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TopArtists_profileId_timeRange_key" ON "TopArtists"("profileId", "timeRange");

-- CreateIndex
CREATE UNIQUE INDEX "TopTracks_profileId_timeRange_key" ON "TopTracks"("profileId", "timeRange");

-- AddForeignKey
ALTER TABLE "TopArtists" ADD CONSTRAINT "TopArtists_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopTracks" ADD CONSTRAINT "TopTracks_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
