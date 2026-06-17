import type { SubscribeInput, SubscribeResult } from '@/backend/features/subscription';

import { HttpMethod, RequestApiType, RequestMap } from './types';

const SUBSCRIPTION_API_ROUTES = {
  SUBSCRIBE: '/api/subscription',
  CONFIRM: '/api/subscription/confirm',
} as const;

export type SubscriptionApiTypes = {
  subscribe: RequestApiType<SubscribeInput, undefined, undefined, SubscribeResult>;
  confirmSubscription: RequestApiType<{ token: string }, undefined, undefined, { status: string }>;
};

export const SUBSCRIPTION_REQUEST_MAP: RequestMap<SubscriptionApiTypes> = {
  subscribe: { url: SUBSCRIPTION_API_ROUTES.SUBSCRIBE, method: HttpMethod.POST },
  confirmSubscription: { url: SUBSCRIPTION_API_ROUTES.CONFIRM, method: HttpMethod.POST },
};
