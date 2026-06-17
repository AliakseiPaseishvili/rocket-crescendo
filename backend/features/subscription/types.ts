export type { NewsletterSubscriptionModel } from '../../app/generated/prisma/models/NewsletterSubscription';

export type SubscribeInput = {
  email: string;
};

export type SubscribeResult = {
  status: 'pending' | 'confirmed';
};
