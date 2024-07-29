/*
  Warnings:

  - You are about to drop the column `queue` on the `CurrentlyPlaying` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CurrentlyPlaying" DROP COLUMN "queue",
ALTER COLUMN "duration" DROP NOT NULL;
