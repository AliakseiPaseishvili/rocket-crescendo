'use client';

import { useTranslation } from 'react-i18next';

import { NAV_ITEMS } from '../constants';

interface NavMobileMenuProps {
  onSelect?: () => void;
}

export const NavMobileMenu = ({ onSelect }: NavMobileMenuProps) => {
  const { t } = useTranslation('nav');

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
