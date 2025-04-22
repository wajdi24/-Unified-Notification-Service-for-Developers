/*
  Warnings:

  - You are about to drop the column `isProfileCompleted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isProfileCompleted",
ADD COLUMN     "isProfileCompleted" BOOLEAN NOT NULL DEFAULT false;
