/*
  Warnings:

  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: add as nullable, backfill with first category, then enforce NOT NULL
ALTER TABLE "Product" ADD COLUMN "categoryId" INTEGER;
UPDATE "Product" SET "categoryId" = (SELECT id FROM "Category" ORDER BY id LIMIT 1);
ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
