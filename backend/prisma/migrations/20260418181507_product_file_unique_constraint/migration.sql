/*
  Warnings:

  - A unique constraint covering the columns `[productId,fileId]` on the table `ProductFile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductFile_productId_fileId_key" ON "ProductFile"("productId", "fileId");
