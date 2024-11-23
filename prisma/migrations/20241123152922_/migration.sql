-- CreateTable
CREATE TABLE "GameRoom" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pin" TEXT,
    "hasAccessed" BOOLEAN NOT NULL DEFAULT false,
    "gameRoomId" TEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adjective" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "gameRoomId" TEXT NOT NULL,

    CONSTRAINT "Adjective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gifterId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "adjective1Id" TEXT NOT NULL,
    "adjective2Id" TEXT NOT NULL,
    "adjective3Id" TEXT NOT NULL,
    "gameRoomId" TEXT NOT NULL,
    "accessUrl" TEXT NOT NULL,
    "giftIdeas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "giftIdeaImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'PENDING_GIFT_IDEAS',

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

-- CreateIndex
CREATE INDEX "Assignment_gifterId_idx" ON "Assignment"("gifterId");

-- CreateIndex
CREATE INDEX "Assignment_receiverId_idx" ON "Assignment"("receiverId");

-- CreateIndex
CREATE INDEX "Assignment_gameRoomId_idx" ON "Assignment"("gameRoomId");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "GameRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adjective" ADD CONSTRAINT "Adjective_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adjective" ADD CONSTRAINT "Adjective_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "GameRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_gifterId_fkey" FOREIGN KEY ("gifterId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_adjective1Id_fkey" FOREIGN KEY ("adjective1Id") REFERENCES "Adjective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_adjective2Id_fkey" FOREIGN KEY ("adjective2Id") REFERENCES "Adjective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_adjective3Id_fkey" FOREIGN KEY ("adjective3Id") REFERENCES "Adjective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "GameRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
