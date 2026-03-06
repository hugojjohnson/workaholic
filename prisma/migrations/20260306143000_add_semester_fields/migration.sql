-- Add semester columns as nullable first so we can backfill existing rows.
ALTER TABLE "Preferences" ADD COLUMN "semester" TEXT;
ALTER TABLE "Subject" ADD COLUMN "semester" TEXT;
ALTER TABLE "Log" ADD COLUMN "semester" TEXT;

-- Backfill all existing data into the requested semester bucket.
UPDATE "Preferences" SET "semester" = '2025S2' WHERE "semester" IS NULL;
UPDATE "Subject" SET "semester" = '2025S2' WHERE "semester" IS NULL;
UPDATE "Log" SET "semester" = '2025S2' WHERE "semester" IS NULL;

-- Make columns required going forward.
ALTER TABLE "Preferences" ALTER COLUMN "semester" SET NOT NULL;
ALTER TABLE "Subject" ALTER COLUMN "semester" SET NOT NULL;
ALTER TABLE "Log" ALTER COLUMN "semester" SET NOT NULL;

-- Replace subject uniqueness to allow the same subject name in different semesters.
DROP INDEX IF EXISTS "Subject_userId_name_key";
CREATE UNIQUE INDEX "Subject_userId_semester_name_key" ON "Subject"("userId", "semester", "name");

-- Add query-supporting indexes.
CREATE INDEX IF NOT EXISTS "Subject_userId_semester_order_idx" ON "Subject"("userId", "semester", "order");
CREATE INDEX IF NOT EXISTS "Log_userId_semester_startedAt_idx" ON "Log"("userId", "semester", "startedAt");
