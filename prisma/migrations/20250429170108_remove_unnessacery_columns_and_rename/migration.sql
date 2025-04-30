/*
 Warnings:
 
 - You are about to drop the column `friendIds` on the `Task` table. All the data in the column will be lost.
 - You are about to drop the column `interestIds` on the `Task` table. All the data in the column will be lost.
 - You are about to drop the column `userId` on the `Task` table. All the data in the column will be lost.
 - Added the required column `createdById` to the `Task` table without a default value. This is not possible if the table is not empty.
 
 */
-- DropForeignKey
ALTER TABLE
    "Task" DROP CONSTRAINT "Task_userId_fkey";

-- AlterTable
ALTER TABLE
    "Task" DROP COLUMN "friendIds",
    DROP COLUMN "interestIds",
    DROP COLUMN "userId",
ADD
    COLUMN "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE
    "Task"
ADD
    CONSTRAINT "Task_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;