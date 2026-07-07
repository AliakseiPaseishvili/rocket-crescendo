import type { CartApiTypes } from './cart';
import { CART_REQUEST_MAP } from './cart';
import type { CategoryApiTypes } from './categories';
import { CATEGORY_REQUEST_MAP } from './categories';
import type { CheckoutApiTypes } from './checkout';
import { CHECKOUT_REQUEST_MAP } from './checkout';
import type { FileApiTypes } from './files';
import { FILE_REQUEST_MAP } from './files';
import type { OrderApiTypes } from './orders';
import { ORDER_REQUEST_MAP } from './orders';
import type { ProductSectionApiTypes } from './product-sections';
import { PRODUCT_SECTION_REQUEST_MAP } from './product-sections';
import type { ProductApiTypes } from './products';
import { PRODUCT_REQUEST_MAP } from './products';
import type { SubscriptionApiTypes } from './subscription';
import { SUBSCRIPTION_REQUEST_MAP } from './subscription';
import { executeRequest } from './utils';
import type { VideoLessonApiTypes } from './video-lessons';
import { VIDEO_LESSON_REQUEST_MAP } from './video-lessons';

type ApiTypes = ProductApiTypes &
  CategoryApiTypes &
  FileApiTypes &
  OrderApiTypes &
  ProductSectionApiTypes &
  VideoLessonApiTypes &
  SubscriptionApiTypes &
  CheckoutApiTypes &
  CartApiTypes;

const REQUEST_MAP = { ...PRODUCT_REQUEST_MAP, ...CATEGORY_REQUEST_MAP, ...FILE_REQUEST_MAP, ...ORDER_REQUEST_MAP, ...PRODUCT_SECTION_REQUEST_MAP, ...VIDEO_LESSON_REQUEST_MAP, ...SUBSCRIPTION_REQUEST_MAP, ...CHECKOUT_REQUEST_MAP, ...CART_REQUEST_MAP };

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
