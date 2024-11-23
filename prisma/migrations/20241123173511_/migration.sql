/*
  Warnings:

  - The `status` column on the `Assignment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('PENDING_GIFT_IDEAS', 'PENDING_IMAGES', 'COMPLETED');

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "status",
ADD COLUMN     "status" "AssignmentStatus" NOT NULL DEFAULT 'PENDING_GIFT_IDEAS';
