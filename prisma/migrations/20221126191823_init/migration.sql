/*
  Warnings:

  - You are about to drop the column `datetime` on the `ScreenSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScreenSession" DROP COLUMN "datetime",
ADD COLUMN     "date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
