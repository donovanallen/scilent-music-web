/*
  Warnings:

  - You are about to drop the column `personaId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Review` table. All the data in the column will be lost.
  - Added the required column `subjectId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectType` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "personaId",
DROP COLUMN "subject",
ADD COLUMN     "subjectId" TEXT NOT NULL,
ADD COLUMN     "subjectType" "ReviewSubject" NOT NULL;
