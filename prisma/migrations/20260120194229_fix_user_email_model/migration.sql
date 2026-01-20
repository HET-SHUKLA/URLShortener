/*
  Warnings:

  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tokenVersion" BIGINT NOT NULL DEFAULT 1,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email";
