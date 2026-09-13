-- CreateTable
CREATE TABLE "user_deletions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "deletedByUserId" TEXT NOT NULL,
    "deletedByEmail" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_deletions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_deletions_deletedAt_idx" ON "user_deletions"("deletedAt");
