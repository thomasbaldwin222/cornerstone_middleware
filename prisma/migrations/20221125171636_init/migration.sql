-- CreateTable
CREATE TABLE "SessionEvent" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,

    CONSTRAINT "SessionEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SessionEvent" ADD CONSTRAINT "SessionEvent_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "ScreenSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
