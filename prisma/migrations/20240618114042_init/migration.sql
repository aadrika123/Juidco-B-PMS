-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isSeen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);
