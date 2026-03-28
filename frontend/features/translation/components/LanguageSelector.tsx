"use client";

import { ChevronDownIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useCallback } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";

import { languageLabels, supportedLngs } from "../constants";

export const LanguageSelector = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentLng = locale as (typeof supportedLngs)[number];

  const handleChange = useCallback(
    (lng: string) => {
      const segments = pathname.split("/");
      segments[1] = lng;
      router.push(segments.join("/"));
    },
    [pathname, router],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-2 py-1 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
        {languageLabels[currentLng] ?? currentLng}
        <ChevronDownIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={currentLng} onValueChange={handleChange}>
          {supportedLngs.map((lng) => (
            <DropdownMenuRadioItem key={lng} value={lng}>
              {languageLabels[lng]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
