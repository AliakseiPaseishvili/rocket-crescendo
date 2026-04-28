-- Add new profile columns to user table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "lastName" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "nickname" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "gender" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "birthdate" TEXT;
