-- AlterTable
ALTER TABLE "SessionEvent" ALTER COLUMN "pos" DROP DEFAULT;

-- CreateTable
CREATE TABLE "ScreenRecording" (
    "id" SERIAL NOT NULL,
    "company_id" SERIAL NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "session_id" INTEGER NOT NULL,

    CONSTRAINT "ScreenRecording_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScreenRecording" ADD CONSTRAINT "ScreenRecording_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "ScreenSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
