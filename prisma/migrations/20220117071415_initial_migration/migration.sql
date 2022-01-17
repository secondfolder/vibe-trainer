-- CreateTable
CREATE TABLE "prompts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "save_count" SMALLINT NOT NULL,
    "access_count" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "prompts_pkey" PRIMARY KEY ("id")
);
