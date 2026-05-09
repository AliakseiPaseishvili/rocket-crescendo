import type { CategoryApiTypes } from './categories';
import { CATEGORY_REQUEST_MAP } from './categories';
import type { FileApiTypes } from './files';
import { FILE_REQUEST_MAP } from './files';
import type { ProductSectionApiTypes } from './product-sections';
import { PRODUCT_SECTION_REQUEST_MAP } from './product-sections';
import type { ProductApiTypes } from './products';
import { PRODUCT_REQUEST_MAP } from './products';
import { executeRequest } from './utils';
import type { VideoLessonApiTypes } from './video-lessons';
import { VIDEO_LESSON_REQUEST_MAP } from './video-lessons';

type ApiTypes = ProductApiTypes & CategoryApiTypes & FileApiTypes & ProductSectionApiTypes & VideoLessonApiTypes;

const REQUEST_MAP = { ...PRODUCT_REQUEST_MAP, ...CATEGORY_REQUEST_MAP, ...FILE_REQUEST_MAP, ...PRODUCT_SECTION_REQUEST_MAP, ...VIDEO_LESSON_REQUEST_MAP };

export const api = Object.fromEntries(
  Object.entries(REQUEST_MAP).map(([key, { url, method }]) => [
    key,
    (options: Parameters<ApiTypes[keyof ApiTypes]>[0]) =>
      executeRequest({
        url,
        method,
        options,
      }),
  ]),
) as ApiTypes;
