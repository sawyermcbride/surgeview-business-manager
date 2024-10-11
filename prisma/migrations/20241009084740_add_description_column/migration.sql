/*
  Warnings:

  - Added the required column `code` to the `verifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "verifications" ADD COLUMN     "code" INTEGER NOT NULL;
