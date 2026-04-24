-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop foreign key constraints before altering column types
ALTER TABLE "Product" DROP CONSTRAINT IF EXISTS "Product_categoryId_fkey";
ALTER TABLE "ProductTranslation" DROP CONSTRAINT IF EXISTS "ProductTranslation_productId_fkey";
ALTER TABLE "ProductFile" DROP CONSTRAINT IF EXISTS "ProductFile_productId_fkey";
ALTER TABLE "ProductFile" DROP CONSTRAINT IF EXISTS "ProductFile_fileId_fkey";
ALTER TABLE "CategoryTranslation" DROP CONSTRAINT IF EXISTS "CategoryTranslation_categoryId_fkey";

-- Add temporary UUID columns
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "new_id" TEXT NOT NULL DEFAULT gen_random_uuid()::text;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "new_id" TEXT NOT NULL DEFAULT gen_random_uuid()::text;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "new_categoryId" TEXT;
ALTER TABLE "ProductTranslation" ADD COLUMN IF NOT EXISTS "new_id" TEXT NOT NULL DEFAULT gen_random_uuid()::text;
ALTER TABLE "ProductTranslation" ADD COLUMN IF NOT EXISTS "new_productId" TEXT;
ALTER TABLE "File" ADD COLUMN IF NOT EXISTS "new_id" TEXT NOT NULL DEFAULT gen_random_uuid()::text;
ALTER TABLE "ProductFile" ADD COLUMN IF NOT EXISTS "new_id" TEXT NOT NULL DEFAULT gen_random_uuid()::text;
ALTER TABLE "ProductFile" ADD COLUMN IF NOT EXISTS "new_productId" TEXT;
ALTER TABLE "ProductFile" ADD COLUMN IF NOT EXISTS "new_fileId" TEXT;
ALTER TABLE "CategoryTranslation" ADD COLUMN IF NOT EXISTS "new_id" TEXT NOT NULL DEFAULT gen_random_uuid()::text;
ALTER TABLE "CategoryTranslation" ADD COLUMN IF NOT EXISTS "new_categoryId" TEXT;

-- Populate new FK columns by joining on old integer IDs
UPDATE "Product" p SET "new_categoryId" = c."new_id"
  FROM "Category" c WHERE p."categoryId" = c."id";

UPDATE "ProductTranslation" pt SET "new_productId" = pr."new_id"
  FROM "Product" pr WHERE pt."productId" = pr."id";

UPDATE "ProductFile" pf SET "new_productId" = pr."new_id"
  FROM "Product" pr WHERE pf."productId" = pr."id";

UPDATE "ProductFile" pf SET "new_fileId" = f."new_id"
  FROM "File" f WHERE pf."fileId" = f."id";

UPDATE "CategoryTranslation" ct SET "new_categoryId" = c."new_id"
  FROM "Category" c WHERE ct."categoryId" = c."id";

-- Drop old PK/unique constraints/indexes
ALTER TABLE "Category" DROP CONSTRAINT IF EXISTS "Category_pkey";
ALTER TABLE "Product" DROP CONSTRAINT IF EXISTS "Product_pkey";
ALTER TABLE "ProductTranslation" DROP CONSTRAINT IF EXISTS "ProductTranslation_pkey";
DROP INDEX IF EXISTS "ProductTranslation_productId_language_key";
ALTER TABLE "File" DROP CONSTRAINT IF EXISTS "File_pkey";
ALTER TABLE "ProductFile" DROP CONSTRAINT IF EXISTS "ProductFile_pkey";
DROP INDEX IF EXISTS "ProductFile_productId_fileId_key";
ALTER TABLE "CategoryTranslation" DROP CONSTRAINT IF EXISTS "CategoryTranslation_pkey";
DROP INDEX IF EXISTS "CategoryTranslation_categoryId_language_key";

-- Drop old integer columns
ALTER TABLE "Category" DROP COLUMN IF EXISTS "id";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "id";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "categoryId";
ALTER TABLE "ProductTranslation" DROP COLUMN IF EXISTS "id";
ALTER TABLE "ProductTranslation" DROP COLUMN IF EXISTS "productId";
ALTER TABLE "File" DROP COLUMN IF EXISTS "id";
ALTER TABLE "ProductFile" DROP COLUMN IF EXISTS "id";
ALTER TABLE "ProductFile" DROP COLUMN IF EXISTS "productId";
ALTER TABLE "ProductFile" DROP COLUMN IF EXISTS "fileId";
ALTER TABLE "CategoryTranslation" DROP COLUMN IF EXISTS "id";
ALTER TABLE "CategoryTranslation" DROP COLUMN IF EXISTS "categoryId";

-- Rename new columns to canonical names (conditional to handle partial runs)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Category' AND column_name = 'new_id') THEN
    ALTER TABLE "Category" RENAME COLUMN "new_id" TO "id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Product' AND column_name = 'new_id') THEN
    ALTER TABLE "Product" RENAME COLUMN "new_id" TO "id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Product' AND column_name = 'new_categoryId') THEN
    ALTER TABLE "Product" RENAME COLUMN "new_categoryId" TO "categoryId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ProductTranslation' AND column_name = 'new_id') THEN
    ALTER TABLE "ProductTranslation" RENAME COLUMN "new_id" TO "id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ProductTranslation' AND column_name = 'new_productId') THEN
    ALTER TABLE "ProductTranslation" RENAME COLUMN "new_productId" TO "productId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'File' AND column_name = 'new_id') THEN
    ALTER TABLE "File" RENAME COLUMN "new_id" TO "id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ProductFile' AND column_name = 'new_id') THEN
    ALTER TABLE "ProductFile" RENAME COLUMN "new_id" TO "id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ProductFile' AND column_name = 'new_productId') THEN
    ALTER TABLE "ProductFile" RENAME COLUMN "new_productId" TO "productId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ProductFile' AND column_name = 'new_fileId') THEN
    ALTER TABLE "ProductFile" RENAME COLUMN "new_fileId" TO "fileId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'CategoryTranslation' AND column_name = 'new_id') THEN
    ALTER TABLE "CategoryTranslation" RENAME COLUMN "new_id" TO "id";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'CategoryTranslation' AND column_name = 'new_categoryId') THEN
    ALTER TABLE "CategoryTranslation" RENAME COLUMN "new_categoryId" TO "categoryId";
  END IF;
END $$;

-- Remove defaults (Prisma manages UUID generation in app layer)
ALTER TABLE "Category" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "ProductTranslation" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "File" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "ProductFile" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "CategoryTranslation" ALTER COLUMN "id" DROP DEFAULT;

-- Restore PK and unique constraints
ALTER TABLE "Category" ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");
ALTER TABLE "Product" ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");
ALTER TABLE "ProductTranslation" ADD CONSTRAINT "ProductTranslation_pkey" PRIMARY KEY ("id");
ALTER TABLE "ProductTranslation" ADD CONSTRAINT "ProductTranslation_productId_language_key" UNIQUE ("productId", "language");
ALTER TABLE "File" ADD CONSTRAINT "File_pkey" PRIMARY KEY ("id");
ALTER TABLE "ProductFile" ADD CONSTRAINT "ProductFile_pkey" PRIMARY KEY ("id");
ALTER TABLE "ProductFile" ADD CONSTRAINT "ProductFile_productId_fileId_key" UNIQUE ("productId", "fileId");
ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_pkey" PRIMARY KEY ("id");
ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_categoryId_language_key" UNIQUE ("categoryId", "language");

-- Restore foreign key constraints
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ProductTranslation" ADD CONSTRAINT "ProductTranslation_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProductFile" ADD CONSTRAINT "ProductFile_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProductFile" ADD CONSTRAINT "ProductFile_fileId_fkey"
  FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
