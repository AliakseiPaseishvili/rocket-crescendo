'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/frontend/constants';
import { useSession } from '@/frontend/features/auth';

import { NAV_ITEMS } from '../constants';

interface NavMobileMenuProps {
  onSelect?: () => void;
}

const LINK_CLASS =
  'rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors';

export const NavMobileMenu = ({ onSelect }: NavMobileMenuProps) => {
  const t = useTranslations('nav');
  const { data: session, isPending } = useSession();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.filter(({ key }) => key !== 'admin' || (!isPending && session?.user?.role === 'admin')).map(({ key, href }) => (
        <a key={href} href={href} onClick={onSelect} className={LINK_CLASS}>
          {t(key)}
        </a>
      ))}
      {!isPending && session?.user && (
        <a href={ROUTES.ORDERS} onClick={onSelect} className={LINK_CLASS}>
          {t('orders')}
        </a>
      )}
    </nav>
  );
};
