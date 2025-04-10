/*
  Warnings:

  - You are about to drop the `Interview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WhatsAppMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Evaluation_cvId_jobRequirementId_key";

-- AlterTable
ALTER TABLE "Evaluation" ALTER COLUMN "status" SET DEFAULT 'pending';

-- DropTable
DROP TABLE "Interview";

-- DropTable
DROP TABLE "WhatsAppMessage";
