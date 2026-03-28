'use client';

import { useTranslations } from 'next-intl';

import { NAV_ITEMS } from '../constants';

interface NavMobileMenuProps {
  onSelect?: () => void;
}

export const NavMobileMenu = ({ onSelect }: NavMobileMenuProps) => {
  const t = useTranslations('nav');

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ key, href }) => (
        <a
          key={href}
          href={href}
          onClick={onSelect}
          className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          {t(key)}
        </a>
      ))}
    </nav>
  );
};
