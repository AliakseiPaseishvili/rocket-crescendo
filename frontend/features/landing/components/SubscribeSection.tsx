'use client';

import { SubscribeNewsletter } from '@/frontend/features/subscription';

import { LandingSection } from './LandingSection';

export const SubscribeSection = () => {
  return (
    <LandingSection id="subscribe" titleKey="subscribe">
      <SubscribeNewsletter />
    </LandingSection>
  );
};
