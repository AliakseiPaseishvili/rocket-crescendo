import type { NewsletterSubscriptionModel } from './types';
import { SubscriptionStatus } from '../../app/generated/prisma/enums';
import prisma from '../../prisma/prisma';

export class NewsletterSubscriptionRepository {
  async findByEmail(email: string): Promise<NewsletterSubscriptionModel | null> {
    return prisma.newsletterSubscription.findUnique({ where: { email } });
  }

  async findByToken(token: string): Promise<NewsletterSubscriptionModel | null> {
    return prisma.newsletterSubscription.findUnique({ where: { token } });
  }

  async upsertPending(
    email: string,
    token: string,
    tokenExpiresAt: Date,
  ): Promise<NewsletterSubscriptionModel> {
    return prisma.newsletterSubscription.upsert({
      where: { email },
      create: { email, status: SubscriptionStatus.PENDING, token, tokenExpiresAt },
      update: { status: SubscriptionStatus.PENDING, token, tokenExpiresAt },
    });
  }

  async upsertConfirmed(email: string): Promise<NewsletterSubscriptionModel> {
    return prisma.newsletterSubscription.upsert({
      where: { email },
      create: { email, status: SubscriptionStatus.CONFIRMED, token: null, tokenExpiresAt: null },
      update: { status: SubscriptionStatus.CONFIRMED, token: null, tokenExpiresAt: null },
    });
  }

  async confirm(id: string): Promise<NewsletterSubscriptionModel> {
    return prisma.newsletterSubscription.update({
      where: { id },
      data: { status: SubscriptionStatus.CONFIRMED, token: null, tokenExpiresAt: null },
    });
  }
}
