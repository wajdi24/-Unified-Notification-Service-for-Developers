/*
  Warnings:

  - You are about to drop the column `emailFrom` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `emailPass` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `emailUser` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `mailHost` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `mailPort` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "emailFrom",
DROP COLUMN "emailPass",
DROP COLUMN "emailUser",
DROP COLUMN "mailHost",
DROP COLUMN "mailPort";
