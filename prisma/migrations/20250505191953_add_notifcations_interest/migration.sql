-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'TAKE_INTEREST';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "interestId" INTEGER;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
