-- AlterTable
ALTER TABLE "ScreenSession" ADD COLUMN     "company_id" SERIAL NOT NULL,
ADD COLUMN     "screen" JSONB NOT NULL DEFAULT '{ "width": "" }';
