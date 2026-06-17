import { randomUUID } from 'crypto';

import { sendSubscriptionConfirmEmail, sendSubscriptionWelcomeEmail } from '@/backend/features/emails';

import { NewsletterSubscriptionRepository } from './Subscription.repository';
import type { NewsletterSubscriptionModel, SubscribeInput, SubscribeResult } from './types';
import prisma from '../../prisma/prisma';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export class SubscriptionService {
  private readonly repository: NewsletterSubscriptionRepository;

  constructor() {
    this.repository = new NewsletterSubscriptionRepository();
  }

  async subscribe({ email }: SubscribeInput): Promise<SubscribeResult> {
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      throw new Error('A valid email is required');
    }

    // Already opted in — nothing to do, and no email to re-send.
    const existing = await this.repository.findByEmail(normalizedEmail);
    if (existing?.status === 'CONFIRMED') {
      return { status: 'confirmed' };
    }

    // Registered users are trusted: confirm immediately, skip the opt-in email.
    const registeredUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (registeredUser) {
      await this.repository.upsertConfirmed(normalizedEmail);
      await sendSubscriptionWelcomeEmail(normalizedEmail);
      return { status: 'confirmed' };
    }

    // Unknown email: double opt-in. Store a pending record and email a confirmation link.
    const token = randomUUID();
    const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL_MS);
    await this.repository.upsertPending(normalizedEmail, token, tokenExpiresAt);
    const confirmUrl = `${process.env.BETTER_AUTH_URL}/subscribe/confirm?token=${token}`;
    await sendSubscriptionConfirmEmail(normalizedEmail, confirmUrl);
    return { status: 'pending' };
  }

  async confirm(token: string): Promise<NewsletterSubscriptionModel> {
    if (!token?.trim()) throw new Error('A confirmation token is required');

    const subscription = await this.repository.findByToken(token);
    if (!subscription) throw new Error('Invalid or expired token');
    if (subscription.status === 'CONFIRMED') return subscription;
    if (subscription.tokenExpiresAt && subscription.tokenExpiresAt.getTime() < Date.now()) {
      throw new Error('Invalid or expired token');
    }

    const confirmed = await this.repository.confirm(subscription.id);
    await sendSubscriptionWelcomeEmail(confirmed.email);
    return confirmed;
  }
}
