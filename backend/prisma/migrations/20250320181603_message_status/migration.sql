-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('unread', 'read');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "status" "MessageStatus" NOT NULL DEFAULT 'unread';
