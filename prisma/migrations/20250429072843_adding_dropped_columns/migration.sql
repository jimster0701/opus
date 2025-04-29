/*
  Warnings:

  - Added the required column `icon` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Made the column `themePreset` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "icon" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "displayName" TEXT,
ALTER COLUMN "themePreset" SET NOT NULL;
