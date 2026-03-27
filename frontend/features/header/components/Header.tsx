'use client';

import { useParams } from 'next/navigation';

import { ROUTES } from '@/frontend/constants';
import { CartButton } from '@/frontend/features/cart';
import { NavMenu } from '@/frontend/features/nav';
import { LanguageSelector } from '@/frontend/features/translation/components';
import { formUrlParams } from '@/frontend/utils/form-url';

import { BurgerMenu } from './BurgerMenu';


export const Header = () => {
  const { lng } = useParams<{ lng: string }>();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center gap-6 px-6">
        <a href={formUrlParams({ url: ROUTES.BASE, params: { lng } })} className="flex items-center gap-2 font-bold text-sm shrink-0">
          🚀 CyberShop ROCKET CRESCENDO
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex flex-1 items-center">
          <NavMenu />
        </div>
        <div className="hidden md:flex">
          <LanguageSelector />
        </div>

        {/* Cart — always visible */}
        <div className="ml-auto md:ml-0 flex items-center">
          <CartButton />
        </div>

        {/* Burger — mobile/tablet only */}
        <div className="md:hidden">
          <BurgerMenu />
        </div>
      </div>
    </header>
  );
};
