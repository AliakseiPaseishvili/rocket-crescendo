import { ProductFileRole } from '@/backend/app/generated/prisma/enums';
import type { FileModel } from '@/backend/features/file';

export function buildProductFiles(
  mainImage: FileModel | null,
  video: FileModel | null,
  additionalImages: FileModel[],
) {
  return [
    ...(mainImage ? [{ fileId: mainImage.id, role: ProductFileRole.MAIN_IMAGE }] : []),
    ...(video ? [{ fileId: video.id, role: ProductFileRole.VIDEO }] : []),
    ...additionalImages.map((f) => ({ fileId: f.id, role: ProductFileRole.ADDITIONAL_IMAGE })),
  ];
}
