/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "employees_username_key" ON "employees"("username");
