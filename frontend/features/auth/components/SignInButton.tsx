import { useTranslations } from 'next-intl';

import { Button } from '@/frontend/components/ui/button';
import { ROUTES } from '@/frontend/constants';

import { Link } from '../../translation/i18n/navigation';

export const SignInButton = () => {
  const t = useTranslations('auth');

  return (
    <Button asChild variant="outline" size="sm">
      <Link href={ROUTES.SIGN_IN}>{t('signIn.submit')}</Link>
    </Button>
  );
};
