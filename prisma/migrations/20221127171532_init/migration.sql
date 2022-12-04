/*
  Warnings:

  - You are about to drop the `SessionEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SessionEvent" DROP CONSTRAINT "SessionEvent_session_id_fkey";

-- DropTable
DROP TABLE "SessionEvent";
