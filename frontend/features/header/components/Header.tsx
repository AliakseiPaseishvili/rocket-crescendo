"use client";

import { FC, ReactNode } from "react";

import { ROUTES } from "@/frontend/constants";
import { LanguageSelector } from "@/frontend/features/translation/components";
import { Link } from "@/frontend/features/translation/i18n/navigation";

import { BurgerMenu } from "./BurgerMenu";

interface HeaderProps {
  navItems?: ReactNode;
  rightActions?: ReactNode;
}

export const Header: FC<HeaderProps> = ({ navItems, rightActions }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 flex-row justify-between items-center gap-6 px-6">
        <Link
          href={ROUTES.BASE}
          className="flex items-center gap-2 font-bold text-sm shrink-0"
        >
          🚀 CyberShop ROCKET CRESCENDO
        </Link>

        {/* Desktop nav */}
        {navItems && (
          <div className="hidden md:flex flex-1 items-center">{navItems}</div>
        )}

        <div className="flex flex-row">
          <div className="hidden md:flex">
            <LanguageSelector />
          </div>

          {/* Right actions — always visible */}
          {rightActions && (
            <div className="ml-auto md:ml-0 flex items-center">
              {rightActions}
            </div>
          )}
        </div>

        {/* Burger — mobile/tablet only, only when navItems present */}
        {navItems && (
          <div className="md:hidden">
            <BurgerMenu />
          </div>
        )}
      </div>
    </header>
  );
};
