/*
  Warnings:

  - The primary key for the `Adjective` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Assignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `GameRoom` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Participant` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Adjective" DROP CONSTRAINT "Adjective_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Adjective" DROP CONSTRAINT "Adjective_gameRoomId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_adjective1Id_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_adjective2Id_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_adjective3Id_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_gameRoomId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_gifterId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_gameRoomId_fkey";

-- AlterTable
ALTER TABLE "Adjective" DROP CONSTRAINT "Adjective_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ALTER COLUMN "gameRoomId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Adjective_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Adjective_id_seq";

-- AlterTable
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "gifterId" SET DATA TYPE TEXT,
ALTER COLUMN "receiverId" SET DATA TYPE TEXT,
ALTER COLUMN "adjective1Id" SET DATA TYPE TEXT,
ALTER COLUMN "adjective2Id" SET DATA TYPE TEXT,
ALTER COLUMN "adjective3Id" SET DATA TYPE TEXT,
ALTER COLUMN "gameRoomId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Assignment_id_seq";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Category_id_seq";

-- AlterTable
ALTER TABLE "GameRoom" DROP CONSTRAINT "GameRoom_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "GameRoom_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "GameRoom_id_seq";

-- AlterTable
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "gameRoomId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Participant_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Participant_id_seq";

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "GameRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adjective" ADD CONSTRAINT "Adjective_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adjective" ADD CONSTRAINT "Adjective_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "GameRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_gifterId_fkey" FOREIGN KEY ("gifterId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_adjective1Id_fkey" FOREIGN KEY ("adjective1Id") REFERENCES "Adjective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_adjective2Id_fkey" FOREIGN KEY ("adjective2Id") REFERENCES "Adjective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_adjective3Id_fkey" FOREIGN KEY ("adjective3Id") REFERENCES "Adjective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "GameRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
