-- CreateEnum
CREATE TYPE "ProductFileRole" AS ENUM ('MAIN_IMAGE', 'VIDEO', 'ADDITIONAL_IMAGE');

-- CreateTable
CREATE TABLE "ProductFile" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,
    "role" "ProductFileRole" NOT NULL,

    CONSTRAINT "ProductFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductFile" ADD CONSTRAINT "ProductFile_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFile" ADD CONSTRAINT "ProductFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
