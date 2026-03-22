"use client";

import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/frontend/components/ui/button";
import { NavMobileMenu } from "@/frontend/features/nav";
import { LanguageSelector } from "@/frontend/features/translation/components";

export const BurgerMenu = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X /> : <Menu />}
      </Button>

      {open &&
        createPortal(
          <div className="fixed inset-0 top-14 z-40 bg-background flex flex-col px-6 py-8 gap-6 overflow-y-auto">
            <NavMobileMenu onSelect={() => setOpen(false)} />
            <div className="flex">
              <LanguageSelector />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
