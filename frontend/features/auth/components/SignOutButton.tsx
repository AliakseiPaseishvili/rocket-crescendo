'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/frontend/components/ui/button';

import { signOut } from '../auth-client';

interface SignOutButtonProps {
  className?: string;
}

export const SignOutButton = ({ className }: SignOutButtonProps) => {
  const t = useTranslations('auth');
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <Button variant="outline" className={className} onClick={handleSignOut}>
      {t('signOut.submit')}
    </Button>
  );
};
