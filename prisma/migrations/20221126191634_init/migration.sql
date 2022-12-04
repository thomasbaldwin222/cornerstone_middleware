/*
  Warnings:

  - You are about to drop the column `date` on the `ScreenSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScreenSession" DROP COLUMN "date",
ADD COLUMN     "datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" JSONB NOT NULL DEFAULT '{}';
