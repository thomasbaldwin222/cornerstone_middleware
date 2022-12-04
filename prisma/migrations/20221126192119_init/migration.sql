/*
  Warnings:

  - The `date_time` column on the `ScreenSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ScreenSession" DROP COLUMN "date_time",
ADD COLUMN     "date_time" INTEGER;
