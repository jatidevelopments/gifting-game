-- CreateTable
CREATE TABLE "GameRoom" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pin" TEXT,
    "hasAccessed" BOOLEAN NOT NULL DEFAULT false,
    "gameRoomId" INTEGER NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adjective" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "gameRoomId" INTEGER NOT NULL,

    CONSTRAINT "Adjective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "gifterId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "adjective1Id" INTEGER NOT NULL,
    "adjective2Id" INTEGER NOT NULL,
    "adjective3Id" INTEGER NOT NULL,
    "accessUrl" TEXT NOT NULL,
    "gameRoomId" INTEGER NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameRoom_code_key" ON "GameRoom"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_name_gameRoomId_key" ON "Participant"("name", "gameRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "Adjective_word_gameRoomId_key" ON "Adjective"("word", "gameRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_accessUrl_key" ON "Assignment"("accessUrl");

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
