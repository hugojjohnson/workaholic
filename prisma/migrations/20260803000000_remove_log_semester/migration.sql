-- A log's semester is determined by its subject, so storing it here is redundant.
DROP INDEX IF EXISTS "Log_userId_semester_startedAt_idx";
ALTER TABLE "Log" DROP COLUMN "semester";
CREATE INDEX "Log_userId_startedAt_idx" ON "Log"("userId", "startedAt");
