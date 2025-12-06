/*
  Warnings:

  - The values [OTP,APPROVE] on the enum `ProtectionMethod` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[authProvider,providerId]` on the table `user_auth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,authProvider]` on the table `user_auth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `notificationBody` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VerificationTokenType" AS ENUM ('EMAIL_VERIFY', 'PASSWORD_RESET');

-- AlterEnum
BEGIN;
CREATE TYPE "ProtectionMethod_new" AS ENUM ('NONE', 'PASSWORD');
ALTER TABLE "public"."url_analytics" ALTER COLUMN "methodUsed" DROP DEFAULT;
ALTER TABLE "public"."urls" ALTER COLUMN "protectionMethod" DROP DEFAULT;
ALTER TABLE "urls" ALTER COLUMN "protectionMethod" TYPE "ProtectionMethod_new" USING ("protectionMethod"::text::"ProtectionMethod_new");
ALTER TABLE "url_analytics" ALTER COLUMN "methodUsed" TYPE "ProtectionMethod_new" USING ("methodUsed"::text::"ProtectionMethod_new");
ALTER TYPE "ProtectionMethod" RENAME TO "ProtectionMethod_old";
ALTER TYPE "ProtectionMethod_new" RENAME TO "ProtectionMethod";
DROP TYPE "public"."ProtectionMethod_old";
ALTER TABLE "url_analytics" ALTER COLUMN "methodUsed" SET DEFAULT 'NONE';
ALTER TABLE "urls" ALTER COLUMN "protectionMethod" SET DEFAULT 'NONE';
COMMIT;

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "url_analytics" DROP CONSTRAINT "url_analytics_urlId_fkey";

-- DropForeignKey
ALTER TABLE "urls" DROP CONSTRAINT "urls_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "user_auth" DROP CONSTRAINT "user_auth_userId_fkey";

-- DropIndex
DROP INDEX "user_auth_email_key";

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "notificationBody" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_auth" ADD COLUMN     "providerId" TEXT;

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "type" "VerificationTokenType" NOT NULL,
    "data" JSONB,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_tokenHash_key" ON "sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_tokenHash_key" ON "verification_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "verification_tokens_userId_idx" ON "verification_tokens"("userId");

-- CreateIndex
CREATE INDEX "verification_tokens_expiresAt_idx" ON "verification_tokens"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_authProvider_providerId_key" ON "user_auth"("authProvider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_email_authProvider_key" ON "user_auth"("email", "authProvider");

-- AddForeignKey
ALTER TABLE "user_auth" ADD CONSTRAINT "user_auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "urls" ADD CONSTRAINT "urls_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "url_analytics" ADD CONSTRAINT "url_analytics_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "urls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
